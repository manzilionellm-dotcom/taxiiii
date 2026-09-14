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

/**
 * fill-fr-stems word-gloss leftovers: Swedish content still sitting in the FR line.
 * Loanwords we keep on purpose (tidbok, dygnsvila, jämförpris) are stripped first.
 */
const SV_STEM_START =
  /^(Du |Efter |Din |Ditt |Hur |Vad |När |Vem |Vilken |Vilket |Var |En |Ett )/u;

const SV_LEFTOVER =
  /\b(?:gör|göra|börjar|köra|sluta|börja|nästa|enligt|uppehåll|arbetet|vilotids|förordning|bestämmelser|ifylld|skyldig|påbörja(?:t)?|viloperiod|fulltecknat|glömt|gäller|upptäcker|jobba(?:r)?|fylla|kalenderdygn|avslutad|riktigt|arbetstid|timmars|ledighet(?:en)?|måndag|tisdag|onsdag|torsdag|fredag|lördag|söndag(?:en)?|hemresan|långkörning|förvärvarbetat|följande|följden|omfattas|vägtransporter|tillfälliga|avvikelser|reglar|köruppdrag|beräknas|återlämna|arbetsgivare|poliskontroll|tillräcklig|taxiföretag|vilotidboken|maximalt|bryt(?:er)?|tidboks|anteckningar|anteckna|personliga|anställd(?:s)?|kört|besked|senaste|senast|veckors|körningen|vecka|boken|lediga|dina|augusti|oktober|igen|ledig|klockan|mellan|efter|innan|tillbaka|ytterligare|varje|tillfälle|denna|igensatt|baktill|jobbar|vilotidbok|ska|måste|inte|från|före|mot|och|är|att|då|hur|vilken|vilket|vem|kör|vara|bli|taxiförare|vilar|utföra|kunna|påbörja|luftfilter|föreståndare|årsredovisning|affärshändelse|årsbokslut|sjuklön)\b/iu;

const LOANWORDS =
  /\b(?:tidbok(?:en|sbladet)?|dygnsvila(?:n)?|jämförpris(?:et)?|summatariff|taxiförarlegitimation(?:en)?|taxameter(?:n)?)\b/giu;

export function looksHybridFrench(text) {
  const value = String(text || "").trim();
  if (!value) return false;
  if (SV_STEM_START.test(value)) return true;
  const withoutLoans = value.replace(LOANWORDS, "");
  return SV_LEFTOVER.test(withoutLoans);
}

export function looksUnusableFrench(text) {
  return looksPlaceholderFrench(text) || looksHybridFrench(text);
}

export function frenchFromStore(frMap, question) {
  const hit = frMap[question.id];
  if (hit && typeof hit.stem === "string" && !looksUnusableFrench(hit.stem)) {
    return hit;
  }
  if (
    EXPLANATION_CORPORA.has(question.corpus || "") &&
    !looksUnusableFrench(question.explanation_fr)
  ) {
    return { stem: String(question.explanation_fr).trim() };
  }
  return { stem: "" };
}
