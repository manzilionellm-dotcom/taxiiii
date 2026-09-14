#!/usr/bin/env node
/**
 * Manzi exam-parity invariants.
 *
 * Pins the three things that silently broke parity before: an id spelling the
 * page mapper cannot read, a Blob key the manifest cannot resolve, and scraper
 * text sitting inside a live answer option. Also pins the honest gaps, so that
 * rows dropping out of the bank is a test failure rather than a quiet loss,
 * and so restoring a real answer key is a deliberate edit to this file.
 */
import { readFileSync } from "node:fs";
import { normalizeManziRecord } from "./research-normalize.mjs";
import { BLOB_STORE_HOST, parsePdfPageId } from "../lib/media/paths.mjs";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), "utf8");
const readJson = (rel) => JSON.parse(read(rel));
const rows = read("data/questions.jsonl").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
const compiled = readJson("data/questions.json");
const manifest = readJson("data/media-manifest.json");
const confirmed = readJson("data/pdf-pages-on-blob.json");

/* ------------------------------------------------- 1. id scheme is mappable */

/**
 * Säkerhet books are spelled S_KERHET-* everywhere: in books 2..9, in the Blob
 * folder names, and in PDF_PAGE_ID. A row spelled SAKERHET-* is a Säkerhet
 * question whose exam page can never attach.
 */
for (const source of [
  { name: "data/questions.jsonl", list: rows },
  { name: "data/questions.json", list: compiled },
]) {
  const stray = source.list.filter((item) => /^SAKERHET-/i.test(String(item.id)));
  assert(
    !stray.length,
    `${source.name}: ${stray.length} id(s) use the unmappable SAKERHET spelling ` +
      `(${stray.slice(0, 3).map((item) => item.id).join(", ")}) — use S_KERHET-*`,
  );
}

/** Every Lagstiftning/Säkerhet QCM must resolve to a page number. */
const bookRows = compiled.filter((q) => /^(LAGSTIFNING|S_KERHET)-\d+-Q\d+$/.test(String(q.id)));
assert(bookRows.length >= 380, `book QCM count collapsed: ${bookRows.length}`);
for (const q of bookRows) {
  const parsed = parsePdfPageId(q.id);
  if (!parsed) continue; // Q > PDF_PAGE_MAX_Q, e.g. the S_KERHET-7-Q2009 typo
  if (!confirmed.includes(parsed.logicalKey)) continue; // page genuinely not on Blob
  assert(
    q.imageUrl === `/media/${parsed.logicalKey}`,
    `${q.id}: page ${parsed.logicalKey} is on Blob but imageUrl is ${q.imageUrl || "(none)"}`,
  );
}

/* --------------------------------------- 2. every Blob key is resolvable */

/**
 * readBlobMedia resolves a pathname with blobRefForManifest(entry). A confirmed
 * key with no manifest entry yields null, so the page 404s even once
 * BLOB_READ_WRITE_TOKEN is set. The manifest must cover the inventory.
 */
const files = manifest.files || {};
const unresolvable = confirmed.filter((key) => !files[key]);
assert(
  !unresolvable.length,
  `${unresolvable.length} confirmed Blob key(s) have no manifest entry, so they cannot be ` +
    `served: ${unresolvable.slice(0, 3).join(", ")}`,
);
for (const key of confirmed.slice(0, 40)) {
  const entry = files[key];
  assert(entry.pathname === `media/${key}`, `${key}: manifest pathname must be media/<key>`);
  assert(
    !entry.url || entry.url.startsWith(BLOB_STORE_HOST),
    `${key}: manifest url must point at the configured Blob store`,
  );
  assert(
    entry.size === undefined || Number(entry.size) > 0,
    `${key}: a manifest size must come from a real list() run, never be invented`,
  );
}

/* ------------------------------- 3. no scraper text inside live options */

const optionText = (id, letter) =>
  String(compiled.find((q) => String(q.id) === id)?.options?.find((o) => o.letter === letter)?.text ?? "");

