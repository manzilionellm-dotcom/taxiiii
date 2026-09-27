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
/** The hold path is what protects the glossary, so it has to stay. */
assert(
  /allowMouseClick\s*=\s*variant !== "option"/.test(read("components/glossary.tsx")),
  "an option's gloss must still open on hold only, never on a plain tap",
);

assert(/\.session-actions\s*\{/.test(css), "the fixed session action bar must exist");
assert(
  /\.session-actions\s*\{[^}]*position:\s*fixed[^}]*\}/s.test(css),
  "the action bar must be fixed, not a button at the end of the page",
);
assert(
  /--action-h:/.test(css) && /h-\[var\(--action-h\)\]/.test(sessionFrame),
  "the session must reserve the action bar's height so the last line stays readable",
);

/**
 * A transform on an ancestor makes it the containing block for fixed
 * children: with it, the action bar rendered below the fold, the exam
 * lightbox covered the document instead of the screen, and the glossary chip
 * was offset by <main>'s top edge. page-enter must stay transform-free.
 */
const pageEnter = css.match(/\.page-enter\s*\{[^}]*\}/s)?.[0] ?? "";
assert(pageEnter && !/transform/.test(pageEnter), ".page-enter must not set a transform");
const fadeIn = css.match(/@keyframes fade-in\s*\{.*?\n\}/s)?.[0] ?? "";
assert(fadeIn && !/transform/.test(fadeIn), "the page-enter keyframes must not animate transform");
assert(!/@keyframes rise\b/.test(css), "the transform-based rise keyframes must be gone");

assert(/window\.scrollTo\(\{ top: 0/.test(sessionFrame), "a new question must arrive at its stem");
assert(/scrollIntoView/.test(questionCard), "the solution must be brought into view on answering");
assert(/answerHaptic/.test(questionCard), "answering must give haptic confirmation");
assert(/answerHaptic/.test(read("lib/haptics.ts")), "lib/haptics must expose answerHaptic");
assert(
  /dx < -64 && Math\.abs\(dx\) > Math\.abs\(dy\) \* 2/.test(sessionFrame),
  "a left flick must advance, and must not fire on a vertical scroll",
);
assert(
  /event\.key === "Enter" \|\| event\.key === "ArrowRight"/.test(sessionFrame),
  "keyboard parity for advancing must exist",
);

/** Focus mode: the session owns the screen. */
assert(/useFocusMode/.test(chrome) && /useFocusMode\(\)/.test(sessionFrame), "sessions must claim focus mode");
assert(/focus \|\| !onboarded \? null :/.test(shell), "the app header must stand down in a session and during first run");
assert(/const showNav = onboarded && !focus/.test(shell), "the tab bar must stand down in a session");
assert(/dataset\.focus/.test(shell), "focus mode must reach CSS for scroll padding");

/** Both runners share one frame instead of two copies of the same chrome. */
assert(/SessionFrame/.test(study) && /SessionFrame/.test(exam), "both runners must use SessionFrame");
assert(
  !/btn-primary w-full"\s*\n\s*onClick/.test(study) && !/btn-primary w-full"\s*\n\s*onClick/.test(exam),
  "neither runner may keep its own end-of-page next button",
);

/** The licence line is not tab-bar furniture. */
const navBlock = shell.match(/<nav className="app-nav[\s\S]*?<\/nav>/)?.[0] ?? "";
assert(navBlock, "the tab bar must still exist");
assert(!/dict\.tosAccept/.test(navBlock), "the licence reminder must not sit in the tab bar");
assert(/d