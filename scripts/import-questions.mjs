#!/usr/bin/env node
/**
 * Import Manzi and/or research JSONL, then compile both.
 * Research is never overwritten by a Manzi import.
 *
 *   npm run import:check
 *   npm run import -- --manzi /path/manzi.jsonl
 *   npm run import -- --research /path/research-bank.jsonl
 *   npm run import -- --manzi /path/manzi.jsonl --research /path/research-bank.jsonl --images /path/media
 *   npm run import -- --coordinator
 *     → /workspace/taxiprov/manzi/questions-merged.jsonl + images/ (1668 + 2877)
 */

import { pathToFileURL } from "node:url";
import { compile } from "./compile-banks.mjs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

function main() {
  const argv = process.argv.slice(2);
  const legacy = argv.find((token) => token && !token.startsWith("-"));
  const forwarded = [...argv];
  if (legacy && !argv.includes("--manzi") && !argv.includes("--research")) {
    forwarded.push("--manzi", resolve(legacy));
  }
  const result = spawnSync(process.execPath, [resolve(here, "compile-banks.mjs"), ...forwarded], {
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--inline")) {
    const check = process.argv.includes("--check");
    compile({ check });
  } else {
    main();
  }
}
