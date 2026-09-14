#!/usr/bin/env node
/**
 * Compile research-bank.jsonl + Manzi questions.jsonl → data/questions.json.
 * Research is NEVER dropped when Manzi is larger.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  isManziShape,
  isResearchShape,
  normalizeManziRecord,
  normalizeResearchRecord,
  parseJsonl,
  sortForStudy,
  stemKey,
} from "./research-normalize.mjs";
import { RESEARCH_ITEMS } from "./research-items.mjs";
import {
  COORDINATOR_MANZI_IMAGES,
  COORDINATOR_MANZI_JSONL,
  attachAuthenticMedia,
} from "../lib/media/paths.mjs";
import { importMediaTree } from "./import-media.mjs";
import { buildLexicon } from "./build-lexicon.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function fail(message, issues = []) {
  console.error(`compile-banks: ${message}`);
  for (const issue of issues.slice(0, 30)) console.error(`  - ${issue}`);
  process.exit(1);
}

function readJsonl(rel) {
  const file = join(root, rel);
  if (!existsSync(file)) return { records: [], issues: [] };
  return parseJsonl(readFileSync(file, "utf8"));
}

function writeResearchSeed() {
  const dest = join(root, "data/research-bank.jsonl");
  if (existsSync(dest)) return;
  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(dest, RESEARCH_ITEMS.map((item) => JSON.stringify(item)).join("\n") + "\n");
}

function mergeTranslations(researchTranslations) {
  const dest = join(root, "data/translations.fr.json");
  let current = {};
  if (existsSync(dest)) current = JSON.parse(readFileSync(dest, "utf8"));
  for (const [id, value] of Object.entries(researchTranslations)) {
    if (!current[id]) current[id] = value;
  }
  writeFileSync(dest, `${JSON.stringify(current, null, 2)}\n`);
}

function mergeVocab() {
  const dir = join(root, "data/vocab");
  if (!existsSync(dir)) return [];
  const words = [];
  for (const name of readdirSync(dir).sort()) {
    if (!name.endsWith(".json")) continue;
    const session = JSON.parse(readFileSync(join(dir, name), "utf8"));
    for (const item of session.words || session) {
      if (item.sv && item.fr) words.push({ sv: item.sv, forms: item.forms, fr: item.fr });
    }
  }
  const dest = join(root, "data/hard-words.json");
  const existing = existsSync(dest) ? JSON.parse(readFileSync(dest, "utf8")) : [];
  const seen = new Set(existing.map((item) => item.sv.toLowerCase()));
  for (const word of words) {
    if (!seen.has(word.sv.toLowerCase())) {
      existing.push(word);
      seen.add(word.sv.toLowerCase());
    }
  }
  writeFileSync(dest, `${JSON.stringify(existing, null, 2)}\n`);
  return words;
}

export function compile({ check = false, images = null } = {}) {
  writeResearchSeed();
  const researchFile = readJsonl("data/research-bank.jsonl");
  const manziFile = readJsonl("data/questions.jsonl");
  const issues = [...researchFile.issues, ...manziFile.issues];
  const warnings = [];
  const questions = [];
  const translations = {};
  const seen = new Set();
  const seenStems = new Set();

  function take(result, { duplicateMessage } = {}) {
    issues.push(...(result.issues || []));
    warnings.push(...(result.warnings || []));
    if (!result.question) return;
    if (seen.has(result.question.id)) {
      warnings.push(duplicateMessage || `duplicate id ${result.question.id} (kept first)`);
      return;
    }
    const stem = stemKey(result.question.stem_sv);
    const researchCopy =
      result.question.corpus === "research" ||
      result.question.corpus === "owner-seed" ||
      String(result.question.id).startsWith("research-") ||
      String(result.question.id).startsWith("rs-");
    if (stem && seenStems.has(stem) && researchCopy) {
      warnings.push(`duplicate stem ${result.question.id} (kept first / research)`);
      return;
    }
    seen.add(result.question.id);
    if (stem && (result.question.corpus === "research" || result.question.corpus === "owner-seed")) {
      seenStems.add(stem);
    }
    questions.push(result.question);
    if (result.translation) translations[result.question.id] = result.translation;
  }

  researchFile.records.forEach((record, index) => {
    const result = isResearchShape(record)
      ? normalizeResearchRecord(record, index)
      : normalizeManziRecord({ ...record, corpus: record.corpus || "research" }, index);
    take(result, { duplicateMessage: `duplicate id ${record.id} (kept first / research)` });
  });

  manziFile.records.forEach((record, index) => {
    if (isResearchShape(record) && !isManziShape(record)) {
      take(normalizeResearchRecord(record, index), {
        duplicateMessage: `Manzi research-shape ${record.id} skipped — already compiled`,
      });
      return;
    }
    if (String(record.id || "").startsWith("research-")) {
      return;
    }
    take(normalizeManziRecord(record, index), {
      duplicateMessage: `Manzi id ${record.id} skipped — research already owns this id`,
    });
  });

  if (issues.length) fail("validation failed", issues);
  if (warnings.length) {
    console.warn(`compile-banks: ${warnings.length} skipped/incomplete records (not fatal)`);
    for (const warning of warnings.slice(0, 12)) console.warn(`  - ${warning}`);
    if (warnings.length > 12) console.warn(`  … ${warnings.length - 12} more`);
  }

  let authentic = attachAuthenticMedia(questions);
  if (images) {
    const imported = importMediaTree({ imagesDir: images, questions: authentic });
    authentic = attachAuthenticMedia(imported.questions);
    console.log(
      `media: ${imported.report.rastersCopied} rasters copied, ${imported.report.questionsLinkedToFile} Q linked, ${imported.report.questionsMissingFile} missing, gul-linje ${imported.report.gulLinje || "no image"}`,
    );
  }

  const ordered = sortForStudy(authentic);
  const researchCount = ordered.filter((item) => item.corpus === "research").length;
  const ownerCount = ordered.filter((item) => item.corpus === "owner-seed").length;
  const manziCount = ordered.filter((item) => item.corpus === "manzi").length;

  if (researchFile.records.length && researchCount === 0) {
    fail("research-bank.jsonl is present but compiled 0 research items — research must not be dropped");
  }
  if (manziFile.records.length && manziCount === 0) {
    fail("questions.jsonl is present but compiled 0 Manzi items");
  }
  if (!researchCount) {
    fail("compiled bank has no research items — import data/research-bank.jsonl alongside Manzi");
  }

  if (check) {
    console.log(
      `OK compile ${ordered.length} (research ${researchCount} + owner-seed ${ownerCount} + manzi ${manziCount})`,
    );
    return ordered;
  }

  writeFileSync(join(root, "data/questions.json"), `${JSON.stringify(ordered, null, 2)}\n`);
  mergeTranslations(translations);
  const vocab = mergeVocab();
  if (!images) {
    const withUrl = ordered.filter((item) => item.imageUrl);
    let manifestFiles = 0;
    const manifestPath = join(root, "data/media-manifest.json");
    if (existsSync(manifestPath)) {
      try {
        manifestFiles = Object.keys(JSON.parse(readFileSync(manifestPath, "utf8")).files || {}).length;
      } catch {
        manifestFiles = 0;
      }
    }
    writeFileSync(
      join(root, "data/media-report.json"),
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          imagesDir: null,
          questionsTotal: ordered.length,
          researchCount,
          ownerCount,
          manziCount,
          researchJsonl: researchFile.records.length,
          manziJsonl: manziFile.records.length,
          skippedIncomplete: warnings.length,
          questionsWithImageUrl: withUrl.length,
          rastersCopied: 0,
          questionsLinkedToFile: withUrl.length,
          questionsMissingFile: 0,
          manifestFiles,
          gulLinje: ordered.find((item) => item.id === "rs-yt-lag1-gul-linje")?.imageUrl ?? null,
          coordinator: {
            questions: COORDINATOR_MANZI_JSONL,
            images: COORDINATOR_MANZI_IMAGES,
            expectedQuestions: 1668,
            expectedImages: 2877,
          },
          note: "No --images this run. Exam rasters resolve from data/media-manifest.json + private Vercel Blob. Do not invent SVGs.",
        },
        null,
        2,
      )}\n`,
    );
  }

  const extras = [];
  const yt = join(root, "data/youtube-links.json");
  if (existsSync(yt)) extras.push(...JSON.parse(readFileSync(yt, "utf8")).videos || []);
  const notesDir = join(root, "data/youtube-transcripts");
  const ragExtras = [];
  if (existsSync(notesDir)) {
    for (const name of readdirSync(notesDir).filter((file) => file.endsWith(".json")).sort()) {
      ragExtras.push(JSON.parse(readFileSync(join(notesDir, name), "utf8")));
    }
  }
  const appsReport = join(root, "docs/apps-report.md");
  if (existsSync(appsReport)) {
    ragExtras.push({
      id: "apps-report",
      title: "Competitor / research coverage (Lionel)",
      source: "docs/apps-report.md",
      topic: "lagstiftning",
      text_sv: readFileSync(appsReport, "utf8"),
      text_fr:
        "Couverture produit des sources YouTube / Teori Taxi / TaxiKortet / TaxiTeori / Trafikverket. Pas un scrape de leurs banques payantes. Körklart commence par les pièges haute fréquence (vilotid 11/8, taxameter 24 mois, ligne jaune, tidbok, prisräkning) puis Manzi.",
    });
  }
  writeFileSync(join(root, "data/rag-extras.json"), `${JSON.stringify(ragExtras, null, 2)}\n`);

  const lexicon = buildLexicon({ silent: true });
  console.log(
    `Compiled ${ordered.length} questions → data/questions.json (research ${researchCount} first, owner-seed ${ownerCount}, manzi ${manziCount}). Vocab merged ${vocab.length}. YouTube extras ${extras.length}. Gloss ${lexicon.uniqueHits}/${lexicon.uniqueBankTokens} (${lexicon.uniqueCoveragePct}%).`,
  );
  console.log("Research was not dropped. Swedish research `sv` / Manzi stems copied verbatim.");
  return ordered;
}

function parseArgs(argv) {
  const args = { check: false, images: null, manzi: null, research: null, coordinator: false };
  const rest = [...argv];
  while (rest.length) {
    const token = rest.shift();
    if (token === "--check") args.check = true;
    else if (token === "--coordinator") args.coordinator = true;
    else if (token === "--images") args.images = rest.shift();
    else if (token === "--manzi") args.manzi = rest.shift();
    else if (token === "--research") args.research = rest.shift();
  }
  if (args.coordinator) {
    args.manzi = args.manzi || COORDINATOR_MANZI_JSONL;
    args.images = args.images || COORDINATOR_MANZI_IMAGES;
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.manzi) {
    const from = resolve(args.manzi);
    if (!existsSync(from)) fail(`Manzi file not found: ${from}`);
    copyFileSync(from, join(root, "data/questions.jsonl"));
    console.log(`Copied Manzi → data/questions.jsonl (research-bank untouched)`);
  }
  if (args.research) {
    const from = resolve(args.research);
    if (!existsSync(from)) fail(`research file not found: ${from}`);
    copyFileSync(from, join(root, "data/research-bank.jsonl"));
    console.log(`Copied research → data/research-bank.jsonl (Manzi untouched)`);
  }
  let images = args.images ? resolve(args.images) : null;
  if (images && !existsSync(images)) fail(`Images dir not found: ${images}`);
  if (!images && existsSync(COORDINATOR_MANZI_IMAGES)) {
    console.log(
      `Hint: coordinator images exist at ${COORDINATOR_MANZI_IMAGES} — re-run with --coordinator to import all rasters.`,
    );
  }
  compile({ check: args.check, images });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
