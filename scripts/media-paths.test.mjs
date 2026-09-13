#!/usr/bin/env node
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  GUL_LINJE_ID,
  attachAuthenticMedia,
  hasAuthenticImageUrl,
  isFakeExamSvg,
  isSafeMediaKey,
  sanitizeCaption,
  toImageUrl,
  toLogicalKey,
} from "../lib/media/paths.mjs";
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
assert(!isSafeMediaKey("../secret.jpg"), "reject parent");
assert(!isSafeMediaKey("T3/../../etc/passwd"), "reject traversal");
assert(!toLogicalKey("media/../etc/passwd"), "logical rejects traversal");
assert(isFakeExamSvg("/media/gul-heldragen-linje.svg"), "fake svg flagged");
assert(!hasAuthenticImageUrl("/media/gul-heldragen-linje.svg"), "fake svg not authentic");
assert(hasAuthenticImageUrl("/media/T3/lag/exam.php-filer/101.jpg"), "raster authentic");

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
