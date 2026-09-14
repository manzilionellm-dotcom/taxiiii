#!/usr/bin/env node
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  GUL_LINJE_ID,
  attachAuthenticMedia,
  blobRefForManifest,
  dropMissingImageUrl,
  hasAuthenticImageUrl,
  isFakeExamSvg,
  isSafeMediaKey,
  mediaKeyIsPresent,
  parsePdfPageId,
  pdfPageImageUrlFromId,
  sanitizeCaption,
  shouldShowImageBeforeAnswer,
  toImageUrl,
  toLogicalKey,
} from "../lib/media/paths.mjs";
import { letterFromAnswer, mapFreq, mapTopic, stemKey } from "./research-normalize.mjs";
import { importMediaTree, resolveImageFile, indexImageTree } from "./import-media.mjs";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

function tinyPng() {
  return Buffer.from(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082",
    "hex",
  );
}

assert(toLogicalKey("media/T3/lag/exam.php-filer/101.jpg") === "T3/lag/exam.php-filer/101.jpg", "strip media/");
assert(toLogicalKey("/media/T3/lag/exam.php-filer/101.jpg") === "T3/lag/exam.php-filer/101.jpg", "strip /media/");
assert(toLogicalKey("media\\T3\\lag\\101.jpg") === "T3/lag/101.jpg", "windows slashes");
assert(toImageUrl("media/T3/a/1.jpg") === "/media/T3/a/1.jpg", "public url");
assert(
  toImageUrl("media/T3/Taxi porove/kartap/kartp1/1/exam.php-filer/799508375.jpg") ===
    "/media/T3/Taxi porove/kartap/kartp1/1/exam.php-filer/799508375.jpg",
  "leading slash on spaced Manzi path",
);
assert(mapTopic("vilotid") === "lagstiftning", "vilotid alias");
assert(mapTopic("pris") === "lagstiftning", "pris alias");
assert(mapFreq("haute") === "high", "freq haute");
assert(mapFreq("moyenne") === "medium", "freq moyenne");
assert(letterFromAnswer("C", [{ letter: "C", text: "12 månader" }]) === "C", "letter answer");
assert(stemKey("  Gul   linje ") === "gul linje", "stem key");
assert(!isSafeMediaKey("../secret.jpg"), "reject parent");
assert(!isSafeMediaKey("T3/../../etc/passwd"), "reject traversal");
assert(!toLogicalKey("media/../etc/passwd"), "logical rejects traversal");
assert(isFakeExamSvg("/media/gul-heldragen-linje.svg"), "fake svg flagged");
assert(!hasAuthenticImageUrl("/media/gul-heldragen-linje.svg"), "fake svg not authentic");
assert(hasAuthenticImageUrl("/media/T3/lag/exam.php-filer/101.jpg"), "raster authentic");
assert(
  blobRefForManifest({
    pathname: "media/pdf-pages/S_KERHET-2/page-11.jpg",
    contentType: "image/jpeg",
  }) === "media/pdf-pages/S_KERHET-2/page-11.jpg",
  "pathname-only manifest is enough for Blob get()",
);
assert(
  blobRefForManifest({
    pathname: "media/pdf-pages/S_KERHET-2/page-11.jpg",
    url: "https://vmgbarxpqkgzrt73.private.blob.vercel-storage.com/media/pdf-pages/S_KERHET-2/page-11.jpg",
  }) === "media/pdf-pages/S_KERHET-2/page-11.jpg",
  "pathname is preferred over url",
);
assert(!blobRefForManifest({}), "empty manifest entry has no blob ref");

