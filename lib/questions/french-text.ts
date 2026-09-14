/** Stub previously shown when a Manzi question had no translations.fr.json entry. */
export const FR_TRANSLATION_PLACEHOLDER =
  "Traduction française à ajouter dans data/translations.fr.json — le texte suédois ci-dessus est la source.";

const SOFT_PLACEHOLDERS = new Set([
  FR_TRANSLATION_PLACEHOLDER,
  "Traduction bientôt disponible.",
]);

export function isRealFrenchText(text?: string | null): text is string {
  const value = text?.trim() ?? "";
  if (!value || SOFT_PLACEHOLDERS.has(value)) return false;
  return !/translations\.fr\.json|Traduction française à ajouter/i.test(value);
}
