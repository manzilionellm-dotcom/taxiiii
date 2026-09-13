#!/usr/bin/env node
/**
 * Import every raster from a Manzi images tree and link questions by imageUrl.
 *
 *   npm run media:import -- --manzi /workspace/taxiprov/manzi/questions-merged.jsonl --images /workspace/taxiprov/manzi/images
 *   npm run media:import -- --coordinator
 *
 * Copies rasters as-is (no resize). Never generates SVG drawings.
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  COORDINATOR_MANZI_IMAGES,
  COORDINATOR_MANZI_JSONL,
  MEDIA_EXTS,
  attachAuthenticMedia,
  candidateSourceRels,
  extOf,
  isRasterExt,
  isSafeMediaKey,
  sanitizeCaption,
  toImageUrl,
  toLogicalKey,
} from "../lib/media/paths.mjs";
import { parseJsonl } from "./research-normalize.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function walkFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function posixRel(from, to) {
  return relative(from, to).split(sep).join("/");
}

export function indexImageTree(imagesDir) {
  const files = [];
  const byRel = new Map();
  const byBase = new Map();
  if (!imagesDir || !existsSync(imagesDir)) return { files, byRel, byBase };
  for (const abs of walkFiles(imagesDir)) {
    const rel = posixRel(imagesDir, abs);
    const ext = extOf(rel);
    if (!MEDIA_EXTS.has(ext)) continue;
    const size = statSync(abs).size;
    const record = { abs, rel, size, raster: isRasterExt(rel) };
    files.push(record);
    byRel.set(rel.toLowerCase(), record);
    if (rel.toLowerCase().startsWith("media/")) {
      byRel.set(rel.slice("media/".length).toLowerCase(), record);
    } else {
      byRel.set(`media/${rel}`.toLowerCase(), record);
    }
    const base = rel.split("/").pop().toLowerCase();
    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(record);
  }
  return { files, byRel, byBase };
}

export function resolveImageFile(imageUrl, index) {
  const key = toLogicalKey(imageUrl);
  if (!key) return null;
  for (const rel of candidateSourceRels(key)) {
    const hit = index.byRel.get(rel.toLowerCase());
    if (hit) return { ...hit, logicalKey: key };
  }
  const base = key.split("/").pop().toLowerCase();
  const named = index.byBase.get(base) || [];
  if (named.length === 1) return { ...named[0], logicalKey: key };
  return null;
}

function copyPreserving(abs, destAbs) {
  mkdirSync(dirname(destAbs), { recursive: true });
  copyFileSync(abs, destAbs);
}

export function importMediaTree({
  imagesDir,
  destDir = join(root, "content/media"),
  questions = [],
  reportPath = join(root, "data/media-report.json"),
} = {}) {
  mkdirSync(destDir, { recursive: true });
  const index = indexImageTree(imagesDir);
  const rasters = index.files.filter((file) => file.raster);
  const skipped = index.files.filter((file) => !file.raster);

  let copied = 0;
  for (const file of rasters) {
    const logical = file.rel.toLowerCase().startsWith("media/")
      ? file.rel.slice("media/".length)
      : file.rel;
    if (!isSafeMediaKey(logical)) continue;
    copyPreserving(file.abs, join(destDir, logical));
    copied += 1;
  }

  const linked = [];
  const missing = [];
  const rewritten = questions.map((question) => {
    const next = { ...question };
    if (next.imageCaption) next.imageCaption = sanitizeCaption(next.imageCaption);
    if (!next.imageUrl) return next;
    const resolved = resolveImageFile(next.imageUrl, index);
    if (!resolved || !resolved.raster) {
      missing.push({ id: next.id, imageUrl: next.imageUrl });
      delete next.imageUrl;
      return next;
    }
    const destKey = resolved.rel.toLowerCase().startsWith("media/")
      ? resolved.rel.slice("media/".length)
      : resolved.logicalKey;
    if (isSafeMediaKey(destKey)) {
      copyPreserving(resolved.abs, join(destDir, destKey));
      next.imageUrl = toImageUrl(destKey);
      linked.push({ id: next.id, imageUrl: next.imageUrl, bytes: resolved.size });
    }
    return next;
  });

  const withUrl = rewritten.filter((item) => item.imageUrl).length;
  const report = {
    generatedAt: new Date().toISOString(),
    imagesDir: imagesDir || null,
    destDir,
    filesOnDisk: index.files.length,
    rastersCopied: copied,
    nonRasterSkipped: skipped.length,
    questionsTotal: rewritten.length,
    questionsWithImageUrl: withUrl,
    questionsLinkedToFile: linked.length,
    questionsMissingFile: missing.length,
    missingSample: missing.slice(0, 20),
    gulLinje: rewritten.find((item) => item.id === "rs-yt-lag1-gul-linje")?.imageUrl ?? null,
    note:
      "PDF-only Lagstiftning/Säkerhet items stay image-less. Never invent SVG drawings. Full 389MB tree belongs on Vercel Blob, not git.",
  };

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return { questions: rewritten, report, index };
}

function parseArgs(argv) {
  const args = { manzi: null, images: null, coordinator: false };
  const rest = [...argv];
  while (rest.length) {
    const token = rest.shift();
    if (token === "--coordinator") args.coordinator = true;
    else if (token === "--manzi") args.manzi = rest.shift();
    else if (token === "--images") args.images = rest.shift();
  }
  if (args.coordinator) {
    args.manzi = args.manzi || COORDINATOR_MANZI_JSONL;
    args.images = args.images || COORDINATOR_MANZI_IMAGES;
  }
  return args;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.images) {
    console.error(
      "media:import needs --images <dir> (or --coordinator for /workspace/taxiprov/manzi/images)",
    );
    process.exit(1);
  }
  const images = resolve(args.images);
  if (!existsSync(images)) {
    console.error(`Images dir not found: ${images}`);
    process.exit(1);
  }
  let questions = [];
  if (args.manzi && existsSync(resolve(args.manzi))) {
    questions = parseJsonl(readFileSync(resolve(args.manzi), "utf8")).records;
  } else if (args.manzi) {
    console.error(`Manzi JSONL not found: ${resolve(args.manzi)}`);
    process.exit(1);
  }
  const { report } = importMediaTree({
    imagesDir: images,
    questions: attachAuthenticMedia(questions),
  });
  console.log(
    `media:import rasters ${report.rastersCopied}/${report.filesOnDisk} · Q with image ${report.questionsWithImageUrl} · linked ${report.questionsLinkedToFile} · missing ${report.questionsMissingFile} · gul-linje ${report.gulLinje || "(none)"}`,
  );
}
