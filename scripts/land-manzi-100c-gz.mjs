#!/usr/bin/env node
/** Expand manzi-100c bank from split .gz.b64.partNN (MCP-safe) or monolithic .gz.b64/.gz. */
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = join(root, "data");

function readB64(name) {
  const partsList = join(data, `${name}.gz.b64.parts`);
  if (existsSync(partsList)) {
    const parts = readFileSync(partsList, "utf8")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.map((p) => readFileSync(join(root, p), "utf8").trim()).join("");
  }
  const mono = join(data, `${name}.gz.b64`);
  if (existsSync(mono)) return readFileSync(mono, "utf8").trim();
  return null;
}

function expand(name) {
  const out = join(data, name);
  const b64 = readB64(name);
  let raw;
  if (b64) raw = Buffer.from(b64, "base64");
  else if (existsSync(join(data, `${name}.gz`))) raw = readFileSync(join(data, `${name}.gz`));
  else return false;
  const buf = gunzipSync(raw);
  writeFileSync(out, buf);
  console.log(`land-manzi-100c-gz: wrote data/${name} (${buf.length} bytes)`);
  return true;
}

const wroteQ = expand("questions.json");
expand("questions.jsonl");
expand("media-manifest.json");
if (!wroteQ) console.log("land-manzi-100c-gz: no gzipped questions.json — skip");
