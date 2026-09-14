#!/usr/bin/env node
/**
 * Report-only scan of a dropped PC tree for question banks.
 * Looks beyond the Manzi folder. Never rewrites files or strips explanations.
 *
 *   node scripts/scan-pc-bank.mjs
 *   node scripts/scan-pc-bank.mjs /path/to/pc-dump
 *   PC_DUMP=/path node scripts/scan-pc-bank.mjs
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const SKIP_DIR = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "out",
  ".cache",
  "Library",
  "AppData",
  "Windows",
]);

const BANK_EXT = new Set([".json", ".jsonl", ".ndjson", ".csv", ".tsv", ".txt"]);
const BANK_NAME =
  /questions|bank|qcm|yrkeskunn|taxiag|ägare|agare|foretag|företag|owner|manzi|facit|teori|prov/i;
const EXPLAIN_KEY =
  /explanation|forklar|förklar|facit|kommentar|losning|lösning|note_|boktext|rationale|explication/i;
const OWNER_HINT =
  /ägare|agare|företag|foretag|yrkeskunn|tillstånd|tillstand|taxiag|owner|delprov|tsfs\s*2021|trafikansvar/i;
const QUESTION_KEY = /stem_sv|\bsv\b|fråga|fraga|question|options|alt:/i;

const DEFAULT_ROOTS = [
  process.env.PC_DUMP,
  process.argv[2],
  "/workspace/pc-dump",
  "/workspace/taxiprov",
  "/mnt/pc",
  "/home/ubuntu/pc-dump",
]
  .filter(Boolean)
  .map((path) => resolve(path));

function walk(dir, out, depth = 0) {
  if (depth > 12) return;
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIR.has(entry.name)) continue;
      walk(full, out, depth + 1);
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = extname(entry.name).toLowerCase();
    if (!BANK_EXT.has(ext)) continue;
    if (entry.name.startsWith(".")) continue;
    out.push(full);
  }
}

function parseMaybeJson(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const value = JSON.parse(trimmed);
      return Array.isArray(value) ? value : [value];
    } catch {
      return [];
    }
  }
  if (trimmed.startsWith("{")) {
    try {
      return [JSON.parse(trimmed)];
    } catch {
      /* fall through to jsonl */
    }
  }
  const rows = [];
  for (const line of trimmed.split(/\r?\n/)) {
    const item = line.trim();
    if (!item || item.startsWith("#") || item.startsWith("//")) continue;
    try {
      rows.push(JSON.parse(item));
    } catch {
      /* ignore non-json lines */
    }
  }
  return rows;
}

function looksLikeQuestion(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return false;
  const keys = Object.keys(record).join(" ");
  return (
    Boolean(record.stem_sv || record.sv || record.question || record.fraga || record.fråga) ||
    (QUESTION_KEY.test(keys) && (record.options || record.answer))
  );
}

function explanationFields(record) {
  if (!record || typeof record !== "object") return [];
  return Object.keys(record).filter((key) => {
    if (!EXPLAIN_KEY.test(key)) return false;
    const value = record[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

function scanFile(path) {
  let text = "";
  try {
    const size = statSync(path).size;
    if (size > 40 * 1024 * 1024) {
      return { path, skipped: "file larger than 40MB" };
    }
    text = readFileSync(path, "utf8");
  } catch (error) {
    return { path, skipped: error.message };
  }
  const records = parseMaybeJson(text).filter(looksLikeQuestion);
  if (!records.length && !BANK_NAME.test(path)) return null;
  if (!records.length) return { path, records: 0, note: "name looks like a bank but no QCM rows parsed" };
  const withExplanation = records.filter((record) => explanationFields(record).length);
  const ownerish = records.filter((record) =>
    OWNER_HINT.test(
      [record.topic, record.trackHint, record.corpus, record.id, record.stem_sv, record.sv, record.source]
        .filter(Boolean)
        .join(" "),
    ),
  );
  const corpora = {};
  for (const record of records) {
    const corpus = record.corpus || "(none)";
    corpora[corpus] = (corpora[corpus] || 0) + 1;
  }
  return {
    path,
    records: records.length,
    withExplanation: withExplanation.length,
    missingExplanation: records.length - withExplanation.length,
    ownerish: ownerish.length,
    corpora,
  };
}

function main() {
  const roots = [...new Set(DEFAULT_ROOTS)].filter((root) => existsSync(root));
  if (!roots.length) {
    console.log(
      [
        "scan-pc-bank: no dump directory found.",
        "Drop Lionel's PC export (whole machine, not only Manzi) and re-run:",
        "  node scripts/scan-pc-bank.mjs /path/to/pc-dump",
        "Then compile without stripping explanations:",
        "  npm run import -- --manzi /path/questions.jsonl",
        "  npm run import -- --research /path/owner-or-research.jsonl",
      ].join("\n"),
    );
    process.exit(0);
  }

  const files = [];
  for (const root of roots) walk(root, files);
  const hits = files.map(scanFile).filter(Boolean);
  const usable = hits.filter((hit) => hit.records);
  console.log(`scan-pc-bank: roots ${roots.join(", ")}`);
  console.log(`files scanned ${files.length} · bank-like ${hits.length} · with QCM rows ${usable.length}`);
  for (const hit of usable.sort((a, b) => b.ownerish - a.ownerish || b.records - a.records)) {
    const rel = roots.length === 1 ? relative(roots[0], hit.path) : hit.path;
    console.log(
      `  ${rel} · ${hit.records} Q · explain ${hit.withExplanation}/${hit.records} · owner-ish ${hit.ownerish} · corpus ${JSON.stringify(hit.corpora)}`,
    );
  }
  const empty = hits.filter((hit) => !hit.records);
  if (empty.length) {
    console.log(`name-only / unparsed: ${empty.length}`);
    for (const hit of empty.slice(0, 12)) {
      console.log(`  ${hit.path}${hit.note || hit.skipped ? ` — ${hit.note || hit.skipped}` : ""}`);
    }
  }
  if (!usable.length) {
    console.log("No importable question banks yet. Keep full explanations when you copy files off the PC.");
  }
}

main();
