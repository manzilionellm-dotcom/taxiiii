import { MISSING_FRENCH_STEM, looksUnusableFrench } from "./french.mjs";

export function displayFrench(text) {
  if (looksUnusableFrench(text)) return MISSING_FRENCH_STEM;
  return String(text).replace(/\s+/g, " ").trim();
}

export function firstSentence(text, max = 180) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const match = clean.match(/^(.+?[.!?])(?:\s|$)/);
  if (match?.[1] && match[1].length >= 8 && match[1].length <= max) return match[1];
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/**
 * The Swedish takeaway may quote the winning option verbatim. The French one
 * must not: pasting a Swedish option into «La bonne réponse est A — …» is the
 * hybrid gloss #19 removed. Without real French the French line names the
 * letter only, and the caller drops it when it is empty.
 */
export function takeawayFor(question, frenchExplanation) {
  const option = question.options.find((item) => item.letter === question.answer);
  const fallbackSv = option
    ? `Rätt svar är ${question.answer} — ${option.text}.`
    : `Rätt svar är ${question.answer}.`;
  const sv = firstSentence(question.explanation_sv) || fallbackSv;
  const frSource = looksUnusableFrench(frenchExplanation)
    ? question.explanation_fr
    : frenchExplanation;
  const frRaw = looksUnusableFrench(frSource) ? "" : firstSentence(frSource);
  return { sv, fr: frRaw || `La bonne réponse est ${question.answer}.` };
}

/**
 * `trap` is Manzi Swedish. Only surface the French line when the trap text is
 * itself real French — otherwise «Piège fréquent : <svenska>» is a hybrid.
 */
export function distractorNote(question) {
  const trap = String(question.trap || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!trap) return null;
  return {
    sv: `Vanlig fälla: ${trap}.`,
    fr: looksUnusableFrench(trap) ? "" : `Piège fréquent : ${trap}.`,
  };
}
