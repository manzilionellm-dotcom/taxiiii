#!/usr/bin/env node
/**
 * Contract for the answer loop, the translation rule and the cold start.
 *
 * These are source-level assertions, not a browser run: each one pins a fix
 * whose regression is invisible in a screenshot until a user hits it on a
 * phone. The browser pass that produced these numbers lives in the PR.
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { measureFrench } from "./fr-coverage.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(join(root, file), "utf8");

let failures = 0;
function assert(condition, message) {
  if (condition) return;
  failures += 1;
  console.error(`  ✗ ${message}`);
}

const css = read("app/globals.css");
const questionCard = read("components/question-card.tsx");
const sessionFrame = read("components/session-frame.tsx");
const shell = read("components/app-shell.tsx");
const chrome = read("components/chrome.tsx");
const store = read("lib/progress/store.ts");
const types = read("lib/types.ts");
const study = read("components/study-session.tsx");
const exam = read("components/exam-session.tsx");
const settings = read("app/settings/page.tsx");
const capacitor = read("capacitor.config.ts");
const nativeWww = read("scripts/write-native-www.mjs");
const splash = read("components/splash-screen.tsx");
const sv = read("lib/i18n/sv.ts");
const fr = read("lib/i18n/fr.ts");

/* ---------------------------------------------------------------- taps */

/**
 * The one that actually cost taps: every Swedish word in an option is a
 * glossary token, and the click handler used to return early on those, so a
 * tap on the answer text did nothing.
 */
assert(
  !/closest\("\[data-gloss-word\]"\)\)\s*return/.test(questionCard),
  "question-card must not skip a tap that lands on a glossed word",
);
assert(
  /onClick=\{\(\) => select\(option\.letter\)\}/.test(questionCard),
  "an option row's tap must select that option unconditionally",
);
assert(
  /const selectLock = useRef\(false\)/.test(questionCard) &&
    /selectLock\.current\) return/.test(questionCard) &&
    /selectLock\.current = true/.test(questionCard),
  "question-card must lock after the first tap so a double-tap cannot change the answer",
);
