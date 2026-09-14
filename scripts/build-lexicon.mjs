#!/usr/bin/env node
/**
 * Compile a per-token Swedish → French lexicon for the luxury gloss chip.
 * Sources (first hit wins): hard-words, vocab sessions, curated seed,
 * then light inflection expansion. Never invents a translation.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  expandLemmaForms,
  isGlossableWord,
  lemmaCandidates,
  normalizeToken,
  splitGlossPieces,
} from "../lib/glossary-core.mjs";
import { SEED } from "./sv-fr-seed.mjs";
import { BANK_SEED } from "./sv-fr-seed-bank.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readJson(rel, fallback) {
  const file = join(root, rel);
  if (!existsSync(file)) return fallback;
  return JSON.parse(readFileSync(file, "utf8"));
}

function collectHardWords() {
  const words = [];
  const hard = readJson("data/hard-words.json", []);
  words.push(...hard);
  const vocabDir = join(root, "data/vocab");
  if (existsSync(vocabDir)) {
    for (const name of readdirSync(vocabDir).sort()) {
      if (!name.endsWith(".json")) continue;
      const session = JSON.parse(readFileSync(join(vocabDir, name), "utf8"));
      for (const item of session.words || session) {
        if (item?.sv && item?.fr) words.push(item);
      }
    }
  }
  return words;
}

function addEntry(map, sv, fr, source, lemma = sv) {
  const key = normalizeToken(sv);
  const french = String(fr || "").trim();
  if (!key || !french || key.length < 1) return;
  if (!map.has(key)) {
    map.set(key, { lemma: normalizeToken(lemma) || key, fr: french, source });
  }
}

function extractBankTokens(questions) {
  const counts = new Map();
  const bump = (text) => {
    for (const piece of splitGlossPieces(text)) {
      if (!piece.word || !isGlossableWord(piece.text)) continue;
      const key = normalizeToken(piece.text);
      if (!key) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  };
  for (const question of questions) {
    bump(question.stem_sv);
    for (const option of question.options || []) bump(option.text);
  }
  return counts;
}

export function buildLexicon({ silent = false } = {}) {
  const questions = readJson("data/questions.json", []);
  const translations = readJson("data/translations.fr.json", {});
  const lemmas = new Map();

  for (const word of collectHardWords()) {
    addEntry(lemmas, word.sv, word.fr, "hard-words", word.sv);
    for (const form of word.forms || []) {
      addEntry(lemmas, form, word.fr, "hard-words", word.sv);
    }
  }

  const seedMerged = { ...SEED, ...BANK_SEED };
  if (!silent) {
    console.log(`lexicon seed lemmas: ${Object.keys(seedMerged).length} (core ${Object.keys(SEED).length} + bank ${Object.keys(BANK_SEED).length})`);
  }
  for (const [sv, fr] of Object.entries(seedMerged)) {
    addEntry(lemmas, sv, fr, "seed", sv);
  }

  for (const [sv, entry] of [...lemmas.entries()]) {
    for (const form of expandLemmaForms(entry.lemma || sv)) {
      addEntry(lemmas, form, entry.fr, `${entry.source}+inflect`, entry.lemma);
    }
  }

  const bankCounts = extractBankTokens(questions);
  const coverageCounts = extractBankTokens(
    questions.filter((item) => item.corpus !== "owner-import"),
  );
  const lexicon = {};
  for (const [token, count] of bankCounts) {
    let hit = lemmas.get(token);
    if (!hit) {
      for (const candidate of lemmaCandidates(token)) {
        hit = lemmas.get(candidate);
        if (hit) break;
      }
    }
    if (hit) {
      lexicon[token] = {
        lemma: hit.lemma,
        fr: hit.fr,
        source: hit.source,
      };
    } else {
      void count;
    }
  }

  for (const [sv, entry] of lemmas) {
    if (entry.source?.includes("+inflect")) continue;
    if (!lexicon[sv]) {
      lexicon[sv] = {
        lemma: entry.lemma,
        fr: entry.fr,
        source: entry.source,
      };
    }
  }

  const uniqueBank = [...coverageCounts.keys()];
  const hits = uniqueBank.filter((token) => lexicon[token]);
  const misses = uniqueBank
    .filter((token) => !lexicon[token])
    .sort(
      (a, b) =>
        (coverageCounts.get(b) || 0) - (coverageCounts.get(a) || 0) || a.localeCompare(b, "sv"),
    );
  const occurrenceTotal = [...coverageCounts.values()].reduce((sum, n) => sum + n, 0);
  const occurrenceHits = uniqueBank
    .filter((token) => lexicon[token])
    .reduce((sum, token) => sum + (coverageCounts.get(token) || 0), 0);
  const allUnique = [...bankCounts.keys()];
  const allHits = allUnique.filter((token) => lexicon[token]).length;

  const coverage = {
    generatedAt: new Date().toISOString(),
    questions: questions.length,
    translations: Object.keys(translations).length,
    uniqueBankTokens: uniqueBank.length,
    uniqueHits: hits.length,
    uniqueMisses: misses.length,
    uniqueCoveragePct: uniqueBank.length
      ? Math.round((hits.length / uniqueBank.length) * 1000) / 10
      : 0,
    occurrenceTotal,
    occurrenceHits,
    occurrenceCoveragePct: occurrenceTotal
      ? Math.round((occurrenceHits / occurrenceTotal) * 1000) / 10
      : 0,
    allUniqueBankTokens: allUnique.length,
    allUniqueCoveragePct: allUnique.length
      ? Math.round((allHits / allUnique.length) * 1000) / 10
      : 0,
    lexiconEntries: Object.keys(lexicon).length,
    missSample: misses.slice(0, 80).map((token) => ({
      sv: token,
      count: coverageCounts.get(token) || 0,
    })),
  };

  writeFileSync(join(root, "data/sv-fr-lexicon.json"), `${JSON.stringify(lexicon)}\n`);
  writeFileSync(join(root, "data/lexicon-coverage.json"), `${JSON.stringify(coverage, null, 2)}\n`);

  if (!silent) {
    console.log(
      `lexicon: ${coverage.uniqueHits}/${coverage.uniqueBankTokens} unique tokens (${coverage.uniqueCoveragePct}%) · occurrence ${coverage.occurrenceCoveragePct}% · ${coverage.lexiconEntries} entries`,
    );
    if (coverage.missSample.length) {
      console.log(
        `lexicon misses (top): ${coverage.missSample
          .slice(0, 12)
          .map((item) => `${item.sv}×${item.count}`)
          .join(", ")}`,
      );
    }
  }
  return coverage;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildLexicon();
}
