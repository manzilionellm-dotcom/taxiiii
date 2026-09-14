import { looksUnusableFrench } from "@/lib/questions/french.mjs";

/** Stub previously shown when a Manzi question had no translations.fr.json entry. */
export const FR_TRANSLATION_PLACEHOLDER =
  "Traduction française à ajouter dans data/translations.fr.json — le texte suédois ci-dessus est la source.";

export function isRealFrenchText(text?: string | null): text is string {
  const value = text?.trim() ?? "";
  if (!value) return false;
  return !looksUnusableFrench(value);
}
