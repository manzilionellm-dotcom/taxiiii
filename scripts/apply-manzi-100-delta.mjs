#!/usr/bin/env node
/** Apply Manzi 100% / 100b / 100c fixes onto data/questions.jsonl (merge, never drop images). */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const renamePath = join(dataDir, "sakerhet-rename-map.json");
const fixesPath = join(dataDir, "manzi-100-content-fixes.json");
const deltaPath = join(dataDir, "manzi-100-delta.json");
const target = join(dataDir, "questions.jsonl");
const manifestPath = join(dataDir, "media-manifest.json");
const manifestPatchPath = join(dataDir, "media-manifest-pdf-patch.json");

/**
 * Do not apply these even if a patch file exists:
 * - bkort-classic-*: answer letter is unmoored from an empty option list;
 *   twin kkalk-S-088 proves classic-5 «A» ≠ Väjningsplikt «D».
 * - S_KERHET-1-Q1: source facit is D and option D is missing — rewriting to C invents.
 * - LAGSTIFNING-8-Q53: already split on main (#23); do not trim option D.
 * - research-*: compile ignores Manzi copies of research-* ids.
 */
const REFUSE_IDS = new Set([
  ...Array.from({ length: 14 }, (_, i) => `bkort-classic-${i + 1}`),
  "S_KERHET-1-Q1",
  "LAGSTIFNING-8-Q53",
]);

function renameSakerhet(id) {
  return typeof id === "string" && id.startsWith("SAKERHET-")
    ? "S_KERHET-" + id.slice("SAKERHET-".length)
    : id;
}

/** Allow PDF facit letter F (LAGSTIFNING-4-Q6 etc.). Idempotent. */
function ensureLettersF() {
  const normPath = join(root, "scripts/research-normalize.mjs");
  if (!existsSync(normPath)) return;
  let s = readFileSync(normPath, "utf8");
  const orig = s;
  s = s.replace(
    /const LETTERS = \["A", "B", "C", "D", "E"(?:, "F")?\];/,
    'const LETTERS = ["A", "B", "C", "D", "E", "F"];',
  );
  s = s.replace("([A-E])\\.\\s*(.+)$/s", "([A-F])\\.\\s*(.+)$/s");
  if (s !== orig) {
    writeFileSync(normPath, s);
    console.log("apply-manzi-100: LETTERS extended to A–F in research-normalize.mjs");
  }
}

function loadFixFiles() {
  const all = [];
  const pushFile = (n) => all.push(...JSON.parse(readFileSync(join(dataDir, n), "utf8")));
  if (existsSync(fixesPath)) {
    all.push(...JSON.parse(readFileSync(fixesPath, "utf8")));
  } else {
    for (const n of readdirSync(dataDir)
      .filter((name) => /^manzi-100-content-fixes\.part\d+\.json$/.test(name))
      .sort()) {
      pushFile(n);
    }
    if (!all.length && existsSync(deltaPath)) all.push(...JSON.parse(readFileSync(deltaPath, "utf8")));
  }
  for (const n of readdirSync(dataDir)
    .filter((name) => /^manzi-100b-content-fixes\.part\d+\.json$/.test(name))
    .sort()) {
    pushFile(n);
  }
  const singleB = join(dataDir, "manzi-100b-content-fixes.json");
  if (existsSync(singleB)) all.push(...JSON.parse(readFileSync(singleB, "utf8")));
  const htmFacit = join(dataDir, "manzi-100c-htm-facit.json");
  if (existsSync(htmFacit)) all.push(...JSON.parse(readFileSync(htmFacit, "utf8")));
  for (const n of readdirSync(dataDir)
    .filter((name) => /^manzi-100c-content-fixes\.part\d+\.json$/.test(name))
    .sort()) {
    pushFile(n);
  }
  return all;
}

export function shouldApplyFix(row) {
  if (!row?.id || REFUSE_IDS.has(row.id)) return false;
  if (String(row.id).startsWith("research-")) return false;
  const opts = row.options || [];
  const nonempty = opts.filter((o) => String(o.text || "").trim()).length;
  return Boolean(row.answer) && nonempty >= 2;
}

/** Overlay patch fields; never drop imageUrl / twin provenance / verbatim stem. */
export function mergeFix(existing, fix) {
  if (fix.stem_sv && existing.stem_sv && fix.stem_sv !== existing.stem_sv) {
    throw new Error(`apply-manzi-100: refuse stem rewrite on ${fix.id}`);
  }
  const next = { ...existing };
  if (fix.options) next.options = fix.options;
  if (fix.answer) next.answer = fix.answer;
  if (typeof fix.explanation_sv === "string" && fix.explanation_sv.trim()) {
    next.explanation_sv = fix.explanation_sv;
  }
  if (typeof fix.explanation_fr === "string" && fix.explanation_fr.trim() && !existing.explanation_fr) {
    next.explanation_fr = fix.explanation_fr;
  }
  if (existing.imageUrl) next.imageUrl = existing.imageUrl;
  else if (fix.imageUrl) next.imageUrl = fix.imageUrl;
  if (existing.answerRecoveredFrom) next.answerRecoveredFrom = existing.answerRecoveredFrom;
  return next;
}

function loadFixes() {
  return loadFixFiles().filter(shouldApplyFix);
}

ensureLettersF();

const renameMap = existsSync(renamePath) ? JSON.parse(readFileSync(renamePath, "utf8")) : {};
const fixes = loadFixes();
const byId = new Map(fixes.map((row) => [row.id, row]));
for (const [oldId, newId] of Object.entries(renameMap)) byId.set(oldId, byId.get(newId) || { id: newId });

const lines = existsSync(target) ? readFileSync(target, "utf8").split(/\r?\n/) : [];
const out = [];
const seen = new Set();
let replaced = 0;
let merged = 0;
for (const line of lines) {
  if (!line.trim()) continue;
  let row = JSON.parse(line);
  const mapped = renameMap[row.id];
  if (mapped) {
    row.id = mapped;
    if (typeof row.source === "string") row.source = row.source.replaceAll("SAKERHET-", "S_KERHET-");
    replaced++;
  } else if (String(row.id || "").startsWith("SAKERHET-")) {
    row.id = renameSakerhet(row.id);
    if (typeof row.source === "string") row.source = row.source.replaceAll("SAKERHET-", "S_KERHET-");
    replaced++;
  }
  const hit = byId.get(row.id);
  if (hit && hit.options && shouldApplyFix(hit)) {
    out.push(JSON.stringify(mergeFix(row, hit)));
    seen.add(hit.id);
    merged++;
  } else {
    out.push(JSON.stringify(row));
    seen.add(row.id);
  }
}
for (const row of fixes) {
  if (!seen.has(row.id)) {
    out.push(JSON.stringify(row));
    seen.add(row.id);
    merged++;
  }
}
writeFileSync(target, out.join("\n") + "\n");
console.log(
  `apply-manzi-100: questions.jsonl → ${out.length} rows (renames ${replaced}, merged ${merged}, fixes ${fixes.length})`,
);

if (existsSync(manifestPatchPath) && existsSync(manifestPath)) {
  const mm = JSON.parse(readFileSync(manifestPath, "utf8"));
  const patch = JSON.parse(readFileSync(manifestPatchPath, "utf8"));
  mm.files = { ...(mm.files || {}), ...(patch.files || {}) };
  writeFileSync(manifestPath, JSON.stringify(mm, null, 2) + "\n");
  console.log(`apply-manzi-100: media-manifest files → ${Object.keys(mm.files).length}`);
}
