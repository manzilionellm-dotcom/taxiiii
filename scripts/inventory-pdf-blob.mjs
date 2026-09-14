#!/usr/bin/env node
/**
 * Inventory which media/pdf-pages/*.jpg objects actually exist on Vercel Blob.
 * Relink (pdf-pages-on-blob.json) only when list() returns a real object with size.
 * Never invent rasters. Without BLOB_READ_WRITE_TOKEN this is a documented blocker.
 *
 *   BLOB_READ_WRITE_TOKEN=… npm run media:inventory-pdf
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { toLogicalKey } from "../lib/media/paths.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const confirmedPath = join(root, "data/pdf-pages-on-blob.json");
const manifestPath = join(root, "data/media-manifest.json");
const reportPath = join(root, "data/blob-inventory-report.json");

function loadJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function logicalFromBlobPath(pathname) {
  return toLogicalKey(String(pathname || "").replace(/^\/+/, ""));
}

export async function inventoryPdfPages({ write = true } = {}) {
  const confirmedPrev = loadJson(confirmedPath, []);
  const manifest = loadJson(manifestPath, { files: {} });
  const files = manifest.files || {};
  const manifestPdf = Object.entries(files).filter(([key]) => key.startsWith("pdf-pages/"));
  const manifestWithSize = manifestPdf.filter(([, entry]) => Number(entry?.size) > 0);
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim() || "";

  const report = {
    generatedAt: new Date().toISOString(),
    tokenPresent: Boolean(token),
    confirmedPdfPages: Array.isArray(confirmedPrev) ? confirmedPrev.length : 0,
    manifestPdfPagePathnames: manifestPdf.length,
    manifestPdfPagesWithSize: manifestWithSize.length,
    listedPdfPages: 0,
    listedBytes: 0,
    wroteConfirmed: false,
    blocker: null,
  };

  if (!token) {
    report.blocker =
      "BLOB_READ_WRITE_TOKEN is missing in this environment. Private Blob list/get cannot run, so exam PDF pages cannot be opened (signed /api/media URLs 404). Set the token on Vercel project taxiiii (Production + Preview) and re-run `npm run media:inventory-pdf`. Do not invent rasters. Confirmed inventory stays the original 93 «på bilden» keys in data/pdf-pages-on-blob.json.";
    if (write) writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    return report;
  }

  const { list } = await import("@vercel/blob");
  const found = [];
  let cursor;
  do {
    const page = await list({
      token,
      prefix: "media/pdf-pages/",
      cursor,
      limit: 1000,
    });
    for (const blob of page.blobs || []) {
      const key = logicalFromBlobPath(blob.pathname || blob.url);
      const size = Number(blob.size) || 0;
      if (!key || !key.startsWith("pdf-pages/") || size <= 0) continue;
      found.push({ key, size, pathname: blob.pathname, url: blob.url });
      report.listedBytes += size;
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  found.sort((a, b) => a.key.localeCompare(b.key, "en"));
  report.listedPdfPages = found.length;
  report.confirmedPdfPages = found.length;

  if (write && found.length) {
    const keys = found.map((item) => item.key);
    writeFileSync(confirmedPath, `${JSON.stringify(keys, null, 2)}\n`);
    report.wroteConfirmed = true;
    for (const item of found) {
      const prev = files[item.key] || {};
      files[item.key] = {
        ...prev,
        pathname: item.pathname || prev.pathname || `media/${item.key}`,
        size: item.size,
        contentType: prev.contentType || "image/jpeg",
        ...(item.url ? { url: item.url } : {}),
        confirmed: true,
      };
    }
    manifest.files = files;
    manifest.generatedAt = new Date().toISOString();
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  } else if (token && found.length === 0) {
    report.blocker =
      "BLOB_READ_WRITE_TOKEN is set but list(media/pdf-pages/) returned 0 objects with size. The ~93 confirmed «på bilden» keys stay; extra pathnames in the manifest are phantoms. Upload coordinator pdftoppm JPEGs with `npm run media:upload`. Do not invent rasters.";
  }

  if (write) writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await inventoryPdfPages();
  if (report.blocker) {
    console.log(`inventory-pdf-blob BLOCKER: ${report.blocker}`);
  } else {
    console.log(
      `inventory-pdf-blob: ${report.listedPdfPages} real pdf-pages (${report.listedBytes} bytes) · manifest pathnames ${report.manifestPdfPagePathnames}`,
    );
  }
}
