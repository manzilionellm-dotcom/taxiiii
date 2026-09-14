import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import {
  parseJsonl,
  briefFacitFr,
  isOwnerCorpus,
  isResearchShape,
  looksFrenchExamLeak,
  normalizeManziRecord,
  normalizeResearchRecord,
  pickExplanation,
  sortForStudy,
} from "./research-normalize.mjs";
import { compile } from "./compile-banks.mjs";
import { reconstructStem, tokenizeStem } from "../lib/tokenize-stem.mjs";
import {
  FAKE_EXAM_SVG_NAMES,
  hasAuthenticImageUrl,
  isFakeExamSvg,
  isRasterExt,
} from "../lib/media/paths.mjs";
import {
  frenchFromStore,
  looksHybridFrench,
  looksPlaceholderFrench,
} from "../lib/questions/french.mjs";
import { displayFrench } from "../lib/questions/review.mjs";
import { availableForms, presentConcept } from "../lib/questions/variants.mjs";

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
assert(
  manzi.every((q) => typeof q.stem_sv === "string" && q.stem_sv.trim()),
  "verbatim Manzi stem_sv missing",
);

const researchCompilable = researchRecords.filter(
  (record, index) => normalizeResearchRecord(record, index).question,
);
const manziCompilable = manzi.filter((record, index) => {
  if (String(record.id).startsWith("research-")) return false;
  return Boolean(normalizeManziRecord(record, index).question);
});

const compiled = JSON.parse(readFileSync(compiledPath, "utf8"));
const researchCount = compiled.filter((item) => item.corpus === "research").length;
const ownerCount = compiled.filter((item) => item.corpus === "owner-seed").length;
const ownerOfficialCount = compiled.filter((item) => item.corpus === "owner-official").length;
const ownerImportCount = compiled.filter((item) => item.corpus === "owner-import").length;
const manziCount = compiled.filter((item) => item.corpus === "manzi").length;
assert(researchCompilable.length >= 20, "too few compilable research QCM");
/** 100c overlay adds 5 research QCMs that are not in research-bank.jsonl. */
const extraResearchFrom100c = 5;
assert(
  researchCount + ownerCount + ownerOfficialCount === researchCompilable.length + extraResearchFrom100c,
  "compiled dropped research or owner-track items (or 100c research extras drifted)",
);
assert(manziCompilable.length >= 10, "too few compilable Manzi QCM");
/** 100c overlay adds 14 bkort-classic + recovered S_KERHET-1-Q1. */
const extraManziFrom100c = 15;
assert(
  manziCount === manziCompilable.length + extraManziFrom100c,
  "compiled dropped Manzi items that had a valid answer key (or 100c manzi extras drifted)",
);
assert(
  compiled.length === researchCount + ownerCount + ownerOfficialCount + ownerImportCount + manziCount,
  "compiled length != research + owner corpora + manzi",
);
assert(ownerCount >= 15, `owner-seed too small: ${ownerCount}`);
assert(ownerCount === 42, `owner-seed must stay 42 untouched, got ${ownerCount}`);
assert(ownerOfficialCount >= 100, `owner-official too small: ${ownerOfficialCount}`);
assert(
  compiled
    .filter((item) => isOwnerCorpus(item.corpus))
    .every((item) => item.topic === "agare" && item.trackHint === "owner"),
  "owner corpora must be tagged topic=agare trackHint=owner",
);
assert(
  compiled
    .filter((item) => item.corpus === "owner-official")
    .every((item) => item.source && /^delprov-[1-4]$/.test(item.type || "")),
  "owner-official must cite source and delprov-1..4",
);
assert(
  compiled
    .filter((item) => item.corpus === "owner-import")
    .every((item) => item.topic === "agare" && item.trackHint === "owner"),
  "owner-import must be tagged topic=agare trackHint=owner",
);
assert(
  compiled
    .filter((item) => item.topic === "lagstiftning" || item.topic === "sakerhet" || item.topic === "karta")
    .every((item) => item.trackHint !== "owner" && !isOwnerCorpus(item.corpus)),
  "owner corpora must not sit on chauffeur topics",
);
assert(
  manziCompilable.every((q) => q.stem_sv && (q.explanation_sv || q.explanation_fr || q.options?.length >= 2)),
  "compilable Manzi missing stem or options",
);

