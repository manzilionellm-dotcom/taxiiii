# Deploy — Vercel project `taxiiii`

Team: `manzis-projects-3add5703`  
Repo: `manzilionellm-dotcom/taxiiii`  
Framework: Next.js 16 App Router.

## First link

In the Vercel dashboard (team **manzi's projects**):

1. Add project **taxiiii** from this GitHub repo.
2. Framework preset: Next.js. Build: `npm run build`. Output: default.
3. Env (Production + Preview):
   - `OPENAI_API_KEY` **or** `AI_GATEWAY_API_KEY` (optional — chat works without)
   - `AI_MODEL` (optional)
   - `DATABASE_URL` only after you provision Postgres
   - `SESSION_SECRET` (required in production — signs cookies + media URLs)
   - `BLOB_READ_WRITE_TOKEN` (Vercel Blob store `store_VmgBARxpqkgZrT73` — **required** so `/api/media` can read private rasters). If this env var is missing on Production, exam PDF pages 404 and must not be shown as a gray « Examenssida » box. After setting it, run `npm run media:inventory-pdf` so `data/pdf-pages-on-blob.json` lists objects that actually exist (do not invent images).

The app builds and runs **without** a database. Progress is stored in the browser. Questions are loaded **per session** from `/api/questions` (the compiled bank stays on the server). The Android APK is a Capacitor WebView pointed at this host — see [ANDROID.md](ANDROID.md).

## Production checklist

- [ ] `npm run import:check` on the bank you ship
- [ ] Manzi drop imported (`npm run import -- --coordinator`) — see [MEDIA.md](MEDIA.md)
- [ ] `data/media-report.json`: rasters copied, Q with `imageUrl`, gul-linje is a real jpg or empty (never a fake SVG)
- [ ] Production images on Vercel Blob (`npm run media:upload`); `data/media-manifest.json` committed
- [ ] Images present under `content/media/` **or** Blob for every remaining `imageUrl`
- [ ] `data/translations.fr.json` filled for new ids (Swedish stays untouched)
- [ ] Optional: Neon Postgres + `npx prisma migrate deploy` when you persist accounts
- [ ] Auth: local profile is enough for the demo. Add Clerk/Auth.js later; do not block launch.

## RAG

1. Default: lexical search over every question + explanation + image path.
2. With a gateway/OpenAI key: same retrieval, then a low-temperature completion that may only use those excerpts.
3. Out-of-corpus queries return the localized refusal (`outOfCorpus`).
