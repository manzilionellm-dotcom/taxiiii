#!/usr/bin/env node
/** One-shot: write data/pdf-page-links-patch.json for S_KERHET ids from rename map. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const map = JSON.parse(readFileSync(join(root, "data/sakerhet-rename-map.json"), "utf8"));
const links = Object.values(map).map((id) => {
  const m = /^S_KERHET-(\d+)-Q(\d+)$/.exec(id);
  const page = String(Number(m[2])).padStart(2, "0");
  const folder = `S_KERHET-${m[1]}`;
  const logicalKey = `pdf-pages/${folder}/page-${page}.jpg`;
  return { id, imageUrl: `/media/${logicalKey}`, pathname: `media/${logicalKey}`, logicalKey };
});
writeFileSync(join(root, "data/pdf-page-links-patch.json"), JSON.stringify(links) + "\n");
console.log("wrote", links.length, "pdf-page-links-patch entries");