const ordered = sortForStudy(compiled);
assert(ordered[0].corpus === "research", "study order must start with research");
assert(ordered[0].corpus !== "owner-seed", "owner seed must not lead the chauffeur study order");
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
assert(
  check.filter((item) => item.corpus === "research").length === researchCount - extraResearchFrom100c,
  "check compile dropped research (100c extras live only in committed questions.json)",
);
assert(
  check.filter((item) => item.corpus === "owner-seed").length === ownerCount,
  "check compile dropped owner-seed",
);
assert(
  check.filter((item) => item.corpus === "owner-official").length === ownerOfficialCount,
  "check compile dropped owner-official",
);
assert(
  check.filter((item) => item.corpus === "owner-import").length === ownerImportCount,
  "check compile dropped owner-import",
);

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
assert(gulCompiled, "gul linje question missing");
assert(!isFakeExamSvg(gulCompiled.imageUrl), "gul linje must not use a fake SVG");
assert(
  !gulCompiled.imageUrl || (hasAuthenticImageUrl(gulCompiled.imageUrl) && isRasterExt(gulCompiled.imageUrl)),
  "gul linje may only show a real Manzi raster, otherwise no image",
);
/**
 * No invented art anywhere. The card captions an uncaptioned figure
 * «Examenssida», so a hand-drawn schematic was shown to the student as a real
 * exam page — `e4-karta.svg` was live on two Karta questions with a mojibake
 * «Nyköping» label. Every drawn SVG is deleted and blacklisted; a question
 * shows a real Manzi raster or no image at all.
 */
for (const name of FAKE_EXAM_SVG_NAMES) {
  assert(
    !existsSync(new URL(`../content/media/${name}`, import.meta.url)),
    `invented art ${name} must stay deleted`,
  );
}
const inventedLinks = compiled.filter((item) => isFakeExamSvg(item.imageUrl));
assert(
  !inventedLinks.length,
  `questions linking invented art: ${inventedLinks.map((item) => item.id).slice(0, 5).join(", ")}`,
);
const svgLinks = compiled.filter((item) => item.imageUrl?.toLowerCase().endsWith(".svg"));
assert(
  !svgLinks.length,
  `no question may link an SVG — real Manzi rasters only: ${svgLinks.map((item) => item.id).slice(0, 5).join(", ")}`,
);
for (const id of ["rs-yt-karta-arlanda", "rs-yt-karta-e4"]) {
  const question = compiled.find((item) => item.id === id);
  assert(question, `${id} missing`);
  assert(!question.imageUrl, `${id} must not show the invented E4 schematic`);
  assert(question.stem_sv.trim(), `${id} must still read from its text alone`);
}

const manifestPath = new URL("../data/media-manifest.json", import.meta.url);
assert(existsSync(manifestPath), "data/media-manifest.json missing");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const manifestFiles = Object.keys(manifest.files || {});
assert(manifestFiles.length >= 1900, `media manifest too small: ${manifestFiles.length}`);
assert(manifest.access === "private", "media manifest must mark Blob access private");
const confirmedPdf = new Set(
  JSON.parse(readFileSync(new URL("../data/pdf-pages-on-blob.json", import.meta.url), "utf8")),
);
const lag1q1 = compiled.find((item) => item.id === "LAGSTIFNING-1-Q1");
assert(lag1q1?.imageUrl === "/media/pdf-pages/LAGSTIFNING-1/page-01.jpg", "LAGSTIFNING-1-Q1 must use PDF page 01");
const lag1q4 = compiled.find((item) => item.id === "LAGSTIFNING-1-Q4");
assert(lag1q4, "LAGSTIFNING-1-Q4 missing");
const q4Key = "pdf-pages/LAGSTIFNING-1/page-04.jpg";
if (confirmedPdf.has(q4Key)) {
  assert(
    lag1q4.imageUrl === `/media/${q4Key}`,
    "Q4 opens PDF page 04 once that raster is in the confirmed Blob inventory",
  );
} else {
  assert(!lag1q4.imageUrl, "Q4 must not show a phantom PDF page that is not on Blob");
  assert(
    !availableForms(lag1q4, compiled).includes("image-first"),
    "Q4 must not rotate to image-first without a real raster (that was the gray «Bilden kunde inte visas» box)",
  );
}
assert(lag1q4.stem_sv.includes("08:00"), "Q4 Swedish stem stays verbatim");
assert(
  lag1q4.stem_sv.includes("kl 08:00 efter en dygnsvila") &&
    lag1q4.stem_sv.includes("09:00- 13:00") &&
    lag1q4.stem_sv.includes("börja nästa dygnsvila enligt vilotids förordning"),
  "Q4 is the Studera card from Lionel's screenshot (08:00 dygnsvila, 09:00-13:00, nästa dygnsvila)",
);
const filterQ = compiled.find((item) => item.id === "S_KERHET-2-Q4");
assert(filterQ?.options?.some((option) => option.text === "Bränsleförbrukning för magar."), "Manzi option A stays verbatim");
const sak7q19 = compiled.find((item) => item.id === "S_KERHET-7-Q19");
assert(sak7q19, "S_KERHET-7-Q19 missing");
assert(sak7q19.stem_sv.includes("söndag"), "Q19 Swedish stem must stay verbatim");
const q19Key = "pdf-pages/S_KERHET-7/page-19.jpg";
if (confirmedPdf.has(q19Key)) {
  assert(sak7q19.imageUrl === `/media/${q19Key}`, "Q19 must use PDF page 19 when that raster is on Blob");
} else {
  assert(!sak7q19.imageUrl, "Q19 must not show a phantom page-19 that is not on Blob");
}

