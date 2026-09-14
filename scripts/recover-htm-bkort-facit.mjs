#!/usr/bin/env node
/**
 * Recover BKORT / korkortA answer letters from real Manzi HTM facit only.
 * Never invents. If the box dirs are missing or a file has no letter, skip.
 *
 * Default box paths (coordinator drop):
 *   /workspace/taxiprov/manzi/htm-bkort
 *   /workspace/taxiprov/manzi/bkort-htm
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_DIRS = [
  process.env.MANZI_HTM_BKORT || "/workspace/taxiprov/manzi/htm-bkort",
  process.env.MANZI_BKORT_HTM || "/workspace/taxiprov/manzi/bkort-htm",
  "/workspace/taxiprov/manzi/T3/Taxi porove/körkort",
  "/workspace/taxiprov/manzi/images/T3/Taxi porove/körkort",
];

const LETTER = "[A-F]";
const FACIT_PATTERNS = [
  new RegExp(`Rätt\\s*svar\\s*[:.]\\s*(${LETTER})\\b`, "i"),
  new RegExp(`correct(?:Answer|Svar)?\\s*[:=]\\s*['"]?(${LETTER})['"]?`, "i"),
  new RegExp(`\\b(?:svar|answer)\\s*=\\s*['"](${LETTER})['"]`, "i"),
  new RegExp(`name=["']questionkey["'][^>]*value=["'](${LETTER})["']`, "i"),
  new RegExp(`value=["'](${LETTER})["'][^>]*(?:checked|selected)`, "i"),
  new RegExp(`(?:checked|selected)[^>]*value=["'](${LETTER})["']`, "i"),
];

export function idFromHtmPath(filePath) {
  const norm = String(filePath).replace(/\\/g, "/");
  const korkortA = norm.match(/k[oö]rkortA\/(\d+)\//i) || norm.match(/korkortA-(\d+)/i);
  if (korkortA) return `korkortA-${Number(korkortA[1])}`;
  const bkortQ = norm.match(/(?:^|\/)(?:htm-bkort|bkort-htm|k[oö]rkort)\/(\d+)\//i);
  if (bkortQ) return `BKORT-Q${Number(bkortQ[1])}`;
  const named = norm.match(/\/(BKORT-Q\d+|korkortA-\d+)\.(?:htm|html)$/i);
  if (named) return named[1];
  return null;
}

export function extractFacitLetter(html) {
  if (typeof html !== "string" || !html.trim()) return null;
  const found = new Set();
  for (const re of FACIT_PATTERNS) {
    const copy = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
    for (const match of html.matchAll(copy)) {
      const letter = String(match[1] || "").toUpperCase();
      if (/^[A-F]$/.test(letter)) found.add(letter);
    }
  }
  if (found.size !== 1) return null;
  return [...found][0];
}

function walkHtm(dir, out = []) {
  if (!existsSync(dir)) return out;
  const st = statSync(dir);
  if (st.isFile()) {
    if (/\.(htm|html)$/i.test(dir)) out.push(dir);
    return out;
  }
  for (const name of readdirSync(dir)) {
    if (name === "." || name === ".." || name === "node_modules") continue;
    walkHtm(join(dir, name), out);
  }
  return out;
}

export function recoverHtmFacit({ dirs = DEFAULT_DIRS, jsonlPath = join(root, "data/questions.jsonl") } = {}) {
  const present = dirs.filter((d) => existsSync(d));
  const files = present.flatMap((d) => walkHtm(d));
  const byId = new Map();
  if (existsSync(jsonlPath)) {
    for (const line of readFileSync(jsonlPath, "utf8").split(/\r?\n/)) {
      if (!line.trim()) continue;
      const row = JSON.parse(line);
      byId.set(row.id, row);
    }
  }
  const recovered = [];
  const skipped = [];
  for (const file of files) {
    const id = idFromHtmPath(file);
    if (!id) {
      skipped.push({ file: relative(root, file), why: "path-not-mapped" });
      continue;
    }
    const row = byId.get(id);
    if (!row) {
      skipped.push({ id, file: relative(root, file), why: "id-not-in-jsonl" });
      continue;
    }
    if (String(row.answer || "").trim()) {
      skipped.push({ id, why: "already-has-answer" });
      continue;
    }
    const letter = extractFacitLetter(readFileSync(file, "utf8"));
    if (!letter) {
      skipped.push({ id, file: relative(root, file), why: "no-facit-letter" });
      continue;
    }
    const options = (row.options || []).filter((o) => String(o.text || "").trim());
    if (options.length < 2 || !options.some((o) => o.letter === letter)) {
      skipped.push({ id, letter, why: "letter-not-among-options" });
      continue;
    }
    recovered.push({
      id,
      topic: row.topic || "bkort",
      stem_sv: row.stem_sv,
      options: row.options,
      answer: letter,
      explanation_sv: `Rätt svar: ${letter}`,
      source: row.source || relative(root, file),
      imageUrl: row.imageUrl,
      facitFrom: file,
    });
  }
  return { present, files: files.length, recovered, skipped };
}

function main() {
  const result = recoverHtmFacit();
  const dest = join(root, "data/manzi-100c-htm-facit.json");
  if (!result.present.length) {
    console.log("recover-htm-bkort: box dirs missing (htm-bkort / bkort-htm) — 0 recovered, no invent");
    if (existsSync(dest)) writeFileSync(dest, "[]\n");
    return result;
  }
  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(dest, `${JSON.stringify(result.recovered, null, 2)}\n`);
  console.log(
    `recover-htm-bkort: scanned ${result.files} htm in ${result.present.length} dir(s) → ${result.recovered.length} real facit (skipped ${result.skipped.length})`,
  );
  return result;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
