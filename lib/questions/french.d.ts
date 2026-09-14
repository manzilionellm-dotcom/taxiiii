export const MISSING_FRENCH_STEM: string;
export function looksPlaceholderFrench(text?: string | null): boolean;
export function frenchFromStore<T extends { stem?: string }>(
  frMap: Record<string, T>,
  question: { id: string; corpus?: string; explanation_fr?: string },
): T | { stem: string };
