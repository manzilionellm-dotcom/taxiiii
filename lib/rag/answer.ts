import extras from "@/data/rag-extras.json";
import { QUESTIONS, getFrench, getQuestion } from "@/lib/questions/bank";
import { isRealFrenchText } from "@/lib/questions/french-text";
import { youtubeDocs } from "@/lib/rag/extras";
import { buildQuestionDocs, searchCorpus, type SearchHit } from "@/lib/rag/search";
import type { ChatTurn, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

const MIN_SCORE = 2.4;

const FOLLOW_UP =
  /^(et |and |explique|förklara|pourquoi|varför|comment |hur |det |ça |cette |den |plus|encore|same|même|samma)/i;

function isFollowUp(query: string) {
  const words = query.trim().split(/\s+/);
  return FOLLOW_UP.test(query.trim()) || words.length <= 3;
}

function allDocs() {
  return [...buildQuestionDocs(QUESTIONS), ...youtubeDocs()];
}

export function retrieveHits(query: string, history: ChatTurn[], recentMisses: string[] = []): SearchHit[] {
  const docs = allDocs();
  const missHint = recentMisses
    .map((id) => getQuestion(id))
    .filter(Boolean)
    .map((question) => `${question!.id} ${question!.stem_sv}`)
    .join(" ");
  const enriched = missHint && /förklara|explique|denna|cette|frågan|question|miss|fel/i.test(query)
    ? `${query} ${missHint}`
    : query;
  const direct = searchCorpus(docs, enriched, 5);
  if (direct.length && direct[0].score >= MIN_SCORE) return direct;
  if (isFollowUp(query) && history.length) {
    const previousUser = [...history].reverse().find((turn) => turn.role === "user")?.content ?? "";
    const contextual = searchCorpus(docs, `${query} ${previousUser} ${missHint}`, 5);
    if (contextual.length && contextual[0].score >= MIN_SCORE) return contextual;
  }
  return [];
}

export function groundedFallback(
  query: string,
  locale: Locale,
  history: ChatTurn[],
  recentMisses: string[] = [],
) {
  const dict = t(locale);
  const hits = retrieveHits(query, history, recentMisses);
  if (!hits.length) {
    return {
      answer: dict.outOfCorpus,
      sources: [] as string[],
      grounded: false,
    };
  }
  return {
    answer: formatTeacherHits(hits, locale, query),
    sources: hits.map((hit) => hit.questionId),
    grounded: true,
  };
}

function formatTeacherHits(hits: SearchHit[], locale: Locale, query: string) {
  const drill = /förhör|interroge|quiz|5 min|fem min/i.test(query);
  const primary = formatHits(hits.slice(0, drill ? 3 : 1), locale);
  if (locale === "fr") {
    const open = drill
      ? "On reste cinq minutes, un item à la fois. Lis le suédois d'abord — je t'aide ensuite."
      : "Avant la solution : qu'est-ce que tu répondrais, en une phrase ?";
    return `${open}\n\n${primary}`;
  }
  const open = drill
    ? "Vi tar fem minuter, en sak i taget. Läs svenskan först — sen hjälper jag."
    : "Innan lösningen: vad skulle du svara, med en mening?";
  return `${open}\n\n${primary}`;
}

function formatHits(hits: SearchHit[], locale: Locale) {
  const notes = extras as { id: string; title: string; text_sv: string; text_fr?: string }[];
  return hits
    .map((hit) => {
      const note = notes.find((item) => item.id === hit.questionId || item.id === hit.id);
      if (note) {
        return locale === "fr"
          ? `[${note.id}] ${note.title}\n${note.text_fr ?? note.text_sv}`
          : `[${note.id}] ${note.title}\n${note.text_sv}`;
      }
      const question = getQuestion(hit.questionId);
      if (!question) return hit.snippet || "";
      const french = getFrench(question);
      const correct =
        question.options.find((option) => option.letter === question.answer)?.text ?? "";
      if (locale === "fr") {
        return [
          `[${question.id}] ${isRealFrenchText(french.stem) ? french.stem : question.stem_sv}`,
          `Svar / réponse: ${question.answer}. ${correct}`,
          isRealFrenchText(question.explanation_fr) ? question.explanation_fr : question.explanation_sv,
          question.imageUrl ? `Bild / image: ${question.imageUrl}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      }
      return [
        `[${question.id}] ${question.stem_sv}`,
        `Svar: ${question.answer}. ${correct}`,
        question.explanation_sv,
        question.imageUrl ? `Bild: ${question.imageUrl}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

export function buildGroundedMessages(
  query: string,
  locale: Locale,
  history: ChatTurn[],
  recentMisses: string[] = [],
) {
  return {
    hits: retrieveHits(query, history, recentMisses),
    ...groundedFallback(query, locale, history, recentMisses),
  };
}

export async function answerWithModel(
  query: string,
  locale: Locale,
  history: ChatTurn[],
  recentMisses: string[] = [],
): Promise<{ answer: string; sources: string[]; grounded: boolean }> {
  const fallback = groundedFallback(query, locale, history, recentMisses);
  const key = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;
  if (!key || !fallback.grounded) return fallback;

  const baseURL = process.env.AI_GATEWAY_API_KEY
    ? "https://ai-gateway.vercel.sh/v1"
    : "https://api.openai.com/v1";
  const model = process.env.AI_MODEL || "openai/gpt-4.1-mini";

  const system = [
    "You are the in-app teacher for KörkortGO: Enseignant (FR) / Lärare (SV).",
    "Persona: calm senior Swedish taxi-theory teacher who scaffolds in French. No slang, no cheerleading, no walls of text.",
    "Answer ONLY from the CORPUS excerpts. Zero hallucination. Do not use parametric memory.",
    "If the corpus does not contain the answer, reply exactly with the out-of-corpus line: French « Je ne l'ai pas dans le cours — on reste sur le corpus. » or Swedish « Det finns inte i kursen — vi håller oss till korpusen. »",
    "Pedagogy: Socratic when useful — ask one short recall question first, then explain. Correct hard Swedish words. Keep turns short (5–10 min energy).",
    "Speak French for meaning and keep Swedish exam wording intact when quoting stems.",
    "You may walk through a PDF-page / tariff / vilotid / taxameter item that is in the excerpts. Never invent law, numbers, streets, or new Manzi items.",
    "If the student asks to be quizzed, ask one corpus question at a time and wait.",
    `CORPUS:\n${fallback.answer}`,
  ].join("\n");

  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        messages: [
          { role: "system", content: system },
          ...history.slice(-6).map((turn) => ({
            role: turn.role,
            content: turn.content,
          })),
          { role: "user", content: query },
        ],
      }),
    });
    if (!response.ok) return fallback;
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return fallback;
    return { answer: content, sources: fallback.sources, grounded: true };
  } catch {
    return fallback;
  }
}
