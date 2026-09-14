/**
 * Concept-level study variants. Same fact, a different natural form.
 * Never changes the answer key or invents new law.
 */

export const VARIANT_FORMS = [
  "original",
  "sibling",
  "paraphrase",
  "cloze",
  "scenario",
  "reverse",
  "trap",
  "image-first",
];

const STOP = new Set(
  "du ska att en ett och på av för med som den det är om vid till har din ditt eller vilken vad hur när inte vara kan din taxi bilen i en ett de dem den det från efter innan under mellan mot utan inom".split(
    /\s+/,
  ),
);

export function conceptIdFor(question) {
  return question?.conceptId || question?.variantOf || question?.id || "";
}

export function normalizeAnswerText(question) {
  const option = question?.options?.find((item) => item.letter === question.answer);
  return String(option?.text || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("sv");
}

export function significantTokens(stem) {
  return String(stem || "")
    .toLocaleLowerCase("sv")
    .replace(/[^a-zåäö0-9\s-]/gi, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP.has(word));
}

export function findSiblings(seed, bank) {
  const answer = normalizeAnswerText(seed);
  if (!answer || answer.length < 2) return [];
  const tokens = new Set(significantTokens(seed.stem_sv));
  if (tokens.size < 2) return [];
  return (bank || []).filter((question) => {
    if (!question || question.id === seed.id) return false;
    if (question.topic !== seed.topic) return false;
    if (normalizeAnswerText(question) !== answer) return false;
    const other = significantTokens(question.stem_sv);
    const overlap = other.filter((token) => tokens.has(token)).length;
    return overlap >= 2;
  });
}

const PARAPHRASE_RULES = [
  [/^Du ska köra /, "Du har i uppdrag att köra "],
  [/^Du ska /, "Du behöver "],
  [/^Du kör taxi och /, "Du kör och "],
  [/^Du kör /, "Under körning: "],
  [/^Vad är rätt om /, "Vilket påstående stämmer om "],
  [/^Vad gäller(?: det)? för /, "Vad är korrekt om "],
  [/^Vilken tariff ska du använda om /, "Vilken tariff gäller när "],
  [/^Vilken tariff ska du använda/, "Vilken tariff ska användas"],
  [/^Hur mycket /, "Hur stor är "],
  [/^När måste du /, "Vid vilket tillfälle måste du "],
  [/^När ska du /, "När behöver du "],
  [/^När /, "Vid vilken tidpunkt "],
  [/^Vem ansvarar /, "Vem har ansvaret "],
  [/^Vem /, "Vilken aktör "],
];

export function paraphraseStem(stem) {
  const value = String(stem || "").trim();
  if (!value) return value;
  for (const [pattern, replacement] of PARAPHRASE_RULES) {
    if (pattern.test(value)) {
      const next = value.replace(pattern, replacement);
      if (next && next !== value) return next;
    }
  }
  if (!/^Vad är rätt\?/.test(value)) return `Vad är rätt? ${value}`;
  return value;
}

export function scenarioStem(stem) {
  const value = String(stem || "").trim();
  const next = value
    .replace(/\b1\s*-\s*3 personer\b/gi, "två personer")
    .replace(/\btre personer\b/gi, "3 personer")
    .replace(/\bpå en söndag\b/gi, "en söndag")
    .replace(/\ben söndag\b/gi, "på söndag")
    .replace(/\bkl\.?\s*/gi, "klockan ");
  if (next !== value) return next;
  return paraphraseStem(value);
}

export function reverseStem(question) {
  const stem = String(question?.stem_sv || "").replace(/\?\s*$/, "");
  return `Vilket alternativ stämmer för den här situationen: ${stem}?`;
}

export function trapStem(question) {
  const stem = String(question?.stem_sv || "").trim();
  const trap = String(question?.trap || "").replace(/\s+/g, " ").trim();
  if (!trap) return paraphraseStem(stem);
  const base = stem.replace(/\?\s*$/, "");
  return `${base}? (Undvik den vanliga fällan «${trap}».)`;
}

export function availableForms(seed, bank) {
  const forms = [];
  if (findSiblings(seed, bank).length) forms.push("sibling");
  if (seed?.imageUrl) forms.push("image-first");
  if (seed?.trap) forms.push("trap");
  forms.push("paraphrase", "reverse", "scenario", "cloze");
  return forms;
}

export function pickVariantForm(seed, lastForm, bank) {
  const forms = availableForms(seed, bank).filter((form) => form !== lastForm && form !== "original");
  return forms[0] || "paraphrase";
}

export function presentConcept(seed, bank, lastForm) {
  const form = pickVariantForm(seed, lastForm || "original", bank);
  const conceptId = conceptIdFor(seed);
  if (form === "sibling") {
    const sibling = findSiblings(seed, bank)[0];
    if (sibling) {
      return {
        ...sibling,
        conceptId,
        variantOf: seed.id,
        form: "sibling",
        imageFirst: false,
      };
    }
  }
  let stem_sv = seed.stem_sv;
  if (form === "paraphrase") stem_sv = paraphraseStem(seed.stem_sv);
  else if (form === "scenario") stem_sv = scenarioStem(seed.stem_sv);
  else if (form === "reverse") stem_sv = reverseStem(seed);
  else if (form === "trap") stem_sv = trapStem(seed);
  return {
    ...seed,
    stem_sv,
    conceptId,
    variantOf: seed.id,
    form,
    imageFirst: form === "image-first",
  };
}
