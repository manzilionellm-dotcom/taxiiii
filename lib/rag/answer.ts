import { QUESTIONS, getFrench, getQuestion } from "@/lib/questions/bank";
import { buildCorpus, searchCorpus, type SearchHit } from "@/lib/rag/search";
import type { ChatTurn, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

const MIN_SCORE = 2.4;

export function groundedFallback(query: string, locale: Locale, history: ChatTurn[]) {
  const dict = t(locale);
  const contextual = [query, ...history.slice(-4).map((turn) => turn.content)].join(" ");
  const hits = searchCorpus(buildCorpus(QUESTIONS), contextual, 5);
  if (!hits.length || hits[0].score < MIN_SCORE) {
    return {
      answer: dict.outOfCorpus,
      sources: [] as string[],
      grounded: false,
    };
  }
  return {
    answer: formatHits(hits, locale),
    sources: hits.map((hit) => hit.questionId),
    grounded: true,
  };
}

function formatHits(hits: SearchHit[], locale: Locale) {
  return hits
    .map((hit) => {
      const question = getQuestion(hit.questionId);
      if (!question) return "";
      const french = getFrench(question);
      const correct =
        question.options.find((option) => option.letter === question.answer)?.text ?? "";
      if (locale === "fr") {
        return [
          `[${question.id}] ${french.stem}`,
          `Svar / réponse: ${question.answer}. ${correct}`,
          question.explanation_fr,
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
) {
  const hits = searchCorpus(
    buildCorpus(QUESTIONS),
    [query, ...history.slice(-4).map((turn) => turn.content)].join(" "),
    5,
  );
  return { hits, ...groundedFallback(query, locale, history) };
}

export async function answerWithModel(
  query: string,
  locale: Locale,
  history: ChatTurn[],
): Promise<{ answer: string; sources: string[]; grounded: boolean }> {
  const fallback = groundedFallback(query, locale, history);
  const key = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;
  if (!key || !fallback.grounded) return fallback;

  const baseURL = process.env.AI_GATEWAY_API_KEY
    ? "https://ai-gateway.vercel.sh/v1"
    : "https://api.openai.com/v1";
  const model = process.env.AI_MODEL || "openai/gpt-4.1-mini";

  const system = [
    "You are a teoriprov tutor for Swedish license B and taxi.",
    "Answer ONLY from the CORPUS excerpts. Do not use parametric memory.",
    "If the corpus does not contain the answer, say you cannot answer from the bank.",
    "Keep the original Swedish question wording intact when quoting.",
    "Reply in the user's language (French or Swedish). Be conversational.",
    "Never invent laws, numbers, or streets that are not in the excerpts.",
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
