import { MISSING_FRENCH_STEM, looksPlaceholderFrench } from "./french.mjs";

export function displayFrench(text) {
  if (looksPlaceholderFrench(text)) return MISSING_FRENCH_STEM;
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

export function takeawayFor(question) {
  const option = question.options.find((item) => item.letter === question.answer);
  const fallbackSv = option
    ? `Rätt svar är ${question.answer} — ${option.text}.`
    : `Rätt svar är ${question.answer}.`;
  const fallbackFr = option
    ? `La bonne réponse est ${question.answer} — ${option.text}.`
    : `La bonne réponse est ${question.answer}.`;
  const sv = firstSentence(question.explanation_sv) || fallbackSv;
  const frRaw = looksPlaceholderFrench(question.explanation_fr)
    ? ""
    : firstSentence(question.explanation_fr);
  return { sv, fr: frRaw || fallbackFr };
}

export function distractorNote(question) {
  const trap = String(question.trap || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!trap) return null;
  return {
    sv: `Vanlig fälla: ${trap}.`,
    fr: `Piège fréquent : ${trap}.`,
  };
}
