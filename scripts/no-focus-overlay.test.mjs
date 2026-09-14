#!/usr/bin/env node
/**
 * Regression: the web hide-on-blur overlay copy must not ship.
 * FLAG_SECURE stays Android-only — do not reintroduce web anti-screenshot.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FORBIDDEN = "Innehållet är dolt";
const FORBIDDEN_ESCAPED = "Inneh\\u00e5llet \\u00e4r dolt";
const FORBIDDEN_RESUME = "Jag är tillbaka";
const FORBIDDEN_HIDE = "Vi döljer frågan när fönstret tappar fokus";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === ".next") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function containsForbidden(text) {
  return (
    text.includes(FORBIDDEN) ||
    text.includes(FORBIDDEN_ESCAPED) ||
    text.includes(FORBIDDEN_RESUME) ||
    text.includes(FORBIDDEN_HIDE)
  );
}

const clientSourceRoots = [
  join(root, "app"),
  join(root, "components"),
  join(root, "lib"),
  join(root, "public"),
  join(root, "native-www"),
];
const clientExt = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".html", ".json"]);

for (const dir of clientSourceRoots) {
  for (const file of walk(dir)) {
    if (!clientExt.has(extname(file))) continue;
    const text = readFileSync(file, "utf8");
    assert(
      !containsForbidden(text),
      `overlay remnant in ${file.slice(root.length + 1)}`,
    );
  }
}

const css = readFileSync(join(root, "app/globals.css"), "utf8");
assert(!/visibilitychange|hide-on-blur|content-hidden-overlay/i.test(css), "no overlay CSS");

const protectedView = readFileSync(join(root, "components/protected-view.tsx"), "utf8");
assert(!protectedView.includes("addEventListener"), "ProtectedView stays a passthrough");
assert(!protectedView.includes("visibilitychange"), "ProtectedView has no visibility hide");

const nativeWww = readFileSync(join(root, "native-www/index.html"), "utf8");
assert(!containsForbidden(nativeWww), "native-www must not embed overlay copy");

const staticDir = join(root, ".next/static");
let bundleFiles = 0;
if (existsSync(staticDir)) {
  const bundleExt = new Set([".js", ".css", ".json", ".html", ".map"]);
  for (const file of walk(staticDir)) {
    if (!bundleExt.has(extname(file))) continue;
    bundleFiles += 1;
    const text = readFileSync(file, "utf8");
    assert(
      !text.includes(FORBIDDEN) && !text.includes(FORBIDDEN_ESCAPED),
      `built client bundle still contains overlay title: ${file.slice(root.length + 1)}`,
    );
    assert(
      !text.includes(FORBIDDEN_RESUME) && !text.includes(FORBIDDEN_HIDE),
      `built client bundle still contains overlay resume/hide copy: ${file.slice(root.length + 1)}`,
    );
  }
  assert(bundleFiles > 0, ".next/static exists but no client assets were scanned");
}

console.log(
  `no-focus-overlay.test OK · client source clean${
    existsSync(staticDir) ? ` · built bundle ${bundleFiles} files clean` : " · bundle check deferred until next build"
  }`,
);