const q53 = compiled.find((q) => String(q.id) === "LAGSTIFNING-8-Q53");
assert(q53, "LAGSTIFNING-8-Q53 must be in the bank after its merged option was split");
assert(q53.options.length === 4, `LAGSTIFNING-8-Q53 must have 4 options, got ${q53.options.length}`);
assert(q53.answer === "C", "LAGSTIFNING-8-Q53 answer stays C, as the row's own facit records");
assert(optionText("LAGSTIFNING-8-Q53", "B") === "Tisdag kl 24:00", "Q53 option B keeps only its own text");
assert(optionText("LAGSTIFNING-8-Q53", "C") === "Onsdag Kl 10:00", "Q53 option C is the recovered text");

assert(
  !/FRÅGA Samer/i.test(optionText("S_KERHET-8-Q42", "D")),
  "S_KERHET-8-Q42: the «FRÅGA Samer» author note must not sit in a live option",
);

/** The PDF's option-letter row must not trail any option text. */
const LETTER_RUN = /\s+A(?:\s+B(?:\s+C(?:\s+D(?:\s+E)?)?)?)\s*$/;
const letterRun = compiled.filter((q) =>
  (q.options || []).some((o) => LETTER_RUN.test(String(o.text || ""))),
);
assert(
  !letterRun.length,
  `option(s) end with the scraped option-letter row: ${letterRun.slice(0, 3).map((q) => q.id).join(", ")}`,
);
// The rule must never eat an option's own trailing letter.
assert(
  optionText("LAGSTIFNING-8-Q47", "E") === "Bild B och Bild D",
  `LAGSTIFNING-8-Q47 option E must keep its own «Bild D», got ${JSON.stringify(optionText("LAGSTIFNING-8-Q47", "E"))}`,
);

/** No option anywhere may carry a numbered question stem the scraper glued on. */
const glued = compiled.filter((q) =>
  (q.options || []).some((o) => /\s\d+\s*\.\s*(Du|Vilket|Vilken|Hur|Vad|N[äa]r|Var)\b/.test(String(o.text || ""))),
);
assert(
  !glued.length,
  `option(s) carry a glued question stem: ${glued.slice(0, 3).map((q) => q.id).join(", ")}`,
);

/* ---------------------------------------------- 4. the honest gaps, pinned */

/**
 * Rows that cannot enter the QCM bank without inventing exam content. Manzi
 * himself recorded the cause on the korkortA rows: «Facit saknas i filen».
 * Guessing an answer key on a driving-licence exam is not an option, so these
 * stay out and the count is pinned. Restoring a real key from the books is a
 * deliberate edit here.
 */
const manziPass = rows.filter((r) => !String(r.id).startsWith("research-"));
const skips = [];
manziPass.forEach((r, i) => {
  const res = normalizeManziRecord(r, i);
  if (!res.question) skips.push({ id: String(r.id), why: (res.issues[0] || res.warnings?.[0] || "?") });
});
const missingAnswer = skips.filter((s) => /missing answer key/.test(s.why));
const tooFewOptions = skips.filter((s) => /fewer than 2 options/.test(s.why));
const answerNotAmong = skips.filter((s) => /not among options/.test(s.why));

assert(
  missingAnswer.length === 61,
  `rows with no answer key anywhere: expected 61, got ${missingAnswer.length}. ` +
    "Up = rows lost a key; down = a key was restored (update this number and say where it came from). " +
    "LAGSTIFNING-4-Q6 is no longer in this bucket (PDF option F / SWEDAC was glued onto E). " +
    "The 18 KARTA rows recovered from identical twins are already accounted for here.",
);
assert(
  tooFewOptions.length === 15,
  `rows with fewer than 2 options: expected 15, got ${tooFewOptions.length}`,
);
assert(
  answerNotAmong.length === 1,
  `rows whose answer has no matching option: expected 1 (S_KERHET-1-Q1, option D lost in the ` +
    `scrape), got ${answerNotAmong.length}`,
);
assert(
  answerNotAmong[0]?.id === "S_KERHET-1-Q1",
  `the only answer-without-option row should be S_KERHET-1-Q1, got ${answerNotAmong[0]?.id}`,
);

/* ------------------- 4b. the answer-recovery premise must still hold ------ */

/**
 * 18 KARTA answers were recovered from a row with an identical stem, identical
 * options and the identical raster. The premise is that such rows never
 * disagree on the letter. Re-checked here on every run: if Manzi's bank ever
 * contains a counterexample, the transfer was unsafe and this fails.
 */