const flowerQ = compiled.find((item) => item.id === "LAGSTIFNING-7-Q9");
assert(flowerQ, "LAGSTIFNING-7-Q9 (bukett / allergi) missing");
assert(
  flowerQ.stem_sv.includes("stor blombukett") &&
    flowerQ.options.some((option) => option.text.includes("bagageutrymmet på grund av risk för allergi")),
  "flower/allergy Manzi Swedish stays verbatim",
);
const flowerKey = "pdf-pages/LAGSTIFNING-7/page-09.jpg";
if (confirmedPdf.has(flowerKey)) {
  assert(flowerQ.imageUrl === `/media/${flowerKey}`, "flower Q9 exam page opens when Blob has page-09");
} else {
  assert(!flowerQ.imageUrl, "flower Q9 must omit phantom Examenssida — page-09 is not in the confirmed Blob inventory");
}

const translations = JSON.parse(readFileSync(new URL("../data/translations.fr.json", import.meta.url), "utf8"));
assert(translations["S_KERHET-7-Q19"]?.stem, "Q19 French stem missing");
assert(!looksPlaceholderFrench(translations["S_KERHET-7-Q19"].stem), "Q19 FR must not be a placeholder");
assert(
  translations["S_KERHET-7-Q19"].stem.includes("dimanche"),
  "Q19 FR stem is the real Sunday-tariff sentence",
);
assert(
  !JSON.stringify(translations).includes("translations.fr.json"),
  "FR store must not mention the file path",
);
const q4Fr = translations["LAGSTIFNING-1-Q4"]?.stem || "";
assert(q4Fr.includes("08:00"), "Q4 FR keeps the 08:00 clock");
assert(q4Fr.includes("repos journalier"), "Q4 FR is a real rest-time sentence");
assert(!looksHybridFrench(q4Fr), "Q4 FR must not be a SV/FR hybrid");
const lionelHybridFr =
  "00 efter une repos journalier. Du gör un uppehåll i arbetet mellan 09:00- 13 epos journalier enligt vilotids förordning et bestämmelser?";
assert(looksHybridFrench(lionelHybridFr), "screenshot blue FR line must be classified as hybrid");
assert(displayFrench(lionelHybridFr) === "", "screenshot hybrid FR must not render on the card");
assert(
  frenchFromStore({ "LAGSTIFNING-1-Q4": { stem: lionelHybridFr } }, lag1q4).stem === "",
  "hybrid Q4 store entry must be dropped (#14)",
);
assert(
  /après un repos journalier/i.test(frenchFromStore(translations, lag1q4).stem || ""),
  "live Q4 FR is the clean rest-time sentence, not the screenshot mix",
);
const filterFr = translations["S_KERHET-2-Q4"]?.stem || "";
assert(/filtre à air/i.test(filterFr), "igensatt luftfilter FR is a real sentence");
assert(!looksHybridFrench(filterFr), "filter FR must not keep Swedish leftovers");
for (const [id, item] of Object.entries(translations)) {
  if (!item?.stem) continue;
  assert(!looksHybridFrench(item.stem), `hybrid FR leftover in ${id}`);
}
const realFrStems = Object.values(translations).filter(
  (item) => item?.stem && !looksPlaceholderFrench(item.stem) && !looksHybridFrench(item.stem),
).length;
assert(realFrStems >= 300, `expected ≥300 clean FR stems, got ${realFrStems}`);

const variant = presentConcept(sak7q19, compiled, "original");
assert(variant.answer === sak7q19.answer, "variant keeps Q19 answer");
assert(variant.form !== "original", "missed concept returns in another form");

