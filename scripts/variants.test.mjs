#!/usr/bin/env node
import {
  conceptIdFor,
  findSiblings,
  paraphraseStem,
  pickVariantForm,
  presentConcept,
  scenarioStem,
} from "../lib/questions/variants.mjs";
import { displayFrench, distractorNote, takeawayFor } from "../lib/questions/review.mjs";
import { MISSING_FRENCH_STEM, looksPlaceholderFrench } from "../lib/questions/french.mjs";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const q19 = {
  id: "S_KERHET-7-Q19",
  topic: "sakerhet",
  stem_sv: "Du ska köra 1-3 personer på en söndag. Vilken tariff ska du använda?",
  options: [
    { letter: "A", text: "Tariff 1" },
    { letter: "B", text: "Tariff 31" },
    { letter: "C", text: "Tariff 13" },
    { letter: "D", text: "Tariff 2" },
  ],
  answer: "B",
  explanation_sv: "Rätt svar: B — Tariff 31",
  explanation_fr: "Bonne réponse: B — « Tariff 31 »",
  imageUrl: "/media/pdf-pages/S_KERHET-7/page-19.jpg",
  trap: "Tariff 1",
};

assert(conceptIdFor(q19) === "S_KERHET-7-Q19", "concept id defaults to question id");
assert(
  paraphraseStem(q19.stem_sv) !== q19.stem_sv,
  "paraphrase must change wording",
);
assert(scenarioStem(q19.stem_sv).includes("två personer"), "1-3 may restated as två");
assert(!scenarioStem(q19.stem_sv).includes("lördag"), "must not flip Sunday to Saturday");

const presented = presentConcept(q19, [q19], "original");
assert(presented.answer === "B", "variant keeps the answer key");
assert(presented.form !== "original", "first miss uses a non-original form");
assert(presented.conceptId === "S_KERHET-7-Q19", "variant stays on the same concept");
assert(presentConcept(q19, [q19], presented.form).form !== presented.form, "next form rotates");

const sibling = {
  ...q19,
  id: "S_KERHET-8-Q12",
  stem_sv: "Du ska köra 1-3 personer på en söndag i Stockholm. Vilken tariff gäller?",
};
assert(findSiblings(q19, [q19, sibling]).some((item) => item.id === sibling.id), "sibling same fact");
assert(pickVariantForm(q19, "original", [q19, sibling]) === "sibling", "prefer authentic sibling");

const takeaway = takeawayFor(q19);
assert(/Tariff 31/.test(takeaway.sv) && /Tariff 31/.test(takeaway.fr), "takeaway keeps the hinge");
assert(distractorNote(q19)?.sv.includes("Tariff 1"), "trap becomes why-others");
assert(looksPlaceholderFrench("Traduction française à ajouter dans data/translations.fr.json"));
assert(displayFrench("Traduction française à ajouter dans data/x") === MISSING_FRENCH_STEM);
assert(!looksPlaceholderFrench("Tu dois transporter 1 à 3 personnes un dimanche."));

console.log("variants.test OK");
