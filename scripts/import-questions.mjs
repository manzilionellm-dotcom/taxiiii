#!/usr/bin/env node
/**
 * Import Manzi JSONL word-for-word into data/questions.jsonl + data/questions.json.
 *
 * Usage:
 *   node scripts/import-questions.mjs --check
 *   node scripts/import-questions.mjs data/questions.jsonl
 *   node scripts/import-questions.mjs /path/to/full-bank.jsonl --images /path/to/images
 *
 * The Swedish stem/options/explanations are never rewritten.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const TOPICS = new Set(["lagstiftning", "sakerhet", "karta", "bkort"]);
const LETTERS = new Set(["A", "B", "C", "D", "E"]);

function parseArgs(argv) {
  const args = { check: false, file: "data/questions.jsonl", images: null };
  const rest = [...argv];
  while (rest.length) {
    const token = rest.shift();
    if (token === "--check") args.check = true;
    else if (token === "--images") args.images = rest.shift();
    else if (token && !token.startsWith("-")) args.file = token;
  }
  return args;
}

function fail(message, issues = []) {
  console.error(`import-questions: ${message}`);
  for (const issue of issues.slice(0, 20)) console.error(`  - ${issue}`);
  process.exit(1);
}

export function parseJsonl(text) {
  const issues = [];
  const records = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) return;
    try {
      records.push(JSON.parse(trimmed));
    } catch {
      issues.push(`line ${index + 1}: invalid JSON`);
    }
  });
  return { records, issues };
}

export function validateRecord(record, index) {
  const issues = [];
  const prefix = record?.id ? record.id : `#${index + 1}`;
  if (!record || typeof record !== "object") return [`${prefix}: not an object`];
  if (typeof record.id !== "string" || !record.id) issues.push(`${prefix}: missing id`);
  if (!TOPICS.has(record.topic)) issues.push(`${prefix}: topic must be lagstiftning|sakerhet|karta|bkort`);
  if (typeof record.stem_sv !== "string" || !record.stem_sv.trim()) {
    issues.push(`${prefix}: stem_sv must be non-empty Swedish (do not rewrite)`);
  }
  if (!Array.isArray(record.options) || record.options.length < 2) {
    issues.push(`${prefix}: options must have at least 2 items`);
  } else {
    for (const option of record.options) {
      if (!LETTERS.has(option.letter) || typeof option.text !== "string" || !option.text) {
        issues.push(`${prefix}: bad option ${JSON.stringify(option)}`);
      }
    }
  }
  if (!LETTERS.has(record.answer)) issues.push(`${prefix}: bad answer`);
  else if (Array.isArray(record.options) && !record.options.some((o) => o.letter === record.answer)) {
    issues.push(`${prefix}: answer ${record.answer} not in options`);
  }
  if (typeof record.explanation_sv !== "string" || !record.explanation_sv) {
    issues.push(`${prefix}: missing explanation_sv`);
  }
  if (typeof record.explanation_fr !== "string" || !record.explanation_fr) {
    issues.push(`${prefix}: missing explanation_fr`);
  }
  if (record.imageUrl != null && typeof record.imageUrl !== "string") {
    issues.push(`${prefix}: imageUrl must be a string`);
  }
  return issues;
}

function normalize(record) {
  return {
    id: record.id,
    topic: record.topic,
    stem_sv: record.stem_sv,
    options: record.options.map((option) => ({ letter: option.letter, text: option.text })),
    answer: record.answer,
    explanation_sv: record.explanation_sv,
    explanation_fr: record.explanation_fr,
    ...(record.imageUrl ? { imageUrl: record.imageUrl } : {}),
    ...(record.source ? { source: record.source } : {}),
  };
}

function copyImages(fromDir) {
  const dest = resolve("public/media");
  mkdirSync(dest, { recursive: true });
  const allowed = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"]);
  let copied = 0;
  for (const name of readdirSync(fromDir)) {
    const ext = extname(name).toLowerCase();
    if (!allowed.has(ext)) continue;
    copyFileSync(resolve(fromDir, name), resolve(dest, name));
    copied += 1;
  }
  return copied;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const file = resolve(args.file);
  if (!existsSync(file)) fail(`file not found: ${file}`);
  const { records, issues } = parseJsonl(readFileSync(file, "utf8"));
  records.forEach((record, index) => issues.push(...validateRecord(record, index)));
  const ids = new Set();
  records.forEach((record) => {
    if (ids.has(record.id)) issues.push(`duplicate id ${record.id}`);
    ids.add(record.id);
  });
  if (issues.length) fail("validation failed", issues);

  const normalized = records.map(normalize);
  if (args.check) {
    console.log(`OK ${normalized.length} questions`);
    return;
  }

  mkdirSync(resolve("data"), { recursive: true });
  const jsonl = normalized.map((record) => JSON.stringify(record)).join("\n") + "\n";
  writeFileSync(resolve("data/questions.jsonl"), jsonl);
  writeFileSync(resolve("data/questions.json"), `${JSON.stringify(normalized, null, 2)}\n`);

  let images = 0;
  if (args.images) {
    if (!existsSync(args.images)) fail(`images folder not found: ${args.images}`);
    images = copyImages(args.images);
  }

  console.log(`Imported ${normalized.length} questions → data/questions.jsonl + data/questions.json`);
  if (args.images) console.log(`Copied ${images} images → public/media/`);
  console.log("Swedish stems/options/explanations were copied verbatim.");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
