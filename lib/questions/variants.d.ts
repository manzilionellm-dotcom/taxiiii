import type { OptionLetter, QuestionOption, Topic } from "@/lib/types";

export type VariantForm =
  | "original"
  | "sibling"
  | "paraphrase"
  | "cloze"
  | "scenario"
  | "reverse"
  | "trap"
  | "image-first";

export const VARIANT_FORMS: VariantForm[];

export interface VariantSeed {
  id: string;
  topic: Topic | string;
  stem_sv: string;
  options?: QuestionOption[];
  answer?: OptionLetter | string;
  imageUrl?: string;
  trap?: string;
  conceptId?: string;
  variantOf?: string;
}

export function conceptIdFor(question?: { conceptId?: string; variantOf?: string; id?: string } | null): string;
export function normalizeAnswerText(question?: VariantSeed | null): string;
export function significantTokens(stem?: string | null): string[];
export function findSiblings(seed: VariantSeed, bank: VariantSeed[]): VariantSeed[];
export function paraphraseStem(stem?: string | null): string;
export function scenarioStem(stem?: string | null): string;
export function reverseStem(question?: VariantSeed | null): string;
export function trapStem(question?: VariantSeed | null): string;
export function availableForms(seed: VariantSeed, bank?: VariantSeed[]): VariantForm[];
export function pickVariantForm(
  seed: VariantSeed,
  lastForm?: string | null,
  bank?: VariantSeed[],
): VariantForm;
export function presentConcept<T extends VariantSeed>(
  seed: T,
  bank: T[],
  lastForm?: string | null,
): T & {
  conceptId: string;
  variantOf: string;
  form: VariantForm;
  imageFirst: boolean;
};
