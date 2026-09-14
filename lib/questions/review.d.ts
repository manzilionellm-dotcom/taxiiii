import type { QuestionRecord } from "@/lib/types";

export function displayFrench(text?: string | null): string;
export function firstSentence(text: string, max?: number): string;
export function takeawayFor(
  question: Pick<QuestionRecord, "answer" | "options" | "explanation_sv" | "explanation_fr">,
  frenchExplanation?: string | null,
): { sv: string; fr: string };
export function distractorNote(question: Pick<QuestionRecord, "trap">): { sv: string; fr: string } | null;
