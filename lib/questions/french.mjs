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

/**
 * Swedish street and place suffixes. These end in -en / -et like a definite
 * noun, so the rule above flagged them — and an address inside a French
 * sentence stays Swedish by necessity: the exam question sends the driver to
 * «Bäckvägen 14», and translating a street name would be a factual error.
 * Matched on capitalised words only, as part of a compound name.
 */
const SV_TOPONYM_SUFFIX =
  /(?:vägen|gatan|torget|platsen|leden|stigen|gränd|gränden|backen|bron|hamnen|lunden|parken|allén)$/u;

/**
 * Length is what separates the two kinds of capitalised -en word.
 *
 * What the suffix rule exists to catch is an untranslated common noun left
 * standing in a French sentence, and those are Swedish compounds:
 * «Beställningscentralen» (21), «Vägmärkeskombinationen» (22). What it kept
 * catching by accident are Swedish place names, which are short: «Kläppen»
 * (7), «Sälen» (5), «Bäckvägen» (9) — and a place name inside French has to
 * stay Swedish, since the question sends the driver there.
 *
 * Only this one path is relaxed. A lower-case word carrying å/ä/ö is still
 * Swedish outright, and a short Swedish common noun never travels alone — the
 * sentence around it trips the function-word set. Verified by the recall test:
 * all 1900 Swedish stems still fail the detector.
 */
const SV_COMPOUND_MIN = 12;

/**
 * Apostrophes split, so a French elision cannot hide the capital that follows
 * it: «d'Örebro» used to tokenise whole, read as a lower-case word carrying ö,
 * and get the sentence rejected as Swedish. Splitting turns it into "d" +
 * "Örebro" — a place name, which the capitalisation rule below allows. Nothing
 * Swedish relies on the apostrophe, so recall is unaffected.
 */
function words(value) {
  return String(value).split(/[^\p{L}\p{M}-]+/u).filter(Boolean);
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
    if (SV_TOPONYM_SUFFIX.test(lower)) continue;
    if (word.length < SV_COMPOUND_MIN) continue;
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