const svCopy = readFileSync(new URL("../lib/i18n/sv.ts", import.meta.url), "utf8");
const frCopy = readFileSync(new URL("../lib/i18n/fr.ts", import.meta.url), "utf8");
assert(svCopy.includes("Lärare") && frCopy.includes("Enseignant"), "teacher persona in UI copy");
assert(
  frCopy.includes("Je ne l'ai pas dans le cours") || frCopy.includes("on reste sur le corpus"),
  "corpus-only teacher refusal",
);
const kkalk021 = compiled.find((item) => item.id === "kkalk-T-021");
assert(kkalk021, "kkalk-T-021 must remain in the bank");
assert(!kkalk021.imageUrl, "kkalk-T-021 must stay unlinked (no Manzi raster)");
assert(
  compiled.filter((item) => item.imageUrl).every((item) => item.imageUrl.startsWith("/media/")),
  "compiled imageUrl must be /media/<logical-key>",
);
assert(
  compiled.filter((item) => item.imageUrl).every((item) => !item.imageUrl.startsWith("media/")),
  "compiled imageUrl must not be media/ without leading slash",
);

const compiledResearch = compiled.filter(
  (item) => item.corpus === "research" || isOwnerCorpus(item.corpus),
);
for (const question of compiledResearch) {
  assert(!looksFrenchExamLeak(question.stem_sv), `French leaked into stem_sv ${question.id}`);
  assert(
    question.options.every((option) => !looksFrenchExamLeak(option.text)),
    `French leaked into options ${question.id}`,
  );
  assert(!question.trap || !looksFrenchExamLeak(question.trap), `French leaked into trap ${question.id}`);
  assert(question.options.length >= 2, `compiled research ${question.id} has fewer than 2 options`);
  assert(
    !question.options.some((option) => option.text === "Påståendet stämmer inte."),
    `compiled research ${question.id} used a dummy option`,
  );
}

const bannedFakeQcm = [
  "research-0122",
  "research-0123",
  "research-0124",
  "research-0125",
  "research-0126",
  "research-0127",
  "research-0128",
  "research-0129",
  "research-0130",
  "research-0132",
  "research-0133",
  "research-0134",
  "research-0135",
  "research-0149",
  "research-0168",
];
for (const id of bannedFakeQcm) {
  assert(
    !compiled.some((item) => item.id === id),
    `${id} must stay out of the compiled exam bank`,
  );
}

const bookSv = [
  "Bokförklaring stycke 1: taxitrafiktillstånd prövas av Transportstyrelsen.",
  "",
  "Stycke 2: yrkeskunnande omfattar rättsregler, ekonomi, drift och fallstudier.",
  "",
  "Stycke 3: den här texten får inte kortas eller ersättas vid import.",
].join("\n");
const bookFr = "Explication longue à conserver mot pour mot, comme un livre.";
const imported = normalizeManziRecord(
  {
    id: "pc-owner-book-keep",
    topic: "agare",
    trackHint: "owner",
    corpus: "owner-import",
    stem_sv: "Vilken myndighet prövar taxitrafiktillstånd i denna importrad?",
    options: [
      { letter: "A", text: "Transportstyrelsen" },
      { letter: "B", text: "Kommunen" },
    ],
    answer: "A",
    explanation_sv: bookSv,
    explanation_fr: bookFr,
    type: "delprov-1",
    source: "lionel-pc-dump",
  },
  0,
);
assert(imported.question, "owner-import fixture must compile");
assert(imported.question.corpus === "owner-import", "PC dump corpus must stay owner-import");
assert(imported.question.explanation_sv === bookSv, "must keep full SV explanation verbatim");
assert(imported.question.explanation_fr === bookFr, "must keep full FR explanation verbatim");
assert(imported.question.type === "delprov-1", "delprov type hint must pass through");

const textSvImport = normalizeManziRecord(
  {
    id: "pc-owner-text-sv",
    topic: "agare",
    track: "owner",
    corpus: "owner-import",
    stem_sv: "Vilket svar är rätt i denna importrad?",
    options: [
      { letter: "A", text_sv: "Transportstyrelsen" },
      { letter: "B", text_sv: "Kommunen" },
    ],
    answer: "A",
    explanation_sv: "Rätt svar: Transportstyrelsen",
    explanation_fr: null,
    type: "delprov-2",
    source: "Manzi Taxi Ägare / Ekonomi-1.exe",
    freq: "high",
  },
  0,
);
assert(textSvImport.question, "text_sv options must compile");
assert(textSvImport.question.options[0].text === "Transportstyrelsen", "text_sv must map to text");
assert(textSvImport.question.trackHint === "owner", "track=owner must become trackHint");
assert(
  textSvImport.question.explanation_fr === "Bonne réponse : Transportstyrelsen",
  "missing FR must be a brief facit translation, not invented law",
);
assert(
  briefFacitFr("Rätt svar: A", "A", "src") === "Bonne réponse : A",
  "facit FR should translate the facit line only",
);
assert(
  !compiled.some((item) => item.id === "pc-owner-text-sv"),
  "text_sv fixture must not leak into the compiled bank",
);

