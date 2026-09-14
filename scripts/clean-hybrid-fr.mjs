#!/usr/bin/env node
/**
 * Apply curated FR stems, then drop hybrid SV/FR leftovers (#14: empty > garbage).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { looksHybridFrench, looksUnusableFrench } from "../lib/questions/french.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "data/translations.fr.json");
const overrides = JSON.parse(readFileSync(join(root, "data/fr-stem-overrides.json"), "utf8"));
const current = JSON.parse(readFileSync(dest, "utf8"));

let replaced = 0;
let skippedBadOverride = 0;
for (const [id, stem] of Object.entries(overrides)) {
  const clean = String(stem || "").replace(/\s+/g, " ").trim();
  if (!clean || looksUnusableFrench(clean)) {
    skippedBadOverride += 1;
    console.error(`override rejected as hybrid/placeholder: ${id}`);
    continue;
  }
  current[id] = { ...(current[id] || {}), stem: clean };
  replaced += 1;
}

let deleted = 0;
for (const [id, value] of Object.entries(current)) {
  const stem = value?.stem;
  if (typeof stem !== "string") continue;
  if (looksHybridFrench(stem) || looksUnusableFrench(stem)) {
    const next = { ...value };
    delete next.stem;
    if (Object.keys(next).length) current[id] = next;
    else delete current[id];
    deleted += 1;
  }
}

writeFileSync(dest, `${JSON.stringify(current, null, 2)}\n`);
const remaining = Object.values(current).filter(
  (item) => item?.stem && !looksUnusableFrench(item.stem),
).length;
console.log(
  `clean-hybrid-fr: overrides ${replaced}, deleted ${deleted}, remaining clean stems ${remaining}, bad overrides ${skippedBadOverride}`,
);
