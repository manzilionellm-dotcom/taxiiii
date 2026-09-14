#!/usr/bin/env node
/** Expand media-manifest-pdf-keys.part* + pdf-page-links-patch into data/*. */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const manifestPath = join(dataDir, "media-manifest.json");
const linksPath = join(dataDir, "pdf-page-links.json");
const linksPatchPath = join(dataDir, "pdf-page-links-patch.json");

if (existsSync(manifestPath)) {
  const mm = JSON.parse(readFileSync(manifestPath, "utf8"));
  mm.files = mm.files || {};
  let added = 0;
  for (const name of readdirSync(dataDir).filter((n) => /^media-manifest-pdf-keys\.part\d+\.json$/.test(n)).sort()) {
    const spec = JSON.parse(readFileSync(join(dataDir, name), "utf8"));
    for (const key of spec.keys || []) {
      if (!mm.files[key]) {
        added++;
        // No invented `size`. mediaKeyIsPresent treats size>0 as proof of bytes;
        // confirmed + pdf-pages-on-blob.json is the honest presence signal (#23).
        mm.files[key] = { confirmed: true };
      }
    }
  }
  if (added) {
    writeFileSync(manifestPath, JSON.stringify(mm, null, 2) + "\n");
    console.log(`apply-manzi-100-media-keys: media-manifest → ${Object.keys(mm.files).length} (+${added})`);
  }
}

if (existsSync(linksPatchPath) && existsSync(linksPath)) {
  const raw = JSON.parse(readFileSync(linksPath, "utf8"));
  const patch = JSON.parse(readFileSync(linksPatchPath, "utf8"));
  const list = Array.isArray(raw) ? raw : Array.isArray(raw.links) ? raw.links : [];
  const by = new Map(list.map((x) => [x.id, x]));
  for (const row of Array.isArray(patch) ? patch : []) by.set(row.id, row);
  const merged = [...by.values()].sort((a, b) => String(a.id).localeCompare(String(b.id), "en"));
  if (Array.isArray(raw)) writeFileSync(linksPath, JSON.stringify(merged, null, 2) + "\n");
  else writeFileSync(linksPath, JSON.stringify({ ...raw, count: merged.length, links: merged, generatedAt: new Date().toISOString() }, null, 2) + "\n");
  console.log(`apply-manzi-100-media-keys: pdf-page-links → ${merged.length}`);
}
