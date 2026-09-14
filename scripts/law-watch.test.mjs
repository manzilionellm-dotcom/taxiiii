#!/usr/bin/env node
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { ingestLawWatch } from "./ingest-law-watch.mjs";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const dir = mkdtempSync(join(tmpdir(), "law-watch-"));
const research = join(dir, "research-bank.jsonl");
const meta = join(dir, "meta.json");
const snapshot = join(dir, "law-watch-meta.ts");
const emptyWatch = join(dir, "empty.jsonl");
const draft = join(dir, "draft.jsonl");

writeFileSync(research, `${JSON.stringify({ id: "rs-existing", sv: "Befintlig fråga?" })}\n`);
writeFileSync(emptyWatch, "# comments only\n");
writeFileSync(
  draft,
  `${JSON.stringify({
    id: "lw-test-merge-only",
    sv: "Hur lång måste dygnsvilan minst vara? | Alt: A. 8 timmar | Alt: B. 11 timmar",
    fr: "Quelle est la durée minimale de dygnsvila ?",
    type: "qcm",
    source: "law-watch:test",
    topic: "lagstiftning",
    answer: "B",
  })}\n`,
);

const none = ingestLawWatch(emptyWatch, { research, meta, snapshot });
assert(none.added === 0, "empty draft adds nothing");
assert(readFileSync(research, "utf8").includes("rs-existing"), "existing research kept");
assert(!readFileSync(research, "utf8").includes("lw-test-merge-only"), "empty did not invent a row");

const merged = ingestLawWatch(draft, { research, meta, snapshot });
assert(merged.added === 1, "new id is appended");
assert(merged.meta.status === "merged", "status becomes merged");
assert(readFileSync(research, "utf8").includes("rs-existing"), "merge does not replace the bank");
assert(readFileSync(research, "utf8").includes("lw-test-merge-only"), "new id written");

const again = ingestLawWatch(draft, { research, meta, snapshot });
assert(again.added === 0, "duplicate id is skipped");

let refused = false;
try {
  ingestLawWatch(join(dir, "bad.jsonl"), { research, meta, snapshot });
} catch {
  refused = true;
}
writeFileSync(join(dir, "bad.jsonl"), `${JSON.stringify({ id: "lw-bad", fr: "pas de sv" })}\n`);
try {
  ingestLawWatch(join(dir, "bad.jsonl"), { research, meta, snapshot });
} catch (error) {
  refused = String(error.message).includes("not research-shaped");
}
assert(refused, "rows without Swedish sv are refused");

const deny = spawnSync("node", ["scripts/compile-banks.mjs", "--research", "data/law-watch/latest.jsonl"], {
  encoding: "utf8",
});
assert(deny.status !== 0, "--research on law-watch must fail");
assert(
  (deny.stderr || deny.stdout).includes("law-watch"),
  `refuse message, got: ${deny.stderr || deny.stdout}`,
);

console.log("law-watch.test.mjs ok");
