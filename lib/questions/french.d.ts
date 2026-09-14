import type { QuestionTranslation } from "@/lib/types";

export const MISSING_FRENCH_STEM: string;
export function looksPlaceholderFrench(text?: string | null): boolean;
export function looksHybridFrench(text?: string | null): boolean;
export function looksUnusableFrench(text?: string | null): boolean;
export function frenchFromStore(
  frMap: Record<string, Partial<QuestionTranslation>>,
  question: { id: string; corpus?: string; explanation_fr?: string },
): QuestionTranslation;
