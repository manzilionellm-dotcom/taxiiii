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
assert(/dict\.tosAccept/.test(settings), "the licence reminder must live in Settings");
assert(/dict\.demoNote/.test(settings), "the corpus note must live in Settings");
assert(!/demoNote/.test(read("app/page.tsx")), "the corpus note must not be on the home screen");

/* -------------------------------------------------------- translations */

assert(/showTranslations: boolean/.test(types), "the profile must carry the translation preference");
assert(/showTranslations: true/.test(store), "translations must be on by default");
assert(
  /translationsOn=\{state\.profile\.showTranslations\}/.test(study) &&
    /translationsOn=\{state\.profile\.showTranslations\}/.test(exam),
  "study and exam must both read the same persisted preference",
);
assert(
  /const showFrNow = translationsOn \|\| answered/.test(questionCard),
  "one rule must decide every French line",
);
assert(
  !/supportLevel > 0 && isRealFrenchText/.test(questionCard),
  "supportLevel must no longer gate French — it hid French in exam mode",
);
assert(
  !/setShowFr/.test(questionCard),
  "the per-question translation toggle must be gone; it reset on every question",
);
assert(
  /locale === "fr" \? \{ locale, showTranslations: true \}/.test(shell),
  "choosing FR in the header must turn the French line on",
);
assert(
  /translationsOn && !hasFrench/.test(questionCard) && /fr-pending/.test(css),
  "a question with no French yet must say so instead of looking broken",
);
assert(
  !/translationSoon: "Traduction/.test(sv),
  "the Swedish dictionary must not hold a French string",
);
assert(/nav: \{/.test(sv) && /nav: \{/.test(fr), "both dictionaries need short tab-bar labels");
for (const [name, dict] of [["sv", sv], ["fr", fr]]) {
  const block = dict.match(/nav: \{[^}]*\}/s)?.[0] ?? "";
  const labels = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert(labels.length === 6, `${name} must define all six tab labels`);
  assert(
    labels.every((label) => !label.includes("·") && label.length <= 13),
    `${name} tab labels must be single words that fit a 60px cell: ${labels.join(", ")}`,
  );
}

/** Körkort B was translated end to end in #21 and must stay that way. */
const coverage = measureFrench();
const b = coverage.tracks.b;
assert(b, "the bank must still contain a Körkort B track");
assert(
  b.stems >= b.questions - 1,
  `Körkort B French stems must stay complete: ${b.stems}/${b.questions}`,
);
assert(
  b.options >= b.questions - 1,
  `Körkort B French options must stay complete: ${b.options}/${b.questions}`,
);
const committed = JSON.parse(read("data/fr-coverage.json"));
assert(
  JSON.stringify(committed.tracks) === JSON.stringify(coverage.tracks),
  "data/fr-coverage.json is stale — run npm run fr:coverage",
);

/* ---------------------------------------------------------- cold start */

/** Three surfaces paint the same green so a cold start never flashes white. */
assert(/backgroundColor: "#1f3d2b"/.test(capacitor), "the Android WebView background must be brand green");
assert(/launchFadeOutDuration/.test(capacitor), "the native splash must fade rather than cut");
assert(/background: var\(--forest\)/.test(css.match(/\.splash-screen\s*\{[^}]*\}/s)?.[0] ?? ""),
  "the web splash must paint the brand green");
assert(/#1f3d2b/.test(nativeWww), "the bridge page must paint the brand green");
assert(!/liveUrl\.replace\("https:\/\/", ""\)/.test(nativeWww), "the bridge page must not show a raw URL");
assert(/navigator\.onLine === false/.test(nativeWww), "the bridge page must handle having no network");
/** Scoped to SplashScreen: PageSkeleton and SessionSkeleton legitimately shimmer. */
const splashFn = splash.match(/export function SplashScreen\(\)[\s\S]*?\n\}/)?.[0] ?? "";
assert(splashFn, "SplashScreen must exist");
assert(
  /splash-progress/.test(splashFn) && !/skeleton/.test(splashFn),
  "the launch screen must show one honest progress hairline, not fake skeleton content",
);
assert(/tone="light"/.test(splash), "the splash glyph must be the inverted mark on green");

/** The splash bitmap Android actually resolves. */
const patch = read("scripts/patch-android.mjs");
assert(/drawable-port-\$\{density\}/.test(patch), "splash art must reach the port density buckets");
assert(/drawable-land-\$\{density\}/.test(patch), "splash art must reach the land density buckets");
const icon = read("scripts/make-app-icon.mjs");
assert(/render\(1080, 1920/.test(icon) && /render\(1920, 1080/.test(icon),
  "splash art must be generated per orientation, not a stretched square icon");

/** FLAG_SECURE and the absence of the web blur overlay stay pinned. */
const mainActivity = read("android/app/src/main/java/se/mz/korkortgo/MainActivity.java");
assert(/FLAG_SECURE/.test(mainActivity), "FLAG_SECURE must stay");
assert(/setRecentsScreenshotEnabled\(false\)/.test(mainActivity), "the Recents guard must stay");
for (const file of ["components/protected-view.tsx", "app/globals.css", "components/app-shell.tsx"]) {
  assert(!/Innehållet är dolt/.test(read(file)), `${file} must not reintroduce the blur overlay`);
}

if (failures) {
  console.error(`\nsession-ux.test FAILED · ${failures} assertion(s)`);
  process.exit(1);
}
console.log(
  `session-ux.test OK · FR stems b ${coverage.tracks.b.stems}/${coverage.tracks.b.questions} · ` +
    `taxi ${coverage.tracks.taxi.stems}/${coverage.tracks.taxi.questions} · ` +
    `owner ${coverage.tracks.owner.stems}/${coverage.tracks.owner.questions}`,
);
