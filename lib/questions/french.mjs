/** #14: empty stem when there is no real FR — never invent a stub. */
export const MISSING_FRENCH_STEM = "";

const EXPLANATION_CORPORA = new Set([
  "research",
  "owner-seed",
  "owner-official",
  "owner-import",
]);

export function looksPlaceholderFrench(text) {
  if (!text || !String(text).trim()) return true;
  return /translations\.fr\.json|Traduction française à ajouter|Traduction bientôt disponible|Traduction littérale\s*:/i.test(
    String(text),
  );
}

export function frenchFromStore(frMap, question) {
  const hit = frMap[question.id];
  if (hit && typeof hit.stem === "string" && !looksPlaceholderFrench(hit.stem)) {
    return hit;
  }
  if (
    EXPLANATION_CORPORA.has(question.corpus || "") &&
    !looksPlaceholderFrench(question.explanation_fr)
  ) {
    return { stem: String(question.explanation_fr).trim() };
  }
  return { stem: "" };
}
