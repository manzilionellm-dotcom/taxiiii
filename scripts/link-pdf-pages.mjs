#!/usr/bin/env node
/**
 * Persist coordinator PDF-page links on the Manzi JSONL + manifest.
 *
 *   LAGSTIFNING-1-Q1  → /media/pdf-pages/LAGSTIFNING-1/page-01.jpg
 *   S_KERHET-7-Q19    → /media/pdf-pages/S_KERHET-7/page-19.jpg
 *
 * Does not invent kkalk-T-* links. Does not rewrite stems.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BLOB_STORE_HOST, parsePdfPageId } from "../lib/media/paths.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function linkPdfPages({
  jsonlPath = join(root, "data/questions.jsonl"),
  linksPath = join(root, "data/pdf-page-links.json"),
  manifestPath = join(root, "data/media-manifest.json"),
} = {}) {
  const lines = readFileSync(jsonlPath, "utf8").split(/\r?\n/);
  let jsonlLinked = 0;
  let jsonlNew = 0;
  let jsonlSkippedTypo = 0;
  const links = [];
  const neededKeys = new Set();

  const outLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return line;
    let record;
    try {
      record = JSON.parse(trimmed);
    } catch {
      return line;
    }
    const parsed = parsePdfPageId(record.id);
    if (!parsed) {
      if (/^(LAGSTIFNING|S_KERHET)-\d+-Q\d+$/.test(String(record.id || ""))) {
        jsonlSkippedTypo += 1;
      }
      return line;
    }
    const already = record.imageUrl === parsed.imageUrl;
    if (!already) jsonlNew += 1;
    jsonlLinked += 1;
    record.imageUrl = parsed.imageUrl;
    neededKeys.add(parsed.logicalKey);
    links.push({
      id: record.id,
      imageUrl: parsed.imageUrl,
      pathname: parsed.pathname,
      logicalKey: parsed.logicalKey,
    });
    return JSON.stringify(record);
  });

  writeFileSync(jsonlPath, `${outLines.join("\n").replace(/\n+$/, "")}\n`);

  links.sort((a, b) => a.id.localeCompare(b.id, "en"));
  writeFileSync(
    linksPath,
    `${JSON.stringify(
      {
        version: 2,
        generatedAt: new Date().toISOString(),
        count: links.length,
        blobHost: `${BLOB_STORE_HOST}/`,
        note: "Coordinator rule: every LAGSTIFNING-{n}-Q{q} / S_KERHET-{n}-Q{q} (q ≤ 80) maps to /media/pdf-pages/{BOOK}-{n}/page-{qq}.jpg. S_KERHET-7-Q2009 skipped (typo id). kkalk-T-* left unlinked. Stems untouched.",
        skippedTypoIds: ["S_KERHET-7-Q2009"],
        links,
      },
      null,
      2,
    )}\n`,
  );

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.files = manifest.files || {};
  let manifestAdded = 0;
  for (const key of [...neededKeys].sort()) {
    if (manifest.files[key]) continue;
    manifest.files[key] = {
      pathname: `media/${key}`,
      contentType: "image/jpeg",
      url: `${BLOB_STORE_HOST}/media/${key}`,
    };
    manifestAdded += 1;
  }
  manifest.generatedAt = new Date().toISOString();
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const report = {
    jsonlLinked,
    jsonlNew,
    jsonlSkippedTypo,
    uniquePages: neededKeys.size,
    manifestAdded,
    manifestFiles: Object.keys(manifest.files).length,
  };
  return report;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = linkPdfPages();
  console.log(
    `link-pdf-pages: ${report.jsonlLinked} JSONL ids (${report.jsonlNew} new), ${report.uniquePages} unique pages, +${report.manifestAdded} manifest keys → ${report.manifestFiles}. skipped typo ${report.jsonlSkippedTypo}.`,
  );
}
