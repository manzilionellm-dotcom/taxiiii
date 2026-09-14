#!/usr/bin/env node
/**
 * Guards the French pipeline:
 *   1. nothing hybrid may sit in data/translations.fr.json;
 *   2. Körkort B is fully covered (stem + every option + LÖSNING);
 *   3. the Swedish detector still catches Swedish;
 *   4. a French explanation is never promoted into the stem slot;
 *   5. the review helpers never wrap Swedish in a French sentence.
 */
import { readFileSync } from "node:fs";
import {
  frenchFromStore,
  looksHybridFrench,
  looksPlaceholderFrench,
  looksUnusableFrench,
} from "../lib/questions/french.mjs";
import { distractorNote, takeawayFor } from "../lib/questions/review.mjs";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const questions = JSON.parse(
  readFileSync(new URL("../data/questions.json", import.meta.url), "utf8"),
);
const translations = JSON.parse(
  readFileSync(new URL("../data/translations.fr.json", import.meta.url), "utf8"),
);

// 1. The store holds real French only.
const dirty = [];
for (const [id, value] of Object.entries(translations)) {
  for (const [field, text] of [
    ["stem", value?.stem],
    ["explanation", value?.explanation],
  ]) {
    if (typeof text === "string" && looksUnusableFrench(text)) dirty.push(`${id}.${field}`);
  }
  for (const [letter, text] of Object.entries(value?.options || {})) {
    if (typeof text === "string" && looksUnusableFrench(text)) {
      dirty.push(`${id}.options.${letter}`);
    }
  }
}
assert(
  !dirty.length,
  `hybrid or placeholder French in data/translations.fr.json: ${dirty.slice(0, 8).join(", ")}`,
);

// 2. Körkort B is the track Lionel reported as French-less. It must be complete.
const bTrack = questions.filter((question) => question.topic === "bkort");
assert(bTrack.length >= 600, `Körkort B bank shrank: ${bTrack.length}`);
/** 100c landed bkort-classic-12 SV-only — no identical twin to copy FR from. Do not invent. */
const SV_ONLY_B = new Set(["bkort-classic-12"]);
const gaps = { stem: [], options: [], explanation: [] };
for (const question of bTrack) {
  if (SV_ONLY_B.has(question.id)) continue;
  const french = frenchFromStore(translations, question);
  if (!french.stem) gaps.stem.push(question.id);
  const letters = Object.keys(french.options || {});
  if (letters.length !== question.options.length) gaps.options.push(question.id);
  if (!french.explanation) gaps.explanation.push(question.id);
}
assert(
  !translations["bkort-classic-12"],
  "bkort-classic-12 must stay without invented French until a real twin exists",
);
assert(!gaps.stem.length, `Körkort B stems without French: ${gaps.stem.slice(0, 6).join(", ")}`);
assert(
  !gaps.options.length,
  `Körkort B options without full French: ${gaps.options.slice(0, 6).join(", ")}`,
);
assert(
  !gaps.explanation.length,
  `Körkort B LÖSNING without French: ${gaps.explanation.slice(0, 6).join(", ")}`,
);

// 3. Swedish must never pass as French. The Manzi stems are the reference corpus.
const svLeaks = questions
  .map((question) => question.stem_sv)
  .filter((text) => text && !looksHybridFrench(text));
assert(!svLeaks.length, `${svLeaks.length} Swedish stems pass the hybrid detector`);
assert(
  looksHybridFrench("Bonne réponse : A — Du får inte parkera 20 meter före skylten."),
  "the generated «Bonne réponse … <svenska>» frame must be rejected",
);
assert(
  looksHybridFrench("Bonne réponse: B. Explication (SV): Slå upp sidan 10."),
  "the «Explication (SV)» frame must be rejected",
);
assert(
  !looksHybridFrench("Quelle route européenne relie notamment Stockholm, Örebro et Göteborg ?"),
  "Swedish place names inside real French must stay legal",
);
assert(
  !looksHybridFrench("En accélérant franchement, le moteur travaille à plus bas régime."),
  "a French gerund opening must stay legal",
);
assert(
  !looksHybridFrench("Du 1er octobre au 15 avril, les pneus cloutés sont autorisés."),
  "a French date range opening must stay legal",
);
assert(looksPlaceholderFrench(""), "empty French counts as missing");

// 4. The stem slot never carries the explanation — that would spoil the answer.
const withExplanationOnly = questions.find(
  (question) =>
    !translations[question.id]?.stem && !looksUnusableFrench(question.explanation_fr || ""),
);
if (withExplanationOnly) {
  const french = frenchFromStore(translations, withExplanationOnly);
  assert(
    !french.stem,
    `${withExplanationOnly.id}: explanation_fr leaked into the FR stem (answer spoiler)`,
  );
  assert(french.explanation, `${withExplanationOnly.id}: usable explanation_fr was dropped`);
}

// 5. The review helpers stay French-clean.
for (const question of questions) {
  const french = frenchFromStore(translations, question);
  const takeaway = takeawayFor(question, french.explanation);
  assert(
    !looksHybridFrench(takeaway.fr),
    `${question.id}: takeaway French carries Swedish — ${takeaway.fr.slice(0, 80)}`,
  );
  const distractors = distractorNote(question);
  if (distractors?.fr) {
    assert(
      !looksHybridFrench(distractors.fr),
      `${question.id}: distractor French carries Swedish — ${distractors.fr.slice(0, 80)}`,
    );
  }
}

const covered = questions.filter((question) => frenchFromStore(translations, question).stem).length;
const bCovered = bTrack.filter((question) => !SV_ONLY_B.has(question.id)).length;
console.log(
  `french-coverage.test OK · Körkort B ${bCovered}/${bTrack.length} stems + options + LÖSNING (${SV_ONLY_B.size} SV-only, no invented FR) · FR stems bank-wide ${covered}/${questions.length} · store ${Object.keys(translations).length} ids`,
);
