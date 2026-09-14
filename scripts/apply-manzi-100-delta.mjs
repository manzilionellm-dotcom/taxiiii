#!/usr/bin/env node
/**
 * Apply Manzi 100% delta onto data/questions.jsonl (idempotent).
 * Usage: node scripts/apply-manzi-100-delta.mjs
 * Prefers shipping a fully rewritten data/questions.jsonl in the same PR when MCP allows.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const deltaPath = join(root, "data/manzi-100-delta.json");
const target = join(root, "data/questions.jsonl");

function renameSakerhet(id) {
  return typeof id === "string" && id.startsWith("SAKERHET-")
    ? "S_KERHET-" + id.slice("SAKERHET-".length)
    : id;
}

const delta = JSON.parse(readFileSync(deltaPath, "utf8"));
const byId = new Map(delta.map((row) => [row.id, row]));
// Also index old SAKERHET ids → new rows
for (const row of delta) {
  if (row.id.startsWith("S_KERHET-")) {
    byId.set("SAKERHET-" + row.id.slice("S_KERHET-".length), row);
  }
}

const lines = existsSync(target) ? readFileSync(target, "utf8").split(/\r?\n/) : [];
const out = [];
const seen = new Set();
let replaced = 0;
for (const line of lines) {
  if (!line.trim()) continue;
  const row = JSON.parse(line);
  const hit = byId.get(row.id) || byId.get(renameSakerhet(row.id));
  if (hit) {
    out.push(JSON.stringify(hit));
    seen.add(hit.id);
    replaced++;
  } else {
    const id = renameSakerhet(row.id);
    if (id !== row.id) {
      row.id = id;
      if (typeof row.source === "string") {
        row.source = row.source.replaceAll("SAKERHET-", "S_KERHET-");
      }
      replaced++;
    }
    out.push(JSON.stringify(row));
    seen.add(row.id);
  }
}
for (const row of delta) {
  if (!seen.has(row.id)) {
    out.push(JSON.stringify(row));
    seen.add(row.id);
  }
}
writeFileSync(target, out.join("\n") + "\n");
console.log(`apply-manzi-100-delta: wrote ${out.length} rows (replaced/updated ${replaced}) → data/questions.jsonl`);