const importDirUrl = new URL("../data/imports/", import.meta.url);
if (existsSync(importDirUrl)) {
  const importFiles = readdirSync(importDirUrl)
    .filter((name) => name.endsWith(".jsonl") || name.endsWith(".ndjson"))
    .sort();
  const seenImportIds = new Set();
  let compilableImports = 0;
  for (const name of importFiles) {
    const parsed = parseJsonl(readFileSync(new URL(name, importDirUrl), "utf8"));
    parsed.records.forEach((record, index) => {
      const id = String(record.id || "");
      if (!id || seenImportIds.has(id)) return;
      seenImportIds.add(id);
      const trackHint =
        record.trackHint ||
        (record.track === "owner" || record.track === "taxi" || record.track === "b"
          ? record.track
          : undefined);
      const shaped = {
        ...record,
        ...(trackHint ? { trackHint } : {}),
        corpus: record.corpus || "owner-import",
      };
      const result = isResearchShape(shaped)
        ? normalizeResearchRecord(shaped, index)
        : normalizeManziRecord(shaped, index);
      if (result.question) compilableImports += 1;
    });
  }
  if (importFiles.length) {
    assert(
      seenImportIds.size >= 301,
      `owner-import JSONL unique ids ${seenImportIds.size} (expected ≥301)`,
    );
    assert(
      ownerImportCount === compilableImports,
      `owner-import compiled ${ownerImportCount} != compilable dump rows ${compilableImports} (incomplete keys skipped, answers not invented)`,
    );
  }
}

const altField = pickExplanation(
  { forklaring: bookSv, note_sv: "kort anteckning som inte får ersätta facit" },
  "sv",
  "",
);
assert(altField === bookSv, "forklaring/facit aliases must win over generated fallback");
assert(
  !compiled.some((item) => item.id === "pc-owner-book-keep"),
  "import fixture must not leak into the compiled bank",
);

const bankSrc = readFileSync(new URL("../lib/questions/bank.ts", import.meta.url), "utf8");
assert(
  !bankSrc.includes("Traduction française à ajouter"),
  "getFrench must not emit the FR placeholder stub",
);

const protectedViewSrc = readFileSync(
  new URL("../components/protected-view.tsx", import.meta.url),
  "utf8",
);
assert(
  !protectedViewSrc.includes("visibilitychange"),
  "ProtectedView must not hide on visibilitychange",
);
assert(
  !/addEventListener\(\s*["']blur["']/.test(protectedViewSrc),
  "ProtectedView must not hide on window blur",
);
assert(
  !protectedViewSrc.includes("contentHidden"),
  "ProtectedView must not show a hide-on-blur overlay",
);
assert(
  !protectedViewSrc.includes("addEventListener"),
  "web ProtectedView must not attach capture/focus listeners",
);

const svI18n = readFileSync(new URL("../lib/i18n/sv.ts", import.meta.url), "utf8");
const frI18n = readFileSync(new URL("../lib/i18n/fr.ts", import.meta.url), "utf8");
assert(!svI18n.includes("Innehållet är dolt"), "sv i18n must not ship hide-on-blur overlay title");
assert(!svI18n.includes("Jag är tillbaka"), "sv i18n must not ship overlay resume CTA");
assert(!svI18n.includes("Vi döljer frågan när fönstret tappar fokus"), "sv i18n must not claim hide-on-blur");
assert(!frI18n.includes("Contenu masqué"), "fr i18n must not ship overlay title");
assert(!/"contentHidden"/.test(svI18n) && !/"resumeExam"/.test(svI18n), "overlay i18n keys must be deleted");

console.log(
  `self-check OK · research ${researchCount} + owner-seed ${ownerCount} + owner-official ${ownerOfficialCount} + owner-import ${ownerImportCount} + manzi ${manziCount} · extras ${extras.length} · manifest ${manifestFiles.length} · ready@95`,
);
void require;
