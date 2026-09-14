#!/usr/bin/env node
/**
 * Merge curated French into data/translations.fr.json, then drop leftovers.
 *
 * Sources, in order:
 *   1. data/fr/*.json      — full records: { id: { stem, options, explanation } }
 *   2. data/fr-stem-overrides.json — stem-only overrides (legacy shape)
 *
 * Every string is checked with looksUnusableFrench before it is written, so a
 * hybrid gloss (Swedish words patched into a French sentence) can never enter
 * the store — #14/#19: an empty French line beats a fake one. Swedish is never
 * read or written here; Manzi stays verbatim in data/questions.jsonl.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { looksHybridFrench, looksUnusableFrench } from "../lib/questions/french.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "data/translations.fr.json");
const curatedDir = join(root, "data/fr");
const LETTERS = ["A", "B", "C", "D", "E"];

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function readCuratedRecords() {
  if (!existsSync(curatedDir)) return { records: {}, files: [] };
  const records = {};
  const files = [];
  for (const name of readdirSync(curatedDir).sort()) {
    if (!name.endsWith(".json")) continue;
    files.push(name);
    const parsed = JSON.parse(readFileSync(join(curatedDir, name), "utf8"));
    for (const [id, value] of Object.entries(parsed)) {
      records[id] = { ...(records[id] || {}), ...value, __file: name };
    }
  }
  return { records, files };
}

export function applyFrench({ write = true } = {}) {
  const current = existsSync(dest) ? JSON.parse(readFileSync(dest, "utf8")) : {};
  const rejected = [];
  let stems = 0;
  let optionSets = 0;
  let explanations = 0;

  const { records, files } = readCuratedRecords();
  for (const [id, record] of Object.entries(records)) {
    const file = record.__file || "data/fr";
    const next = { ...(current[id] || {}) };

    const stem = clean(record.stem);
    if (stem) {
      if (looksUnusableFrench(stem)) rejected.push(`${file} ${id} stem`);
      else {
        next.stem = stem;
        stems += 1;
      }
    }

    if (record.options && typeof record.options === "object") {
      const options = { ...(next.options || {}) };
      let added = 0;
      for (const letter of LETTERS) {
        const text = clean(record.options[letter]);
        if (!text) continue;
        if (looksUnusableFrench(text)) {
          rejected.push(`${file} ${id} option ${letter}`);
          continue;
        }
        options[letter] = text;
        added += 1;
      }
      if (added) {
        next.options = options;
        optionSets += 1;
      }
    }

    const explanation = clean(record.explanation);
    if (explanation) {
      if (looksUnusableFrench(explanation)) rejected.push(`${file} ${id} explanation`);
      else {
        next.explanation = explanation;
        explanations += 1;
      }
    }

    if (Object.keys(next).length) current[id] = next;
  }

  // Legacy stem-only overrides stay supported.
  const overridePath = join(root, "data/fr-stem-overrides.json");
  if (existsSync(overridePath)) {
    const overrides = JSON.parse(readFileSync(overridePath, "utf8"));
    for (const [id, stem] of Object.entries(overrides)) {
      const value = clean(stem);
      if (!value || looksUnusableFrench(value)) {
        rejected.push(`fr-stem-overrides ${id}`);
        continue;
      }
      current[id] = { ...(current[id] || {}), stem: value };
      stems += 1;
    }
  }

  // Sweep: nothing hybrid may survive in the store.
  let dropped = 0;
  for (const [id, value] of Object.entries(current)) {
    if (!value || typeof value !== "object") {
      delete current[id];
      dropped += 1;
      continue;
    }
    const next = { ...value };
    if (typeof next.stem === "string" && looksUnusableFrench(next.stem)) {
      delete next.stem;
      dropped += 1;
    }
    if (typeof next.explanation === "string" && looksUnusableFrench(next.explanation)) {
      delete next.explanation;
      dropped += 1;
    }
    if (next.options && typeof next.options === "object") {
      const options = {};
      for (const [letter, text] of Object.entries(next.options)) {
        if (typeof text === "string" && !looksHybridFrench(text) && clean(text)) {
          options[letter] = clean(text);
        } else {
          dropped += 1;
        }
      }
      if (Object.keys(options).length) next.options = options;
      else delete next.options;
    }
    if (Object.keys(next).length) current[id] = next;
    else delete current[id];
  }

  const sorted = Object.fromEntries(
    Object.entries(current).sort(([a], [b]) => a.localeCompare(b, "en")),
  );
  if (write) writeFileSync(dest, `${JSON.stringify(sorted, null, 2)}\n`);

  const report = {
    curatedFiles: files.length,
    curatedIds: Object.keys(records).length,
    stems,
    optionSets,
    explanations,
    dropped,
    rejected,
    storeIds: Object.keys(sorted).length,
  };
  return report;
}

const report = applyFrench();
console.log(
  `apply-fr: ${report.curatedIds} curated ids from ${report.curatedFiles} file(s) · stems ${report.stems} · option sets ${report.optionSets} · explanations ${report.explanations} · dropped ${report.dropped} · store ${report.storeIds}`,
);
for (const line of report.rejected.slice(0, 20)) {
  console.error(`  rejected as hybrid/placeholder: ${line}`);
}
if (report.rejected.length > 20) {
  console.error(`  … ${report.rejected.length - 20} more rejected`);
}
if (report.rejected.length) process.exitCode = 1;
