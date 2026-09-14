#!/usr/bin/env node
/**
 * One-shot / idempotent cleanup: Swedish exam fields on research / mined items.
 * Never rewrites Manzi stems. French coaching notes leave trap/options.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  coerceTrap,
  letterFromAnswer,
  looksFrenchExamLeak,
  splitSvAlts,
} from "./research-normalize.mjs";

const LETTERS = new Set(["A", "B", "C", "D", "E", "F"]);

const EXPLANATION_SV = {
  "research-0016":
    "Fast pris registreras när köruppdraget påbörjas. Källa: teori-taxi.com",
  "research-0030":
    "Kvitto eller följesedel ska skrivas ut efter alla körningar. Källa: teori-taxi.com",
  "research-0034":
    "Kontroll- och plomberingsrapporten ska förvaras i fordonet. Källa: teori-taxi.com",
  "research-0037":
    "Vid skolskjuts ansvarar föraren för att ett 14-årigt barn använder bilbälte. Källa: teori-taxi.com",
  "research-0049":
    "Anteckna den närmast föregående dygnsvilan innan körpasset. Källa: teori-taxi.com + SFS 1994:1297",
  "research-0059":
    "Mönsterdjupet påverkar risken för vattenplaning mest. Källa: teori-taxi.com",
  "research-0121":
    "55 + (8×23) + (12×7) = 323 kr. Vanlig fälla: 184 kr (bara kilometerna). Källa: taxikortet.se",
};

const TRAP_SV = {
  "research-0014": "24 månader",
  "research-0032": "Vartannat år / två år",
  "research-0121": "184",
  "research-0131": "Tillåtet att stanna för avlämning",
};

const ANSWER_FIX = {
  // Same official QCM as the YouTube/TS seed — scrape stored the trap as the key.
  "research-0014": "C",
  "research-0032": "B",
};

const DROP_ANSWER = new Set(["research-0125"]);

function hasEmbeddedAlts(record) {
  return typeof record.sv === "string" && /\|\s*Alt:/.test(record.sv);
}

function optionList(record) {
  if (hasEmbeddedAlts(record)) return splitSvAlts(record.sv).options;
  return Array.isArray(record.options) ? record.options.filter((option) => option?.text) : [];
}

function appendFrenchNote(record, text) {
  if (!text || !looksFrenchExamLeak(text)) return;
  const current = typeof record.explanation_fr === "string" ? record.explanation_fr.trim() : "";
  if (current.includes(text)) return;
  record.explanation_fr = current ? `${current} ${text}` : text;
}

function cleanResearchRecord(record) {
  const id = record.id;
  const frenchTrap = coerceTrap(record.trap);
  const options = optionList(record);

  if (ANSWER_FIX[id]) {
    record.answer = ANSWER_FIX[id];
  }
  if (DROP_ANSWER.has(id)) {
    delete record.answer;
  }

  if (TRAP_SV[id]) {
    record.trap = TRAP_SV[id];
  } else if (frenchTrap && looksFrenchExamLeak(frenchTrap)) {
    appendFrenchNote(record, frenchTrap);
    const answerLetter = letterFromAnswer(record.answer, options);
    const wrong = options.find((option) => option.letter !== answerLetter && option.text);
    if (answerLetter && wrong && !looksFrenchExamLeak(wrong.text)) {
      record.trap = wrong.text;
    } else {
      delete record.trap;
    }
  }

  if (EXPLANATION_SV[id]) {
    record.explanation_sv = EXPLANATION_SV[id];
  }

  if (id === "research-0014") {
    record.explanation_sv =
      "Besiktning senast ett år efter installationen eller senaste besiktningen — inte 24 månader. Källa: Taxitrafikförordningen 5 kap. 3 §";
  }
  if (id === "research-0032") {
    record.explanation_sv =
      "Taxametern besiktas varje år, senast ett år efter föregående taxameterbesiktning. Källa: youtube:QD8ute2KywU+teori-taxi.com";
  }
  if (id === "research-0131") {
    record.explanation_sv =
      "Gul heldragen linje vid trottoarkant = stannande- och parkeringsförbud. Källa: youtube:BFwxXv3hujU";
  }

  const usable = options.filter((option) => option.text && !looksFrenchExamLeak(option.text));
  const fakeQcm =
    record.type !== "qcm" &&
    record.type !== "term" &&
    !hasEmbeddedAlts(record) &&
    usable.length < 2;

  if (fakeQcm) {
    record.type = "term";
    record.options = [];
    if (DROP_ANSWER.has(id)) {
      record.explanation_sv =
        "Taxameterbesiktning är inte fordonets kontrollbesiktning. Se den årliga 12-månadersregeln. Källa: taxikortet.se + Transportstyrelsen";
    } else if (
      typeof record.answer === "string" &&
      record.answer.trim() &&
      !LETTERS.has(record.answer) &&
      !looksFrenchExamLeak(record.answer) &&
      !record.explanation_sv
    ) {
      record.explanation_sv = `${record.answer.trim()}. Källa: ${record.source || "research"}`;
    }
    if (frenchTrap) appendFrenchNote(record, frenchTrap);
    delete record.trap;
  }

  if (record.type === "term" && record.trap) {
    appendFrenchNote(record, record.trap);
    delete record.trap;
  }

  return record;
}

function rewriteJsonl(rel, { researchOnly }) {
  const path = resolve(rel);
  const lines = readFileSync(path, "utf8").split(/\n/);
  let changed = 0;
  const out = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return line;
    const record = JSON.parse(trimmed);
    if (researchOnly && !String(record.id || "").startsWith("research-")) return line;
    const before = JSON.stringify(record);
    const next = cleanResearchRecord(record);
    const after = JSON.stringify(next);
    if (before !== after) changed += 1;
    return after;
  });
  writeFileSync(path, `${out.filter((line) => line !== undefined).join("\n").replace(/\n+$/, "")}\n`);
  return changed;
}

const researchChanged = rewriteJsonl("data/research-bank.jsonl", { researchOnly: false });
const manziChanged = rewriteJsonl("data/questions.jsonl", { researchOnly: true });
console.log(`sanitize-research-sv: research-bank ${researchChanged} records, questions.jsonl research-* ${manziChanged} records`);