assert(
  pdfPageImageUrlFromId("LAGSTIFNING-1-Q1") === "/media/pdf-pages/LAGSTIFNING-1/page-01.jpg",
  "LAGSTIFNING-1-Q1 page-01",
);
assert(
  pdfPageImageUrlFromId("S_KERHET-7-Q19") === "/media/pdf-pages/S_KERHET-7/page-19.jpg",
  "S_KERHET-7-Q19 page-19",
);
assert(!pdfPageImageUrlFromId("S_KERHET-7-Q2009"), "typo Q2009 stays unlinked");
assert(!pdfPageImageUrlFromId("kkalk-T-021"), "kkalk public stems stay unlinked");
assert(!pdfPageImageUrlFromId("SAKERHET-1-Q3"), "SAKERHET spelling is not auto-mapped");
assert(parsePdfPageId("LAGSTIFNING-8-Q64")?.logicalKey === "pdf-pages/LAGSTIFNING-8/page-64.jpg", "book 8 page 64");

const pdfAttached = attachAuthenticMedia([
  { id: "LAGSTIFNING-1-Q1", stem_sv: "på bilden" },
  { id: "S_KERHET-7-Q19", stem_sv: "Vad visar bilden?" },
  { id: "S_KERHET-7-Q2009", stem_sv: "mönsterdjup" },
  { id: "kkalk-T-021", stem_sv: "busshållplats som saknar gul linje" },
  { id: "KARTA-1-Q1", stem_sv: "karta", imageUrl: "media/T3/karta/exam.php-filer/1.jpg" },
]);
assert(pdfAttached[0].imageUrl === "/media/pdf-pages/LAGSTIFNING-1/page-01.jpg", "compile attaches LAGSTIFNING page");
assert(pdfAttached[1].imageUrl === "/media/pdf-pages/S_KERHET-7/page-19.jpg", "compile attaches S_KERHET page");
assert(!pdfAttached[2].imageUrl, "Q2009 not attached");
assert(!pdfAttached[3].imageUrl, "kkalk not attached");
assert(pdfAttached[4].imageUrl === "/media/T3/karta/exam.php-filer/1.jpg", "existing HTM karta url kept");

const confirmed = new Set(["pdf-pages/LAGSTIFNING-1/page-01.jpg"]);
assert(
  mediaKeyIsPresent("pdf-pages/LAGSTIFNING-1/page-01.jpg", {}, { confirmedKeys: confirmed }),
  "original 93 pdf-pages are present",
);
assert(
  !mediaKeyIsPresent("pdf-pages/LAGSTIFNING-1/page-04.jpg", { contentType: "image/jpeg" }, { confirmedKeys: confirmed }),
  "phantom page-04 is not present",
);
const dropped = attachAuthenticMedia(
  [
    { id: "LAGSTIFNING-1-Q1", stem_sv: "på bilden" },
    { id: "LAGSTIFNING-1-Q4", stem_sv: "dygnsvila kl 08:00" },
  ],
  { confirmedKeys: confirmed, files: {} },
);
assert(dropped[0].imageUrl === "/media/pdf-pages/LAGSTIFNING-1/page-01.jpg", "confirmed PDF page kept");
assert(!dropped[1].imageUrl, "unuploaded PDF page imageUrl cleared");
assert(
  !shouldShowImageBeforeAnswer({
    id: "LAGSTIFNING-1-Q4",
    stem_sv:
      "Du börjar köra taxi kl 08:00 efter en dygnsvila. Du gör ett uppehåll i arbetet mellan 09:00- 13:00. När måste du sluta köra taxi och börja nästa dygnsvila enligt vilotids förordning och bestämmelser?",
  }),
  "Q4 without imageUrl must not mount Tillhörande bild",
);
assert(
  !shouldShowImageBeforeAnswer(dropped[1]),
  "stripped Q4 phantom must not show the gray broken-image box",
);
assert(
  !dropMissingImageUrl(
    { imageUrl: "/media/pdf-pages/LAGSTIFNING-1/page-04.jpg" },
    {},
    { confirmedKeys: confirmed },
  ).imageUrl,
  "dropMissingImageUrl strips phantom url",
);

assert(sanitizeCaption("Gul heldragen linje · trottoarkant") === "Gul heldragen linje trottoarkant", "middle-dot caption");
assert(sanitizeCaption("Gul heldragen linje ♦ trottoarkant") === "Gul heldragen linje trottoarkant", "diamond caption");
assert(sanitizeCaption("pÃ¥ trottoarkanten").includes("på"), `mojibake å: ${sanitizeCaption("pÃ¥ trottoarkanten")}`);

