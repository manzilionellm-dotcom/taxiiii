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

const html = `<!DOCTYPE html>
<html lang="sv">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${appName} — ${signature}</title>
    <style>
      :root { color-scheme: light; }
      html, body { height: 100%; margin: 0; }
      body {
        font-family: ui-sans-serif, system-ui, sans-serif;
        background: #1f3d2b;
        color: #fffdf8;
        display: grid;
        place-items: center;
        padding: 2rem;
      }
      main { max-width: 22rem; text-align: center; }
      h1 { font-family: Georgia, "Source Serif 4", serif; font-size: 2rem; margin: 0 0 0.35rem; }
      .sig { opacity: 0.72; font-weight: 600; margin-bottom: 1.25rem; }
      p { line-height: 1.45; opacity: 0.92; }
      a { color: #fffdf8; }
    </style>
  </head>
  <body>
    <main>
      <h1>${appName}</h1>
      <p class="sig">${signature}</p>
      <p>${slogan}</p>
      <p>${keyMessage}</p>
      <p><a href="${liveUrl}">${liveUrl.replace("https://", "")}</a></p>
    </main>
    <script>
      location.replace(${JSON.stringify(liveUrl)});
    </script>
  </body>
</html>
`;

const outDir = join(root, "native-www");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), html);
console.log(`wrote native-www/index.html → ${liveUrl}`);
