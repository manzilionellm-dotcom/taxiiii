import lexiconRaw from "@/data/sv-fr-lexicon.json";
import { HARD_WORDS } from "@/lib/hard-words";
import {
  isGlossableWord,
  lemmaCandidates,
  normalizeToken,
  splitGlossPieces,
} from "@/lib/glossary-core.mjs";

export { GLOSS_HOLD_MS, isGlossableWord, splitGlossPieces } from "@/lib/glossary-core.mjs";

export interface GlossHit {
  surface: string;
  lemma: string;
  fr: string;
  phonetic?: string;
  source: string;
}

type LexiconEntry = {
  lemma: string;
  fr: string;
  source?: string;
  phonetic?: string;
};

const LEXICON = lexiconRaw as Record<string, LexiconEntry>;

const HARD_INDEX = new Map<string, GlossHit>();
for (const word of HARD_WORDS) {
  const hit = {
    surface: word.sv,
    lemma: word.sv,
    fr: word.fr,
    source: "hard-words",
  };
  HARD_INDEX.set(normalizeToken(word.sv), hit);
  for (const form of word.forms || []) {
    HARD_INDEX.set(normalizeToken(form), { ...hit, surface: form, lemma: word.sv });
  }
}

function fromEntry(surface: string, entry: LexiconEntry | GlossHit | undefined): GlossHit | null {
  if (!entry?.fr) return null;
  return {
    surface,
    lemma: entry.lemma || surface,
    fr: entry.fr,
    phonetic: "phonetic" in entry ? entry.phonetic : undefined,
    source: entry.source || "lexicon",
  };
}

export function lookupGloss(token: string): GlossHit | null {
  if (!isGlossableWord(token)) return null;
  const key = normalizeToken(token);
  if (!key) return null;

  const hard = HARD_INDEX.get(key);
  if (hard) return { ...hard, surface: token };

  const exact = LEXICON[key];
  if (exact) return fromEntry(token, exact);

  for (const candidate of lemmaCandidates(token)) {
    const hardLemma = HARD_INDEX.get(candidate);
    if (hardLemma) return { ...hardLemma, surface: token, lemma: hardLemma.lemma };
    const via = LEXICON[candidate];
    if (via) return fromEntry(token, via);
  }
  return null;
}

export function shouldOfferGloss(token: string) {
  return isGlossableWord(token);
}

/** Word-by-word FR so a paragraph still translates when the curated stem is missing. */
export function glossSentence(text: string): string {
  const source = String(text || "");
  if (!source.trim()) return "";
  return splitGlossPieces(source)
    .map((piece) => {
      if (!piece.word) return piece.text;
      return lookupGloss(piece.text)?.fr || piece.text;
    })
    .join("");
}