const stripped = attachAuthenticMedia([
  {
    id: GUL_LINJE_ID,
    stem_sv: "Vad anger en gul heldragen linje på trottoarkanten?",
    corpus: "research",
    imageUrl: "/media/gul-heldragen-linje.svg",
  },
]);
assert(!stripped[0].imageUrl, "gul-linje fake SVG must be removed when no Manzi raster exists");

const linked = attachAuthenticMedia([
  {
    id: GUL_LINJE_ID,
    stem_sv: "Vad anger en gul heldragen linje på trottoarkanten?",
    corpus: "research",
  },
  {
    id: "mz-lag-gul",
    stem_sv: "Vad anger en gul heldragen linje på trottoarkanten?",
    corpus: "manzi",
    imageUrl: "media/T3/lagstiftning/exam.php-filer/202.jpg",
    imageCaption: "Gul heldragen linje · trottoarkant",
  },
]);
assert(linked[0].imageUrl === "/media/T3/lagstiftning/exam.php-filer/202.jpg", "reuse Manzi raster for gul-linje");
assert(linked[0].imageCaption === "Gul heldragen linje trottoarkant", "caption sanitized when copied");

const dir = mkdtempSync(join(tmpdir(), "manzi-media-"));
try {
  const images = join(dir, "images");
  const dest = join(dir, "content-media");
  const exam = join(images, "T3/lagstiftning/exam.php-filer");
  mkdirSync(exam, { recursive: true });
  mkdirSync(join(images, "T1/extra"), { recursive: true });
  writeFileSync(join(exam, "101.jpg"), tinyPng());
  writeFileSync(join(exam, "202.jpg"), tinyPng());
  writeFileSync(join(images, "T1/extra/orphan.png"), tinyPng());
  writeFileSync(join(images, "notes.pdf"), Buffer.from("%PDF-1.4"));

  const questions = [
    {
      id: "q-linked",
      stem_sv: "Skylt",
      imageUrl: "media/T3/lagstiftning/exam.php-filer/101.jpg",
    },
    {
      id: GUL_LINJE_ID,
      stem_sv: "Vad anger en gul heldragen linje på trottoarkanten?",
      corpus: "research",
    },
    {
      id: "mz-gul",
      stem_sv: "Gul heldragen linje på trottoarkanten betyder?",
      corpus: "manzi",
      imageUrl: "media/T3/lagstiftning/exam.php-filer/202.jpg",
    },
    { id: "q-pdf-only", stem_sv: "PDF-only lagstiftning" },
    { id: "q-missing", stem_sv: "Saknas", imageUrl: "media/T3/missing/exam.php-filer/999.jpg" },
  ];

  const prepared = attachAuthenticMedia(questions);
  const { report, questions: out } = importMediaTree({
    imagesDir: images,
    destDir: dest,
    questions: prepared,
    reportPath: join(dir, "media-report.json"),
  });

  const index = indexImageTree(images);
  assert(index.files.length === 3, `indexed rasters+svg only, got ${index.files.length}`);
  assert(resolveImageFile("media/T3/lagstiftning/exam.php-filer/101.jpg", index), "path match");
  assert(report.rastersCopied === 3, `copied all rasters including unlinked, got ${report.rastersCopied}`);
  assert(report.nonRasterSkipped === 0, "pdf skipped by walk filter");
  assert(out.find((item) => item.id === "q-linked")?.imageUrl === "/media/T3/lagstiftning/exam.php-filer/101.jpg");
  assert(out.find((item) => item.id === GUL_LINJE_ID)?.imageUrl === "/media/T3/lagstiftning/exam.php-filer/202.jpg");
  assert(!out.find((item) => item.id === "q-missing")?.imageUrl, "broken imageUrl dropped");
  assert(!out.find((item) => item.id === "q-pdf-only")?.imageUrl, "pdf-only stays empty");
  assert(report.questionsMissingFile === 1, "one missing file");
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.log("media-paths.test OK");
