import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib/branding.ts"), "utf8");

function quoted(key) {
  const match = src.match(new RegExp(`${key}:\\s*"([^"]+)"`));
  if (!match) throw new Error(`Missing branding key: ${key}`);
  return match[1];
}

const appName = quoted("appName");
const signature = quoted("signature");
const slogan = quoted("slogan");
const keyMessage = quoted("keyMessage");
const serverUrl = quoted("serverUrl");
const liveUrl = process.env.CAPACITOR_SERVER_URL?.trim() || serverUrl;

/**
 * The Capacitor bridge page: the first thing the WebView paints on a cold
 * start, before the live app answers. So it is the launch screen, not a
 * debug page — same forest green, same lockup and the same hairline progress
 * as components/splash-screen.tsx, so the handoff is invisible.
 *
 * It also owns the one failure the remote app cannot cover: with no network
 * the WebView would land on a system error page. Here the user gets the brand
 * screen with a retry instead, and navigation only starts when we are online.
 */
const html = `<!DOCTYPE html>
<html lang="sv">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#1f3d2b" />
    <title>${appName} ${signature}</title>
    <style>
      :root { color-scheme: dark; }
      html, body { height: 100%; margin: 0; background: #1f3d2b; }
      body {
        font-family: ui-sans-serif, system-ui, sans-serif;
        color: #fffdf8;
        display: grid;
        place-items: center;
        padding: 2rem;
        text-align: center;
      }
      main { max-width: 20rem; }
      .glyph { width: 64px; height: 64px; margin: 0 auto 1.5rem; }
      h1 {
        font-family: Georgia, "Source Serif 4", serif;
        font-size: 1.75rem;
        letter-spacing: -0.01em;
        margin: 0;
      }
      h1 span { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 0.7em; opacity: 0.7; }
      .slogan { margin: 0.5rem 0 0; font-size: 0.875rem; line-height: 1.5; color: #cfe0d4; }
      .bar {
        margin: 2.25rem auto 0;
        width: 7rem; height: 2px; border-radius: 999px; overflow: hidden;
        background: rgba(255, 253, 248, 0.18); position: relative;
      }
      .bar::after {
        content: ""; position: absolute; inset: 0 auto 0 0; width: 42%;
        border-radius: inherit; background: #fffdf8;
        animation: sweep 1.15s ease-in-out infinite;
      }
      @keyframes sweep {
        0% { transform: translateX(-110%); }
        100% { transform: translateX(340%); }
      }
      #offline { display: none; margin-top: 2rem; }
      #offline p { font-size: 0.875rem; line-height: 1.5; color: #cfe0d4; margin: 0 0 1rem; }
      button {
        font: inherit; font-weight: 600; color: #1f3d2b; background: #fffdf8;
        border: 0; border-radius: 999px; min-height: 3rem; padding: 0 1.5rem;
      }
      @media (prefers-reduced-motion: reduce) { .bar::after { animation: none; } }
    </style>
  </head>
  <body>
    <main>
      <svg class="glyph" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#fffdf8" />
        <circle cx="16" cy="16" r="7.4" fill="none" stroke="#1f3d2b" stroke-width="2.4" />
      </svg>
      <h1>${appName} <span>${signature}</span></h1>
      <p class="slogan">${slogan}</p>
      <div class="bar" id="bar"></div>
      <div id="offline">
        <p>Ingen anslutning. / Pas de connexion.<br />${keyMessage}</p>
        <button type="button" id="retry">Försök igen / Réessayer</button>
      </div>
    </main>
    <script>
      var target = ${JSON.stringify(liveUrl)};
      function go() {
        if (navigator.onLine === false) {
          document.getElementById("bar").style.display = "none";
          document.getElementById("offline").style.display = "block";
          return;
        }
        location.replace(target);
      }
      document.getElementById("retry").addEventListener("click", function () {
        document.getElementById("offline").style.display = "none";
        document.getElementById("bar").style.display = "";
        go();
      });
      window.addEventListener("online", go);
      go();
    </script>
  </body>
</html>
`;

const outDir = join(root, "native-www");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), html);
console.log(`wrote native-www/index.html → ${liveUrl}`);
