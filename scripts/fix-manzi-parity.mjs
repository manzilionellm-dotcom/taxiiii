#!/usr/bin/env node
/**
 * Manzi exam-parity repairs. Idempotent and self-verifying: every edit asserts
 * the text it expects to find, so a second run is a no-op and a changed source
 * fails loudly instead of being silently mangled.
 *
 * Nothing here invents exam content. No stem is reworded, no answer key is
 * guessed, no raster is fabricated. The repairs are:
 *
 *   1. id scheme — SAKERHET-1-* is the only Säkerhet book spelled without the
 *      mojibake Ä. Books 2..9 are S_KERHET-*, the Blob folder is S_KERHET-1,
 *      and PDF_PAGE_ID only matches LAGSTIFNING|S_KERHET, so book 1 never got
 *      its exam page attached. Rename it to match its own book series.
 *
 *   2. scraper glue — four options carry text that belongs somewhere else: a
 *      merged option, an author's note, stray letters, and a lost question's
 *      stem. Each is split or trimmed back to what Manzi wrote.
 *
 *   3. media manifest — pdf-pages keys confirmed on Blob but absent from
 *      data/media-manifest.json. readBlobMedia resolves a pathname through
 *      blobRefForManifest(entry); with no entry that is null, so those pages
 *      404 even once BLOB_READ_WRITE_TOKEN is set. Absorb the keys.
 *
 * Run: node scripts/fix-manzi-parity.mjs [--check]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BLOB_STORE_HOST } from "../lib/media/paths.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");

const report = { renamedIds: 0, renamedFrKeys: 0, optionRepairs: [], manifestAdded: 0, skipped: [] };
const problems = [];

function readJson(rel) {
  return JSON.parse(readFileSync(join(root, rel), "utf8"));
}

function writeJson(rel, value) {
  if (CHECK) return;
  writeFileSync(join(root, rel), `${JSON.stringify(value, null, 2)}\n`);
}

function readJsonl(rel) {
  return readFileSync(join(root, rel), "utf8")
    .trim()
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
}

function writeJsonl(rel, rows) {
  if (CHECK) return;
  writeFileSync(join(root, rel), `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`);
}

/* ------------------------------------------------------------------ 1. ids */

const QUESTIONS_JSONL = "data/questions.jsonl";
const rows = readJsonl(QUESTIONS_JSONL);
const ids = new Set(rows.map((row) => String(row.id)));

/** SAKERHET-1-QN -> S_KERHET-1-QN, the spelling books 2..9 and Blob already use. */
function renamedId(id) {
  return /^SAKERHET-\d+-Q\d+$/.test(String(id))
    ? String(id).replace(/^SAKERHET-/, "S_KERHET-")
    : null;
}

for (const row of rows) {
  const target = renamedId(row.id);
  if (!target) continue;
  if (ids.has(target)) {
    problems.push(`refusing to rename ${row.id}: ${target} already exists`);
    continue;
  }
  ids.delete(String(row.id));
  ids.add(target);
  row.id = target;
  report.renamedIds += 1;
}

/* An id rename must carry its French with it, or the translation is orphaned. */
for (const rel of ["data/translations.fr.json", "data/fr-stem-overrides.json"]) {
  const store = readJson(rel);
  let moved = 0;
  for (const key of Object.keys(store)) {
    const target = renamedId(key);
    if (!target) continue;
    if (store[target] !== undefined) {
      problems.push(`refusing to move FR ${rel} ${key}: ${target} already present`);
      continue;
    }
    store[target] = store[key];
    delete store[key];
    moved += 1;
  }
  if (moved) {
    const sorted = Object.fromEntries(
      Object.entries(store).sort(([a], [b]) => a.localeCompare(b, "en")),
    );
    writeJson(rel, sorted);
    report.renamedFrKeys += moved;
  }
}

/* -------------------------------------------------------- 2. scraper glue */

function findRow(id) {
  return rows.find((row) => String(row.id) === id);
}

/**
 * Trim an option back to what Manzi wrote. `expectedTail` is the foreign text
 * the scraper appended; it must be present verbatim or the repair is skipped.
 */
function trimOptionTail(id, letter, expectedTail, note) {
  const row = findRow(id);
  if (!row) return report.skipped.push(`${id}: row not found`);
  const option = (row.options || []).find((item) => item.letter === letter);
  if (!option) return report.skipped.push(`${id}: option ${letter} not found`);
  const text = String(option.text || "");
  const at = text.indexOf(expectedTail);
  if (at < 0) return report.skipped.push(`${id} option ${letter}: already clean`);
  option.text = text.slice(0, at).trimEnd();
  report.optionRepairs.push(`${id} option ${letter}: ${note}`);
}

/**
 * The scraper merged one option into the previous one at a literal "C ."
 * marker. Both texts are present verbatim; split them back apart.
 */
function splitMergedOption(id, hostLetter, marker, newLetter) {
  const row = findRow(id);
  if (!row) return report.skipped.push(`${id}: row not found`);
  const options = row.options || [];
  if (options.some((item) => item.letter === newLetter)) {
    return report.skipped.push(`${id}: option ${newLetter} already present`);
  }
  const host = options.find((item) => item.letter === hostLetter);
  if (!host) return report.skipped.push(`${id}: option ${hostLetter} not found`);
  const parts = String(host.text || "").split(marker);
  if (parts.length !== 2) {
    return report.skipped.push(`${id} option ${hostLetter}: merge marker not found`);
  }
  host.text = parts[0].trim();
  const at = options.indexOf(host);
  options.splice(at + 1, 0, { letter: newLetter, text: parts[1].trim() });
  row.options = options;
  report.optionRepairs.push(
    `${id}: recovered option ${newLetter} that the scraper merged into ${hostLetter}`,
  );
}

