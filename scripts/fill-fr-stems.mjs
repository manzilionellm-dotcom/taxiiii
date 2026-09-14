#!/usr/bin/env node
/**
 * Fill missing French stems in data/translations.fr.json.
 * Only curated overrides — never the word-by-word hybrid mixer.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { looksUnusableFrench } from "../lib/questions/french.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "data/translations.fr.json");
const questions = JSON.parse(readFileSync(join(root, "data/questions.json"), "utf8"));
const current = JSON.parse(readFileSync(dest, "utf8"));
const OVERRIDES = JSON.parse(readFileSync(join(root, "data/fr-stem-overrides.json"), "utf8"));

function existingStem(id) {
  const hit = current[id];
  if (hit && typeof hit.stem === "string" && !looksUnusableFrench(hit.stem)) return hit.stem;
  return "";
}

let added = 0;
for (const question of questions) {
  if (existingStem(question.id)) continue;
  const stem = OVERRIDES[question.id];
  if (!stem || looksUnusableFrench(stem)) continue;
  current[question.id] = { ...(current[question.id] || {}), stem };
  added += 1;
}

writeFileSync(dest, `${JSON.stringify(current, null, 2)}\n`);
console.log(`fill-fr-stems: added ${added}, total ${Object.keys(current).length}`);
