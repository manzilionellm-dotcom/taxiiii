import { readFileSync } from "node:fs";
import {
  isGlossableWord,
  lemmaCandidates,
  normalizeToken,
} from "../lib/glossary-core.mjs";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

function lookup(token, lexicon, hard) {
  if (!isGlossableWord(token)) return null;
  const key = normalizeToken(token);
  if (hard[key]) return hard[key];
  if (lexicon[key]) return lexicon[key];
  for (const candidate of lemmaCandidates(token)) {
    if (hard[candidate]) return hard[candidate];
    if (lexicon[candidate]) return lexicon[candidate];
  }
  return null;
}

assert(normalizeToken("Taxametern!") === "taxametern", "normalize strips punct");
assert(isGlossableWord("taxameter"), "taxameter is a word");
assert(isGlossableWord("dygnsvila"), "dygnsvila is a word");
assert(!isGlossableWord("24"), "numbers are not glossable");
assert(!isGlossableWord("A"), "option letter A is skipped");
assert(!isGlossableWord("b"), "option letter b is skipped");
assert(isGlossableWord("och"), "stopwords stay glossable");
assert(lemmaCandidates("taxametern").includes("taxameter"), "inflection fallback");

const lexicon = JSON.parse(readFileSync(new URL("../data/sv-fr-lexicon.json", import.meta.url), "utf8"));
const hardWords = JSON.parse(readFileSync(new URL("../data/hard-words.json", import.meta.url), "utf8"));
const hard = {};
for (const word of hardWords) {
  hard[normalizeToken(word.sv)] = { lemma: word.sv, fr: word.fr };
  for (const form of word.forms || []) hard[normalizeToken(form)] = { lemma: word.sv, fr: word.fr };
}

const taxameter = lookup("taxameter", lexicon, hard);
assert(taxameter && /taxim/i.test(taxameter.fr), `taxameter FR, got ${taxameter?.fr}`);

const dygn = lookup("dygnsvila", lexicon, hard);
assert(dygn && /repos/i.test(dygn.fr), `dygnsvila FR, got ${dygn?.fr}`);

const och = lookup("och", lexicon, hard);
assert(och && och.fr === "et", `och → et, got ${och?.fr}`);

const unknown = lookup("xyzqwxzz", lexicon, hard);
assert(unknown === null, "unknown token must not invent a translation");

const coverage = JSON.parse(readFileSync(new URL("../data/lexicon-coverage.json", import.meta.url), "utf8"));
assert(coverage.uniqueBankTokens > 1000, "coverage report too small");
assert(coverage.uniqueCoveragePct >= 65, `unique coverage too low: ${coverage.uniqueCoveragePct}%`);
assert(coverage.occurrenceCoveragePct >= 90, `occurrence coverage too low: ${coverage.occurrenceCoveragePct}%`);

console.log(
  `glossary.test OK · taxameter=${taxameter.fr} · coverage ${coverage.uniqueHits}/${coverage.uniqueBankTokens} (${coverage.uniqueCoveragePct}%)`,
);