const normText = (v) =>
  String(v || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
const fullSignature = (r) =>
  `${normText(r.stem_sv)}##${(r.options || []).map((o) => `${o.letter}:${normText(o.text)}`).join("|")}` +
  `##${String(r.imageUrl || "").split("/").pop() || ""}`;

const answeredGroups = new Map();
for (const r of rows) {
  if (!String(r.answer ?? "").trim()) continue;
  if ((r.options || []).filter((o) => String(o.text || "").trim()).length < 2) continue;
  const key = fullSignature(r);
  if (!answeredGroups.has(key)) answeredGroups.set(key, []);
  answeredGroups.get(key).push(r);
}
let agree = 0;
const disagree = [];
for (const [, list] of answeredGroups) {
  if (list.length < 2) continue;
  const letters = new Set(list.map((r) => String(r.answer).trim().toUpperCase()));
  if (letters.size > 1) disagree.push(list.map((r) => `${r.id}=${r.answer}`).join(" "));
  else agree += 1;
}
assert(
  !disagree.length,
  `identical question appears with different answers, so twin recovery is unsafe: ${disagree.slice(0, 3).join(" | ")}`,
);
assert(
  agree >= 26,
  `expected at least 26 corroborating identical-question groups, found ${agree}`,
);

/** Every recovered answer must still name a real option, and cite its source. */
const recovered = rows.filter((r) => Array.isArray(r.answerRecoveredFrom));
assert(
  recovered.length === 18,
  `expected 18 rows with recorded answer provenance, got ${recovered.length}`,
);
for (const r of recovered) {
  assert(
    (r.options || []).some((o) => o.letter === String(r.answer).trim().toUpperCase()),
    `${r.id}: recovered answer ${r.answer} names no option`,
  );
  assert(r.answerRecoveredFrom.length >= 1, `${r.id}: provenance list is empty`);
  for (const donorId of r.answerRecoveredFrom) {
    const donor = rows.find((x) => String(x.id) === donorId);
    assert(donor, `${r.id}: provenance cites missing row ${donorId}`);
    assert(
      String(donor.answer).trim().toUpperCase() === String(r.answer).trim().toUpperCase(),
      `${r.id}: provenance row ${donorId} no longer agrees`,
    );
    assert(
      fullSignature(donor) === fullSignature(r),
      `${r.id}: provenance row ${donorId} is no longer the identical question`,
    );
  }
}

/**
 * bkort-classic rows must stay out. They carry an answer letter with an empty
 * option list, and bkort-classic-5 claims «A» where its verified twin
 * kkalk-S-088 answers «D» (Väjningsplikt) — the letter refers to a lost option
 * order, so importing options and keeping it would teach the wrong sign.
 */
const bkortClassic = compiled.filter((q) => /^bkort-classic-/.test(String(q.id)));
assert(
  !bkortClassic.length,
  `bkort-classic rows must not enter the bank: ${bkortClassic.map((q) => q.id).join(", ")}`,
);

/* No compiled question may promise a picture it does not have. */
const NEEDS_FIGURE =
  /\b(p[åa]\s+bilden|bilden\s+visar|enligt\s+bilden|i\s+bilden|p[åa]\s+bild\b|i\s+figuren|figuren\s+visar|som\s+bilden)\b/i;
const brokenPromise = compiled.filter((q) => NEEDS_FIGURE.test(String(q.stem_sv || "")) && !q.imageUrl);
assert(
  !brokenPromise.length,
  `question(s) point at a picture they do not have: ${brokenPromise.slice(0, 5).map((q) => q.id).join(", ")}`,
);

const manziCount = compiled.filter((q) => q.corpus === "manzi").length;
const withImage = compiled.filter((q) => q.imageUrl).length;
console.log(
  `manzi-parity.test OK · manzi ${manziCount} · images ${withImage}/${compiled.length} · ` +
    `S_KERHET-1 mapped ${compiled.filter((q) => /^S_KERHET-1-Q/.test(String(q.id)) && q.imageUrl).length}/35 · ` +
    `manifest covers all ${confirmed.length} Blob keys · honest gaps ${skips.length}`,
);
