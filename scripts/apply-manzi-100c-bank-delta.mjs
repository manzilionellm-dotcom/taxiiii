#!/usr/bin/env node
/** Apply manzi-100c bank-delta (mono or .part0+.part1) onto data/questions.json. */
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const qPath = join(dataDir, "questions.json");
const reportPath = join(dataDir, "media-report.json");
const mono = join(dataDir, "manzi-100c-bank-delta.json");

function loadDelta() {
  if (existsSync(mono)) return JSON.parse(readFileSync(mono, "utf8"));
  const parts = readdirSync(dataDir)
    .filter((n) => /^manzi-100c-bank-delta\.part\d+\.json$/.test(n))
    .sort();
  if (!parts.length) return null;
  const merged = { upsert: [], delete: [] };
  for (const n of parts) {
    const d = JSON.parse(readFileSync(join(dataDir, n), "utf8"));
    merged.upsert.push(...(d.upsert || []));
    merged.delete.push(...(d.delete || []));
  }
  return merged;
}

if (!existsSync(qPath)) {
  console.log("apply-manzi-100c-bank-delta: skip (no questions.json)");
  process.exit(0);
}
const delta = loadDelta();
if (!delta) {
  console.log("apply-manzi-100c-bank-delta: skip (no delta)");
  process.exit(0);
}

const questions = JSON.parse(readFileSync(qPath, "utf8"));
const byId = new Map(questions.map((q) => [q.id, q]));
for (const id of delta.delete || []) byId.delete(id);
for (const row of delta.upsert || []) byId.set(row.id, row);
const next = [...byId.values()];
writeFileSync(qPath, `${JSON.stringify(next, null, 2)}\n`);

const manziCount = next.filter((q) => q.corpus === "manzi").length;
const researchCount = next.filter((q) => q.corpus === "research").length;
const ownerSeedCount = next.filter((q) => q.corpus === "owner-seed").length;
const ownerOfficialCount = next.filter((q) => q.corpus === "owner-official").length;
const ownerImportCount = next.filter((q) => q.corpus === "owner-import").length;
let report = {};
if (existsSync(reportPath)) {
  try { report = JSON.parse(readFileSync(reportPath, "utf8")); } catch {}
}
Object.assign(report, {
  generatedAt: new Date().toISOString(),
  questionsTotal: next.length,
  researchCount,
  ownerCount: ownerSeedCount + ownerOfficialCount + ownerImportCount,
  ownerSeedCount,
  ownerOfficialCount,
  ownerImportCount,
  manziCount,
  questionsWithImageUrl: next.filter((q) => q.imageUrl).length,
  beforeMainManziCount: 1378,
  deltaManziVsMain: manziCount - 1378,
  note: "manzi-100c bank-delta applied onto questions.json",
});
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(
  `apply-manzi-100c-bank-delta: questions.json → ${next.length} (manzi ${manziCount}, upsert ${(delta.upsert||[]).length}, delete ${(delta.delete||[]).length})`,
);