// The row itself records «Rätt svar: C», and option C's text sat inside B.
splitMergedOption("LAGSTIFNING-8-Q53", "B", /\s+C\s*\.\s*/, "C");

// An author's note to himself, left in a live answer option.
trimOptionTail("S_KERHET-8-Q42", "D", " FRÅGA Samer", "dropped the «FRÅGA Samer» author note");

/**
 * The PDF's option-letter row was scraped into the last option, leaving a
 * trailing «A B C». The run must start at A and be consecutive, so a genuine
 * trailing letter survives: «Bild B och Bild D A B C» keeps «Bild B och Bild D»
 * rather than losing its own D.
 */
const LETTER_RUN = /\s+A(?:\s+B(?:\s+C(?:\s+D(?:\s+E)?)?)?)\s*$/;
for (const row of rows) {
  for (const option of row.options || []) {
    const text = String(option.text || "");
    if (!LETTER_RUN.test(text)) continue;
    const head = text.replace(LETTER_RUN, "").trimEnd();
    if (head.length < 2) continue;
    option.text = head;
    report.optionRepairs.push(
      `${row.id} option ${option.letter}: dropped the trailing option-letter row`,
    );
  }
}

/**
 * The scrape swallowed whole questions into the previous question's last
 * option: the option text ends with « NN.» followed by that question's stem,
 * and question NN is missing from the bank. A student reading the option sees
 * another question as an answer choice.
 *
 * The rule is kept deliberately tight so it can only fire on that shape: the
 * number must be the next question (current+1..+3), the kept head must be
 * non-empty, and the dropped tail must be sentence-length. On this bank it
 * matches 5 options and nothing else — decimals like «3 . 0 meter» and notes
 * like «2 tim 8‐16» are untouched because a capital letter must follow.
 */
const GLUED_STEM = /\s(\d{1,3})\s*\.\s*(?=[A-ZÅÄÖ])/g;
for (const row of rows) {
  const current = Number(String(row.id).match(/Q(\d+)$/)?.[1] ?? NaN);
  if (!Number.isFinite(current)) continue;
  for (const option of row.options || []) {
    const text = String(option.text || "");
    GLUED_STEM.lastIndex = 0;
    const match = GLUED_STEM.exec(text);
    if (!match) continue;
    const number = Number(match[1]);
    const head = text.slice(0, match.index).trim();
    const tail = text.slice(match.index + match[0].length).trim();
    if (!(number > current && number <= current + 3)) continue;
    if (head.length < 2 || tail.length < 15) continue;
    option.text = head;
    report.optionRepairs.push(
      `${row.id} option ${option.letter}: dropped the Q${number} stem glued into it`,
    );
  }
}

writeJsonl(QUESTIONS_JSONL, rows);

/* ---------------------------------------------------------- 3. media manifest */

const MANIFEST = "data/media-manifest.json";
const manifest = readJson(MANIFEST);
const confirmed = readJson("data/pdf-pages-on-blob.json");
manifest.files = manifest.files || {};

for (const key of Array.isArray(confirmed) ? confirmed : []) {
  if (manifest.files[key]) continue;
  // Same shape as the 644 pdf-pages entries already in the manifest. `size` is
  // deliberately absent: only a real list() run knows it, and inventing a byte
  // count would make mediaKeyIsPresent lie about bytes we have never seen.
  manifest.files[key] = {
    pathname: `media/${key}`,
    contentType: "image/jpeg",
    url: `${BLOB_STORE_HOST}/media/${key}`,
  };
  report.manifestAdded += 1;
}

if (report.manifestAdded) {
  const pdfKeys = Object.keys(manifest.files).filter((key) => key.startsWith("pdf-pages/"));
  manifest.pdfPages = {
    ...(manifest.pdfPages || {}),
    total: pdfKeys.length,
    confirmedOnBlob: (Array.isArray(confirmed) ? confirmed : []).length,
    note:
      "Keys mirror data/pdf-pages-on-blob.json so readBlobMedia can resolve a pathname. " +
      "`size` is only written by a real `npm run media:inventory-pdf` run with BLOB_READ_WRITE_TOKEN.",
  };
  manifest.files = Object.fromEntries(
    Object.entries(manifest.files).sort(([a], [b]) => a.localeCompare(b, "en")),
  );
  writeJson(MANIFEST, manifest);
}

/* ------------------------------------------------------------------ report */

console.log(
  `fix-manzi-parity${CHECK ? " (check)" : ""}: ids renamed ${report.renamedIds}` +
    ` · FR keys moved ${report.renamedFrKeys}` +
    ` · option repairs ${report.optionRepairs.length}` +
    ` · manifest keys absorbed ${report.manifestAdded}`,
);
for (const line of report.optionRepairs) console.log(`  repaired: ${line}`);
for (const line of report.skipped) console.log(`  no-op: ${line}`);
for (const line of problems) console.error(`  PROBLEM: ${line}`);
if (problems.length) process.exitCode = 1;
