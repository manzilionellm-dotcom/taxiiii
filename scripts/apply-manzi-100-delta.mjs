#!/usr/bin/env node
/** Apply Manzi 100% fixes onto data/questions.jsonl (+ optional media-manifest patch). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const renamePath = join(root, "data/sakerhet-rename-map.json");
const fixesPath = join(root, "data/manzi-100-content-fixes.json");
const deltaPath = join(root, "data/manzi-100-delta.json");
const target = join(root, "data/questions.jsonl");
const manifestPath = join(root, "data/media-manifest.json");
const manifestPatchPath = join(root, "data/media-manifest-pdf-patch.json");

function renameSakerhet(id) {
  return typeof id === "string" && id.startsWith("SAKERHET-")
    ? "S_KERHET-" + id.slice("SAKERHET-".length)
    : id;
}

const renameMap = existsSync(renamePath) ? JSON.parse(readFileSync(renamePath, "utf8")) : {};
let fixes = [];
if (existsSync(fixesPath)) fixes = JSON.parse(readFileSync(fixesPath, "utf8"));
else if (existsSync(deltaPath)) fixes = JSON.parse(readFileSync(deltaPath, "utf8"));
const byId = new Map(fixes.map((row) => [row.id, row]));
for (const [oldId, newId] of Object.entries(renameMap)) byId.set(oldId, byId.get(newId) || { id: newId });

const lines = existsSync(target) ? readFileSync(target, "utf8").split(/\r?\n/) : [];
const out = [];
const seen = new Set();
let replaced = 0;
for (const line of lines) {
  if (!line.trim()) continue;
  let row = JSON.parse(line);
  const mapped = renameMap[row.id];
  if (mapped) {
    row.id = mapped;
    if (typeof row.source === "string") row.source = row.source.replaceAll("SAKERHET-", "S_KERHET-");
    replaced++;
  } else if (row.id.startsWith("SAKERHET-")) {
    row.id = renameSakerhet(row.id);
    if (typeof row.source === "string") row.source = row.source.replaceAll("SAKERHET-", "S_KERHET-");
    replaced++;
  }
  const hit = byId.get(row.id);
  if (hit && hit.options) {
    out.push(JSON.stringify(hit));
    seen.add(hit.id);
    replaced++;
  } else {
    out.push(JSON.stringify(row));
    seen.add(row.id);
  }
}
for (const row of fixes) {
  if (!seen.has(row.id)) {
    out.push(JSON.stringify(row));
    seen.add(row.id);
  }
}
writeFileSync(target, out.join("\n") + "\n");
console.log(`apply-manzi-100: questions.jsonl → ${out.length} rows (touched ${replaced})`);

if (existsSync(manifestPatchPath) && existsSync(manifestPath)) {
  const mm = JSON.parse(readFileSync(manifestPath, "utf8"));
  const patch = JSON.parse(readFileSync(manifestPatchPath, "utf8"));
  mm.files = { ...(mm.files || {}), ...(patch.files || {}) };
  writeFileSync(manifestPath, JSON.stringify(mm, null, 2) + "\n");
  console.log(`apply-manzi-100: media-manifest files → ${Object.keys(mm.files).length}`);
}
