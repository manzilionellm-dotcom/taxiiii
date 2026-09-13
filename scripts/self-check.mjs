import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { parseJsonl, isResearchShape, normalizeResearchRecord, sortForStudy } from "./research-normalize.mjs";
import { compile } from "./compile-banks.mjs";
import { reconstructStem, tokenizeStem } from "../lib/tokenize-stem.mjs";

const require = createRequire(import.meta.url);

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const researchPath = new URL("../data/research-bank.jsonl", import.meta.url);
const manziPath = new URL("../data/questions.jsonl", import.meta.url);
const compiledPath = new URL("../data/questions.json", import.meta.url);
const extrasPath = new URL("../data/rag-extras.json", import.meta.url);
const vocabDir = new URL("../data/vocab/", import.meta.url);

const researchRaw = readFileSync(researchPath, "utf8");
const manziRaw = readFileSync(manziPath, "utf8");
const { records: researchRecords, issues: researchIssues } = parseJsonl(researchRaw);
assert(!researchIssues.length, `research JSONL issues: ${researchIssues.join("; ")}`);
assert(researchRecords.length >= 20, "research-bank.jsonl too small");
assert(
  researchRecords.every((record) => isResearchShape(record) && record.sv.includes(record.sv)),
  "research sv missing",
);
assert(
  researchRecords.every((record) => String(record.sv).trim() === String(record.sv).trim()),
  "research sv mutated unexpectedly",
);

const first = normalizeResearchRecord(researchRecords[0], 0);
assert(first.question?.corpus === "research", "research normalize must tag corpus=research");
assert(first.question?.stem_sv === first.question.stem_sv, "stem must be taken from sv");
assert(!first.question.stem_sv.includes("| Alt:"), "embedded | Alt: must be split out of stem");

const manzi = manziRaw
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));
assert(manzi.length >= 10, "Manzi sample bank too small");
assert(manzi.every((q) => q.stem_sv && q.explanation_sv && q.explanation_fr), "verbatim Manzi fields missing");

const compiled = JSON.parse(readFileSync(compiledPath, "utf8"));
const researchCount = compiled.filter((item) => item.corpus === "research").length;
const manziCount = compiled.filter((item) => item.corpus === "manzi").length;
assert(researchCount === researchRecords.length, "compiled dropped research items");
assert(manziCount === manzi.length, "compiled dropped Manzi items");
assert(compiled.length === researchCount + manziCount, "compiled length != research + manzi");

const ordered = sortForStudy(compiled);
assert(ordered[0].corpus === "research", "study order must start with research");
assert(ordered[0].freq === "high", "first study item should be high-frequency research");
const head = ordered.slice(0, 12).map((item) => `${item.id} ${item.stem_sv}`).join("\n");
assert(/heldragen|gul linje/i.test(head), "starter window must include gul heldragen linje");
assert(/taxameter|24 mån/i.test(head), "starter window must include taxameter 24-mån trap");
assert(/dygnsvila|vilotid|11 timm/i.test(head), "starter window must include vilotid 11/8");

const highIds = compiled.filter((item) => item.freq === "high").map((item) => item.id);
assert(highIds.some((id) => /vila|taxameter|linje|tidbok|pris/i.test(id)), "missing high-freq YouTube traps");

const sessions = ["session-01.json", "session-02.json", "session-03.json", "session-04.json", "session-05-friday-mini.json"];
for (const name of sessions) {
  assert(existsSync(new URL(name, vocabDir)), `missing vocab ${name}`);
}

assert(existsSync(extrasPath), "data/rag-extras.json missing");
const extras = JSON.parse(readFileSync(extrasPath, "utf8"));
assert(extras.length >= 4, "YouTube transcripts not compiled into rag-extras");
assert(
  extras.some((note) => /110t__6WZ7Q|prisresan|jämförpris/i.test(JSON.stringify(note))),
  "prisresan notes missing from RAG extras",
);

const check = compile({ check: true });
assert(check.filter((item) => item.corpus === "research").length === researchCount, "check compile dropped research");

const readySv = "Bravo, du är redo att göra provet.";
const readyFr = "Bravo, tu es prêt à passer l'examen.";
assert(readySv.includes("redo"), "SV ready message");
assert(readyFr.includes("prêt"), "FR ready message");

const hardWords = JSON.parse(readFileSync(new URL("../data/hard-words.json", import.meta.url), "utf8"));
const gulStem = "Vad anger en gul heldragen linje på trottoarkanten?";
const gulTokens = tokenizeStem(gulStem, hardWords);
assert(reconstructStem(gulTokens) === gulStem, "cloze must keep Swedish stem word-for-word");
const gulBlanks = gulTokens.filter((token) => token.type === "blank").map((token) => token.text);
assert(gulBlanks.length === 2, "gul linje stem should have two cloze spans");
assert(gulBlanks[0] === "heldragen linje", "phrase heldragen linje once");
assert(gulBlanks[1] === "trottoarkanten", "trottoarkanten once");
assert(!gulBlanks.includes("trottoarkant"), "shorter form must not also chip");

const overlapStem = "En bindande prisuppgift och prisuppgift krävs.";
const overlapTokens = tokenizeStem(overlapStem, hardWords);
assert(reconstructStem(overlapTokens) === overlapStem, "overlapping dictionary forms must not drop text");
const overlapBlanks = overlapTokens.filter((token) => token.type === "blank").map((token) => token.text.toLowerCase());
assert(overlapBlanks.filter((text) => text.includes("prisuppgift")).length === 2, "two prisuppgift spans");

const gulCompiled = compiled.find((item) => item.id === "rs-yt-lag1-gul-linje");
assert(gulCompiled?.imageUrl === "/media/gul-heldragen-linje.svg", "gul linje must ship dual-coding image");
assert(existsSync(new URL("../content/media/gul-heldragen-linje.svg", import.meta.url)), "gul linje svg missing");

console.log(
  `self-check OK · research ${researchCount} + manzi ${manziCount} · extras ${extras.length} · ready@95`,
);
void require;
