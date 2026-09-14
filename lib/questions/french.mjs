/** #14: empty stem when there is no real FR — never invent a stub. */
export const MISSING_FRENCH_STEM = "";

export function looksPlaceholderFrench(text) {
  if (!text || !String(text).trim()) return true;
  return /translations\.fr\.json|Traduction française à ajouter|Traduction bientôt disponible|Traduction littérale\s*:/i.test(
    String(text),
  );
}

/**
 * Frames the fill-fr-stems / facit generators wrapped around Swedish content:
 * «Bonne réponse : C — 3,0 meter. Thème : … Explication (débutant) : <svenska>».
 * The French shell is real, the payload is not, so the whole line is unusable.
 */
const GENERATED_FRAME =
  /Explication\s*\((?:SV|svenska|débutant|debutant)\)|Mots-clés\s*FR\s*:|Thème\s*:\s*(?:les|la|l'|le)\b/iu;

/**
 * Swedish stem openers the word-gloss pass left untouched. Only the two the
 * function-word list below does not already cover. `En `, `Ett `, `Det `,
 * `Var ` and `Du ` are deliberately absent: «En accélérant…» and «Du 1er
 * octobre au 15 avril» are ordinary French and must not be flagged.
 */
const SV_STEM_START = /^(Hur |När )/u;

/**
 * Swedish terms we deliberately keep inside French sentences — they are the
 * words the student must recognise on the real exam paper.
 */
const LOANWORDS = new Set([
  "tidbok",
  "tidboken",
  "tidboksbladet",
  "tidboksblad",
  "dygnsvila",
  "dygnsvilan",
  "veckovila",
  "veckovilan",
  "jämförpris",
  "jämförpriset",
  "summatariff",
  "summatariffen",
  "taxameter",
  "taxametern",
  "taxiförarlegitimation",
  "taxiförarlegitimationen",
  "färdtjänst",
  "färdtjänsten",
  "beställningscentral",
  "beställningscentralen",
  "körkort",
  "körkortet",
  "teoriprov",
  "teoriprovet",
  "trafikverket",
  "transportstyrelsen",
  "skatteverket",
  "bolagsverket",
  "körkortgo",
]);

/**
 * Swedish function words with no French homograph. `du`, `en`, `de`, `des`,
 * `par`, `mer`, `son`, `ton`, `ni`, `os`, `car` and `as` are deliberately
 * absent: they are ordinary French and would flag real translations.
 */
const SV_FUNCTION_WORDS = new Set([
  "att",
  "och",
  "inte",
  "det",
  "den",
  "som",
  "har",
  "kan",
  "ska",
  "skall",
  "till",
  "med",
  "eller",
  "men",
  "vid",
  "finns",
  "vara",
  "blir",
  "bli",
  "mellan",
  "andra",
  "alla",
  "efter",
  "innan",
  "utan",
  "genom",
  "varje",
  "mycket",
  "din",
  "ditt",
  "dina",
  "jag",
  "han",
  "hon",
  "dem",
  "ett",
  "vad",
  "vilken",
  "vilket",
  "vilka",
  "vem",
  "bara",
  "redan",
  "minst",
  "detta",
  "denna",
  "dessa",
  "ingen",
  "inget",
  "inga",
  "inom",
  "enligt",
  "eftersom",
  "sedan",
  "samma",
  "aldrig",
  "alltid",
  "kanske",
  "ingenting",
  "hela",
  "flera",
  "sina",
  "sitt",
  "sin",
  "deras",
  "vilken",
  "meter",
  "gäller",
]);

/** å, ä and ö do not exist in French orthography. */
const SWEDISH_VOWELS = /[åäöÅÄÖ]/u;

/**
 * Swedish definite / plural endings. Used only on capitalised words that also
 * carry å, ä or ö, so «Beställningscentralen» is caught while the place names a
 * French sentence may legitimately name (Örebro, Göteborg, Åre, Malmö) are not.
 */
const SV_NOUN_SUFFIX = /(?:en|et|ens|ets|na|arna|orna|erna|ande|ning|ningen)$/u;

function words(value) {
  return String(value).split(/[^\p{L}\p{M}'’-]+/u).filter(Boolean);
}

/**
 * True when a French line still carries Swedish. Two independent signals:
 *
 * 1. Orthography — a lower-case word containing å/ä/ö can only be Swedish,
 *    because French has no such letters. Capitalised words are left alone so
 *    place names (Örebro, Göteborg, Åre) stay legal inside French.
 * 2. Function words — Swedish glue (att, och, inte, som …) chosen so that no
 *    entry is also a French word.
 *
 * A blacklist of content words can never be complete; these two are closed
 * sets, so new Swedish leftovers are caught without maintaining the list.
 */
export function looksHybridFrench(text) {
  const value = String(text || "").trim();
  if (!value) return false;
  if (GENERATED_FRAME.test(value)) return true;
  if (SV_STEM_START.test(value)) return true;
  for (const word of words(value)) {
    const lower = word.toLocaleLowerCase("sv-SE");
    if (LOANWORDS.has(lower)) continue;
    if (SV_FUNCTION_WORDS.has(lower)) return true;
    if (!SWEDISH_VOWELS.test(word)) continue;
    const capitalised = word[0] !== lower[0];
    if (!capitalised) return true;
    if (SV_NOUN_SUFFIX.test(lower)) return true;
  }
  return false;
}

export function looksUnusableFrench(text) {
  return looksPlaceholderFrench(text) || looksHybridFrench(text);
}

function usableText(text) {
  if (looksUnusableFrench(text)) return "";
  return String(text).replace(/\s+/g, " ").trim();
}

function usableOptions(options) {
  if (!options || typeof options !== "object") return null;
  const out = {};
  for (const [letter, text] of Object.entries(options)) {
    const clean = usableText(text);
    if (clean) out[letter] = clean;
  }
  return Object.keys(out).length ? out : null;
}

/**
 * One French record per question: stem, per-option text and the LÖSNING
 * explanation. `data/translations.fr.json` wins; a question's own
 * `explanation_fr` is the fallback and is dropped when it is a hybrid.
 *
 * The explanation is never promoted into `stem`: a stem slot holding the
 * explanation spoils the answer before the student has picked one.
 */
export function frenchFromStore(frMap, question) {
  const hit = (frMap && frMap[question?.id]) || {};
  const stem = usableText(hit.stem);
  const options = usableOptions(hit.options);
  const explanation = usableText(hit.explanation) || usableText(question?.explanation_fr);
  return {
    stem,
    ...(options ? { options } : {}),
    ...(explanation ? { explanation } : {}),
  };
}
