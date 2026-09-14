#!/usr/bin/env node
/**
 * Vercel / CI build helper.
 *
 * `npm run import` reapplies Manzi deltas and recompiles the bank. That is
 * correct on a coordinator box, but on Vercel it is too heavy (and after #27
 * the compiled bank is already committed). Use data/questions.json when it
 * is present; set FORCE_IMPORT=1 to recompile anyway.
 */
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const bank = resolve(root, "data/questions.json");
const force = process.env.FORCE_IMPORT === "1";

if (!force && existsSync(bank)) {
  let n = "?";
  try {
    const parsed = JSON.parse(readFileSync(bank, "utf8"));
    n = Array.isArray(parsed) ? String(parsed.length) : "?";
  } catch {
    n = "?";
  }
  console.log(`maybe-import: using committed data/questions.json (${n} Q) — skip npm run import`);
  process.exit(0);
}

console.log(force ? "maybe-import: FORCE_IMPORT=1 → npm run import" : "maybe-import: no questions.json → npm run import");
const result = spawnSync("npm", ["run", "import"], { cwd: root, stdio: "inherit" });
process.exit(result.status ?? 1);
