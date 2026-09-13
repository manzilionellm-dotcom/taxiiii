import type { QuestionRecord } from "@/lib/types";

const HIGH_FREQ =
  /vilotid|dygnsvila|taxameter|24 mån|heldragen|tidbok|prisräkn|jämförpris|11 timm|åtta timm|8 timm|prisuppgift|700/i;

/** Lionel's starter set — these YouTube/app traps come before other high-freq research. */
const STARTER_PATTERNS = [
  /heldragen|gul linje|gul-linje/i,
  /taxameter|24 mån|plomber/i,
  /vilotid|dygnsvila|11 timm|8 timm|6,5|6\.5/i,
  /tidbok/i,
  /prisräkn|jämförpris|prisuppgift|prisresa|700/i,
];

function haystack(question: QuestionRecord): string {
  return [question.id, question.stem_sv, question.trap ?? "", question.source ?? ""].join(" ");
}

export function starterRank(question: QuestionRecord): number {
  const text = haystack(question);
  const index = STARTER_PATTERNS.findIndex((pattern) => pattern.test(text));
  return index === -1 ? STARTER_PATTERNS.length : index;
}

export function studyPriority(question: QuestionRecord): number {
  const research = question.corpus === "research";
  const high =
    question.freq === "high" || HIGH_FREQ.test(haystack(question));
  if (research && high) return 0;
  if (research) return 1;
  return 2;
}

export function compareStudyOrder(a: QuestionRecord, b: QuestionRecord): number {
  const delta = studyPriority(a) - studyPriority(b);
  if (delta !== 0) return delta;
  const start = starterRank(a) - starterRank(b);
  if (start !== 0) return start;
  const rank = (item: QuestionRecord) =>
    item.freq === "high" ? 0 : item.freq === "medium" ? 1 : 2;
  return rank(a) - rank(b) || a.id.localeCompare(b.id);
}

export function sortForStudy(questions: QuestionRecord[]): QuestionRecord[] {
  const remaining = [...questions];
  const head: QuestionRecord[] = [];
  for (const pattern of STARTER_PATTERNS) {
    const index = remaining.findIndex(
      (question) => studyPriority(question) === 0 && pattern.test(haystack(question)),
    );
    if (index !== -1) head.push(...remaining.splice(index, 1));
  }
  remaining.sort(compareStudyOrder);
  return [...head, ...remaining];
}
