#!/usr/bin/env node
/**
 * Measure French coverage of the live bank, per track, and write the summary
 * to data/fr-coverage.json.
 *
 * Why a generated file: the Settings screen shows the user how much of their
 * track is translated, and it must not pull the whole 1.7 MB translation store
 * into the phone bundle to say "Taxi 15 %". The summary is a few hundred bytes.
 *
 * A string only counts when it passes looksUnusableFrench — the same gate
 * apply-fr.mjs writes through — so a hybrid gloss can never inflate a number.
 *
 * Usage: node scripts/fr-coverage.mjs [--check]
 *   --check exits 1 if the committed file disagrees with a fresh measurement.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { looksUnusableFrench } from "../lib/questions/french.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "data/fr-coverage.json");

/** Mirrors lib/types.ts questionTrack() without dragging TypeScript in. */
export function trackOf(question) {
  if (question.trackHint) return question.trackHint;
  if (question.topic === "agare" || String(question.corpus || "").startsWith("owner")) {
    return "owner";
  }
  if (question.topic === "bkort") return "b";
  return "taxi";
}

function real(value) {
  const text = String(value ?? "").trim();
  return text ? !looksUnusableFrench(text) : false;
}

export function measureFrench({
  questions = JSON.parse(readFileSync(join(root, "data/questions.json"), "utf8")),
  translations = JSON.parse(readFileSync(join(root, "data/translations.fr.json"), "utf8")),
} = {}) {
  const tracks = {};
  for (const question of questions) {
    const track = trackOf(question);
    const row = (tracks[track] ??= { questions: 0, stems: 0, options: 0, explanations: 0, none: 0 });
    const hit = translations[question.id] || {};
    const options = hit.options || {};
    row.questions += 1;
    const stem = real(hit.stem);
    const everyOption =
      (question.options || []).length > 0 &&
      question.options.every((option) => real(options[option.letter]));
    const explanation = real(hit.explanation) || real(question.explanation_fr);
    if (stem) row.stems += 1;
    if (everyOption) row.options += 1;
    if (explanation) row.explanations += 1;
    if (!stem && !explanation && !Object.values(options).some(real)) row.none += 1;
  }
  return { tracks };
}

function percent(part, whole) {
  return whole ? Math.round((part / whole) * 100) : 0;
}

function main() {
  const check = process.argv.includes("--check");
  const measured = measureFrench();
  const payload = { tracks: measured.tracks };
  const serialised = `${JSON.stringify(payload, null, 2)}\n`;

  console.log("| track | questions | FR stem | FR all options | FR explanation | no FR at all |");
  console.log("| --- | --- | --- | --- | --- | --- |");
  for (const [track, row] of Object.entries(measured.tracks)) {
    const cell = (value) => `${value} (${percent(value, row.questions)}%)`;
    console.log(
      `| ${track} | ${row.questions} | ${cell(row.stems)} | ${cell(row.options)} | ` +
        `${cell(row.explanations)} | ${cell(row.none)} |`,
    );
  }

  if (check) {
    const current = readFileSync(dest, "utf8");
    if (current !== serialised) {
      console.error("\ndata/fr-coverage.json is stale — run npm run fr:coverage");
      process.exit(1);
    }
    console.log("\nfr-coverage OK · committed summary matches the bank");
    return;
  }

  writeFileSync(dest, serialised);
  console.log(`\nwrote data/fr-coverage.json`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  main();
}
