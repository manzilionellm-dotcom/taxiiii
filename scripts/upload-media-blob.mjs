#!/usr/bin/env node
/**
 * Upload content/media rasters to Vercel Blob (private). Do not commit the 389MB tree.
 *
 *   BLOB_READ_WRITE_TOKEN=… npm run media:upload -- --from content/media
 *
 * Writes data/media-manifest.json so /api/media can fetch originals by logical key.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { contentTypeFor, isRasterExt, isSafeMediaKey, toLogicalKey } from "../lib/media/paths.mjs";
import { walkFiles } from "./import-media.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const args = { from: join(root, "content/media"), prefix: "media" };
  const rest = [...argv];
  while (rest.length) {
    const token = rest.shift();
    if (token === "--from") args.from = resolve(rest.shift());
    else if (token === "--prefix") args.prefix = rest.shift() || "media";
  }
  return args;
}

export function buildManifestEntries(fromDir, prefix = "media") {
  const files = {};
  if (!existsSync(fromDir)) return files;
  for (const abs of walkFiles(fromDir)) {
    if (!isRasterExt(abs)) continue;
    const key = toLogicalKey(abs.slice(fromDir.length));
    if (!key || !isSafeMediaKey(key)) continue;
    const bytes = readFileSync(abs);
    files[key] = {
      pathname: `${prefix}/${key}`,
      size: bytes.byteLength,
      contentType: contentTypeFor(key),
    };
  }
  return files;
}

async function uploadAll(fromDir, prefix) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required (Vercel Blob store → token)");
  }
  const { put } = await import("@vercel/blob");
  const local = buildManifestEntries(fromDir, prefix);
  const files = {};
  let uploaded = 0;
  for (const [key, meta] of Object.entries(local)) {
    const abs = join(fromDir, key);
    const body = readFileSync(abs);
    const blob = await put(meta.pathname, body, {
      access: "private",
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: meta.contentType,
      multipart: body.byteLength > 4 * 1024 * 1024,
    });
    files[key] = {
      pathname: meta.pathname,
      size: meta.size,
      contentType: meta.contentType,
      url: blob.url,
    };
    uploaded += 1;
    if (uploaded % 50 === 0) {
      console.log(`media:upload ${uploaded}/${Object.keys(local).length}`);
    }
  }
  return { uploaded, files };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  const { uploaded, files } = await uploadAll(args.from, args.prefix);
  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    store: "vercel-blob",
    access: "private",
    files,
  };
  const dest = join(root, "data/media-manifest.json");
  writeFileSync(dest, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`media:upload ${uploaded} rasters → ${dest} (original bytes, no resize)`);
}
