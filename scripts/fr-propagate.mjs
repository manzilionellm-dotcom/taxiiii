#!/usr/bin/env node
/**
 * Share one curated French line across questions whose Swedish is identical.
 *
 * The bank holds the same Manzi question on several exam papers — 1024
 * untranslated stems reduce to 892 distinct Swedish sentences. Translating
 * each sentence once and copying it to its exact duplicates is not a guess:
 * identical source text has identical meaning. The match is on the whole
 * normalised stem, so nothing near-identical is ever merged.
 *
 * Options are propagated only when the stem AND the full option set match
 * letter by letter, so an option's French can never land on a different
 * question's answer list.
 *
 * Usage: node scripts/fr-propagate.mjs [--check]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { looksUnusableFrench } from "../lib/questions/french.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const storePath = join(root, "data/translations.fr.json");

const norm = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

const usable = (value) => {
  const text = String(value ?? "").trim();
  return text && !looksUnusableFrench(text) ? text : "";
};

const optionSignature = (question) =>
  (question.options || []).map((option) => `${option.letter}:${norm(option.text)}`).join("|");

export function propagate({ questions, store }) {
  const next = { ...store };
  /** stem signature -> the first record that has a usable French stem */
  const stemDonor = new Map();
  const fullDonor = new Map();

  for (const question of questions) {
    const record = store[question.id];
    if (!record) continue;
    const stemKey = norm(question.stem_sv);
    if (usable(record.stem) && !stemDonor.has(stemKey)) stemDonor.set(stemKey, record);
    const fullKey = `${stemKey}##${optionSignature(question)}`;
    const options = record.options || {};
    const everyOption =
      (question.options || []).length > 0 &&
      question.options.every((option) => usable(options[option.letter]));
    if (everyOption && !fullDonor.has(fullKey)) fullDonor.set(fullKey, record);
  }

  let stems = 0;
  let optionSets = 0;
  let explanations = 0;

  for (const question of questions) {
    const stemKey = norm(question.stem_sv);
    const fullKey = `${stemKey}##${optionSignature(question)}`;
    const current = next[question.id] || {};

    if (!usable(current.stem)) {
      const donor = stemDonor.get(stemKey);
      if (donor) {
        next[question.id] = { ...current, stem: donor.stem };
        stems += 1;
      }
    }

    const after = next[question.id] || {};
    if (!usable(after.explanation)) {
      const donor = stemDonor.get(stemKey);
      if (donor && usable(donor.explanation)) {
        next[question.id] = { ...(next[question.id] || {}), explanation: donor.explanation };
        explanations += 1;
      }
    }

    const optionsNow = (next[question.id] || {}).options || {};
    const missingOption = (question.options || []).some((option) => !usable(optionsNow[option.letter]));
    if (missingOption) {
      const donor = fullDonor.get(fullKey);
      if (donor) {
        next[question.id] = { ...(next[question.id] || {}), options: { ...donor.options } };
        optionSets += 1;
      }
    }
  }

  return { store: next, stems, optionSets, explanations };
}

function main() {
  const check = process.argv.includes("--check");
  const questions = JSON.parse(readFileSync(join(root, "data/questions.json"), "utf8"));
  const store = JSON.parse(readFileSync(storePath, "utf8"));
  const result = propagate({ questions, store });
  const sorted = Object.fromEntries(
    Object.entries(result.store).sort(([a], [b]) => a.localeCompare(b)),
  );
  const serialised = `${JSON.stringify(sorted, null, 2)}\n`;

  console.log(
    `fr-propagate: stems ${result.stems} · option sets ${result.optionSets} · ` +
      `explanations ${result.explanations} · store ${Object.keys(sorted).length}`,
  );

  if (check) {
    if (readFileSync(storePath, "utf8") !== serialised) {
      console.error("data/translations.fr.json is missing propagated duplicates — run npm run fr:apply");
      process.exit(1);
    }
    return;
  }
  writeFileSync(storePath, serialised);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  main();
}
