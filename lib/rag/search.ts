import type { QuestionRecord } from "@/lib/types";

export interface CorpusDoc {
  id: string;
  questionId: string;
  text: string;
  imageUrl?: string;
}

export interface SearchHit {
  id: string;
  questionId: string;
  score: number;
  snippet: string;
}

const STOP = new Set([
  "och",
  "att",
  "det",
  "en",
  "ett",
  "som",
  "på",
  "är",
  "av",
  "för",
  "med",
  "till",
  "de",
  "du",
  "jag",
  "the",
  "a",
  "le",
  "la",
  "les",
  "un",
  "une",
  "des",
  "et",
  "de",
  "du",
  "que",
  "qui",
  "dans",
  "pour",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 1 && !STOP.has(token));
}

export function buildCorpus(questions: QuestionRecord[]): CorpusDoc[] {
  return questions.map((question) => ({
    id: `q:${question.id}`,
    questionId: question.id,
    imageUrl: question.imageUrl,
    text: [
      question.id,
      question.topic,
      question.stem_sv,
      question.options.map((option) => `${option.letter}. ${option.text}`).join(" "),
      question.explanation_sv,
      question.explanation_fr,
      question.imageUrl ? `bild image ${question.imageUrl}` : "",
      question.source ?? "",
    ]
      .filter(Boolean)
      .join("\n"),
  }));
}

export function searchCorpus(docs: CorpusDoc[], query: string, limit = 5): SearchHit[] {
  const terms = tokenize(query);
  if (!terms.length) return [];

  return docs
    .map((doc) => {
      const hay = tokenize(doc.text);
      const counts = new Map<string, number>();
      for (const token of hay) counts.set(token, (counts.get(token) ?? 0) + 1);
      let score = 0;
      for (const term of terms) {
        if (counts.has(term)) score += 2 + Math.min(counts.get(term) ?? 0, 3);
        else {
          for (const token of counts.keys()) {
            if (token.startsWith(term) || term.startsWith(token)) {
              score += 0.6;
              break;
            }
          }
        }
      }
      const snippet = doc.text.split("\n")[2] ?? doc.text.slice(0, 180);
      return { id: doc.id, questionId: doc.questionId, score, snippet };
    })
    .filter((hit) => hit.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
