#!/usr/bin/env node
/** HTM facit recovery: real letter only, never invent. */
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractFacitLetter, idFromHtmPath, recoverHtmFacit } from "./recover-htm-bkort-facit.mjs";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const here = dirname(fileURLToPath(import.meta.url));
const fixture10 = join(here, "fixtures/manzi-drop/htm-bkort/10/exam.php.htm");
const fixture11 = join(here, "fixtures/manzi-drop/htm-bkort/11/exam.php.htm");

assert(idFromHtmPath(fixture10) === "BKORT-Q10", `idFromHtmPath 10 → ${idFromHtmPath(fixture10)}`);
assert(idFromHtmPath("/workspace/taxiprov/manzi/bkort-htm/3/exam.php.htm") === "BKORT-Q3", "bkort-htm/3");
assert(idFromHtmPath("T3/Taxi porove/körkort/körkortA/19/exam.php.htm") === "korkortA-19", "körkortA/19");
assert(idFromHtmPath("random/exam.php.htm") === null, "unmapped path stays null");

assert(extractFacitLetter(readFileSync(fixture10, "utf8")) === "C", "fixture 10 has Rätt svar: C");
assert(extractFacitLetter(readFileSync(fixture11, "utf8")) === null, "fixture 11 has no facit — must not invent");
assert(extractFacitLetter("") === null, "empty html");
assert(
  extractFacitLetter("Rätt svar: A … correctAnswer = B") === null,
  "conflicting letters must be refused",
);

const tmpJsonl = join(mkdtempSync(join(tmpdir(), "htm-bkort-")), "q.jsonl");
writeFileSync(
  tmpJsonl,
  [
    JSON.stringify({
      id: "BKORT-Q10",
      topic: "bkort",
      stem_sv: "Fixture stem — not a live exam key",
      options: [
        { letter: "A", text: "alpha" },
        { letter: "B", text: "beta" },
        { letter: "C", text: "gamma" },
        { letter: "D", text: "delta" },
      ],
      answer: "",
    }),
    JSON.stringify({
      id: "BKORT-Q11",
      topic: "bkort",
      stem_sv: "Fixture without facit",
      options: [
        { letter: "A", text: "alpha" },
        { letter: "B", text: "beta" },
      ],
      answer: "",
    }),
  ].join("\n") + "\n",
);
const result = recoverHtmFacit({
  dirs: [join(here, "fixtures/manzi-drop/htm-bkort")],
  jsonlPath: tmpJsonl,
});
const q10 = result.recovered.find((r) => r.id === "BKORT-Q10");
assert(q10?.answer === "C", "HTM «Rätt svar: C» must map onto the matching option letter");
assert(
  q10.options.some((o) => o.letter === "C" && o.text),
  "recovered letter must already exist among the row options",
);
assert(
  !result.recovered.some((r) => r.id === "BKORT-Q11"),
  "HTM without a facit letter must stay unanswered",
);

console.log(
  `htm-bkort-facit.test OK · mapped ids · refuse empty/conflict · fixture recovered ${result.recovered.length}`,
);
