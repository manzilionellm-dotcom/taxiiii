#!/usr/bin/env node
/**
 * Guards the phone-safe layout Lionel reported as broken in the APK.
 *
 * Measured with Chromium at 360/390/412px: before the fix every route had a
 * document 405px wide at a 360px viewport. The two causes were the header row
 * and the bottom tab labels; on Android the system bars also overlapped the
 * WebView because Capacitor's edge-to-edge margins were disabled. These are
 * static assertions on the pieces that fix — a browser run cannot be part of
 * `npm test` here, so the invariants are pinned instead.
 */
import { readFileSync } from "node:fs";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

function read(rel) {
  return readFileSync(new URL(`../${rel}`, import.meta.url), "utf8");
}

const css = read("app/globals.css");
const layout = read("app/layout.tsx");
const shell = read("components/app-shell.tsx");
const capacitor = read("capacitor.config.ts");
const styles = read("android/app/src/main/res/values/styles.xml");
const patchAndroid = read("scripts/patch-android.mjs");

// Safe areas on all four edges.
for (const side of ["top", "bottom", "left", "right"]) {
  assert(
    css.includes(`--safe-${side}: env(safe-area-inset-${side}`),
    `globals.css must map --safe-${side} to env(safe-area-inset-${side})`,
  );
}
assert(css.includes("--gutter: max(1rem, var(--safe-left))"), "side gutter must respect the notch");
assert(
  /\.app-header\s*\{[^}]*padding-top:\s*max\(0\.75rem,\s*var\(--safe-top\)\)/.test(css),
  ".app-header must pad for the status bar",
);
assert(
  /\.app-nav\s*\{[^}]*padding-bottom:\s*max\(0\.45rem,\s*var\(--safe-bottom\)\)/.test(css),
  ".app-nav must pad for the home indicator",
);

// A phone must never scroll sideways. `clip` keeps the sticky header working.
assert(
  /overflow-x:\s*hidden;\s*overflow-x:\s*clip/.test(css),
  "html/body need overflow-x hidden then clip (clip keeps position: sticky alive)",
);
assert(css.includes("overflow-wrap: break-word"), "long Swedish compounds must break, not overflow");
assert(/img,\n\s*svg,\n\s*video,\n\s*canvas,\n\s*table\s*\{\s*max-width:\s*100%/.test(css),
  "media and tables must be capped at 100% width");

// Bottom tab labels shrink with the screen instead of spilling out of their cell.
assert(css.includes(".app-nav-label"), "globals.css must define .app-nav-label");
assert(
  /\.app-nav-label\s*\{[^}]*min-width:\s*0/.test(css),
  ".app-nav-label needs min-width: 0 so a long label cannot widen its grid cell",
);
assert(shell.includes('className="app-nav-label"'), "nav labels must use .app-nav-label");
assert(
  /flex min-h-12 min-w-0 flex-col/.test(shell),
  "nav links need min-w-0 so flex children cannot overflow",
);
assert(shell.includes("app-main"), "main must use the safe-area gutters");

// 360px budget: the track switcher takes its own row below `sm`.
assert(
  /app-header[^"]*flex-wrap/.test(shell),
  "the header must wrap so the track switcher can take its own row on phones",
);
assert(/order-3 flex w-full rounded-full/.test(shell), "track switcher must be full width on phones");
assert(/min-h-9/.test(shell), "header controls need a 36px touch target");

// Viewport must opt into the safe-area insets.
assert(/viewportFit:\s*"cover"/.test(layout), "viewport needs viewportFit: cover");

// Android: targetSdk 35 forces edge-to-edge and the WebView reports no
// system-bar insets, so Capacitor has to inset it.
assert(
  /adjustMarginsForEdgeToEdge:\s*"auto"/.test(capacitor),
  "android.adjustMarginsForEdgeToEdge must be \"auto\" or the system bars overlap the WebView",
);
assert(
  /android:windowBackground">@color\/colorPrimary/.test(styles),
  "the strips behind the system bars must be painted in the brand colour",
);

// Protections from #14/#18/#20 stay put.
assert(
  patchAndroid.includes("WindowManager.LayoutParams.FLAG_SECURE"),
  "FLAG_SECURE must stay in the generated MainActivity",
);
assert(
  patchAndroid.includes("setRecentsScreenshotEnabled(false)"),
  "Recents screenshot opt-out must stay",
);
assert(
  !/Innehållet är dolt|Contenu masqué/.test(css + shell),
  "the web blur overlay must not come back",
);

console.log("mobile-layout.test OK · safe areas, no sideways scroll, shrinking tab bar, FLAG_SECURE intact");
