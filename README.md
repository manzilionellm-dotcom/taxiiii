# KörkortGO — by MZ

Visible brand is **KörkortGO** (`by MZ`). Slogan: **Förstå teorin. Klara provet.** Categories: **Körkort**, **Taxi**, **Taxi Företag**. Key message: **Lär dig på svenska. Förstå på ditt språk.**

All of those strings live in **[`lib/branding.ts`](lib/branding.ts)** — change them there, not in UI screens. Repo / npm / Vercel project name can stay `taxiiii`.

Professional Swedish teoriprov prep for **Körkort** (permis B), **Taxi** (taxiförarlegitimation) and **Taxi Företag** (taxitrafiktillstånd / taxiägare). Bilingual SV + FR. Linked Vercel project: `manzis-projects-3add5703/taxiiii`.

This is not a toy landing page. It is a working vertical slice:

- Separate **Körkort**, **Taxi** and **Taxi Företag** journeys, scores, and stats
- Question screen: Swedish **black**, French **blue**, hard words **bold red** + cloze
- Taxi **Calcul** (körekonomi, trip price, distance/time, dygnsvila)
- **IA** chat grounded on the question corpus (refuses out-of-bank answers)
- Readiness score; at **≥ 95%** shows « Bravo, tu es prêt à passer l'examen. » / « Bravo, du är redo att göra provet. »
- SRS 5–10 min sessions, interleaving, fragile-profile mode
- **Taxi Företag** (`/owner`) — taxitrafiktillstånd seed (public Transportstyrelsen / SFS), own progress keys

## Content rule

Two corpora, both kept:

1. **Research** (`data/research-bank.jsonl`) — high-frequency YouTube/SFS seed plus the full mined coordinator file. Schema uses `sv` / `fr` / `type` / `source` / `topic` / `answer` / `trap` / `freq`. Swedish `sv` stays intact. Terms without a QCM key stay in the JSONL but are not compiled.
2. **Manzi** (`data/questions.jsonl`) — coordinator merge (**1668** lines). `stem_sv` / options / explanations stay word for word. Exam photos resolve from `data/media-manifest.json` + private Vercel Blob (see [docs/MEDIA.md](docs/MEDIA.md)). Records without an answer key or with fewer than two options are skipped — we do not invent keys or SVGs.

`npm run import` **compiles both**. A larger Manzi file must not drop research. Study order: one of each high-frequency trap (gul heldragen linje, taxameter 24 mån, vilotid 11/8, tidbok, prisräkning) **then** other research **then** Manzi.

Vocab sessions `data/vocab/session-01` … `session-05-friday-mini` seed cloze. YouTube notes in `data/youtube-transcripts/` are in the RAG index (Calcul + chat), not QCM-only.

Lionel: **[docs/IMPORT.md](docs/IMPORT.md)** · competitor map **[docs/apps-report.md](docs/apps-report.md)**.

## Scripts

```bash
npm install
npm run import:check
npm run check:corpus
# compile + assert data/research-bank.jsonl + data/questions.jsonl are both kept

npm run import -- --manzi /path/manzi.jsonl
npm run import -- --research /path/research-bank.jsonl --images /path/media
npm run import -- --coordinator
# /workspace/taxiprov/manzi/questions-merged.jsonl + images/ (1668 + 2877)
npm run test:media
npm run dev
npm run build
```

## Env

Copy `.env.example`. All keys are optional for the demo.

| Variable | Role |
|---|---|
| `OPENAI_API_KEY` | Chat completions (direct OpenAI) |
| `AI_GATEWAY_API_KEY` | Same via [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) |
| `AI_MODEL` | Gateway model id, default `openai/gpt-4.1-mini` |
| `DATABASE_URL` | Optional Postgres (Prisma + pgvector schema in `prisma/schema.prisma`) |
| `SESSION_SECRET` | HMAC for session cookies + short-lived media URLs (dev fallback exists) |
| `BLOB_READ_WRITE_TOKEN` | Private Vercel Blob for the 389MB Manzi image tree (`npm run media:upload`) |

Without a key, `/api/chat` still answers from the corpus using scripted search.

## Architecture

| Path | Purpose |
|---|---|
| `data/research-bank.jsonl` | Research corpus (YouTube + apps + public law) |
| `data/questions.jsonl` | Manzi QCM (never overwrites research) |
| `data/pdf-page-links.json` | 93 Lagstiftning/Säkerhet «på bilden» → PDF page rasters |
| `data/media-manifest.json` | Private Blob keys (~2086) |
| `data/questions.json` | Compiled merge — research first |
| `data/vocab/` | Cloze sessions 01–05-friday-mini |
| `data/youtube-links.json` + `youtube-transcripts/` | Calcul + RAG |
| `data/translations.fr.json` | Blue FR line under the original SV stem |
| `data/hard-words.json` | Cloze + red gloss dictionary |
| `content/media/` | Question images (signed `/api/media/…`, nested Manzi paths; full tree on Blob, not git) |
| `lib/branding.ts` | User-facing name, signature, slogan, categories |
| `lib/progress/` | localStorage attempts, SM-2 SRS, readiness |
| `lib/rag/` | Corpus index + grounded chat |
| `prisma/schema.prisma` | Future User / Question / SRS / chat / embeddings |

Auth for the MVP is a local profile (onboarding + settings). Progress tables are **per section** (`b` vs `taxi`). Stripe is not present in this repo; nothing to keep.

i18n dictionaries live in `lib/i18n/{sv,fr}.ts` and pull brand/category strings from `lib/branding.ts`. Add `ar` later by extending `LOCALES` and a new dictionary — question content stays Swedish-first.

## Android APK

Installable debug APK (app id `se.mz.korkortgo`, label **KörkortGO**). The repo is private so anonymous GitHub raw links 404.

**Public download:** https://gofile.io/d/N86Btgvw

1. On the phone enable **Install unknown apps** for the browser/Files app.
2. Download the APK and open it → Install.
3. The WebView loads `https://taxiiii.vercel.app` (override with `CAPACITOR_SERVER_URL`). Screenshot capture is blocked with **FLAG_SECURE**. Merge PR #1 so production is KörkortGO (not the blank starter).

Rebuild: `npm run apk` (needs Android SDK + JDK). Full steps: [docs/ANDROID.md](docs/ANDROID.md).

## Deploy

See [docs/DEPLOY.md](docs/DEPLOY.md). Framework: Next.js 16 on Vercel project **taxiiii**.

## Content protection

No web app can **100% block OS-level screenshots**, especially on desktop (Print Screen, OS snipping tools, another phone pointed at the display). KörkortGO maximizes friction; it does not claim “screenshot impossible”.

Shipped on quiz, mock exam, Calcul, cloze, and tutor chat:

1. **Copy / select** — `user-select: none` on stems, options, explanations, and images; context menu disabled on protected views; common copy / save / print shortcuts blocked (inputs still work).
2. **Visibility / capture** — leaving the tab, blurring the window, printing, or Print Screen hides the question behind a black overlay until you confirm. Exam mode waits a short beat before “continue” (soft re-auth).
3. **Images** — files live in `content/media/` (not hotlinked as permanent `/media/…` CDN paths). The client fetches a **short-lived signed URL**, draws on a **canvas**, and paints a faint watermark (`name` / `email` / session id). Direct `/media/*` returns 403.
4. **Scrape friction** — the full bank is `server-only`. Clients receive a **per-session slice** (study 6–10, exam 8) from `/api/questions`. Meta mode returns ids + topics only. APIs are rate-limited. `questions.jsonl` is not in `public/`.
5. **Headers** — CSP (`frame-ancestors 'none'`), `X-Frame-Options: DENY`, `Cache-Control: private, no-store` on APIs and media.
6. **Legal UX** — ToS on onboarding / settings / nav: redistribution of the bank is forbidden. Rapid hide/capture patterns show a soft warning.
7. **Android APK** — Capacitor WebView + `FLAG_SECURE` (see [docs/ANDROID.md](docs/ANDROID.md)). iOS capture APIs are still future.

Limits: a determined user can still photograph the screen, dump the session JSON from DevTools, or ignore the overlay. That is why the README does not promise a lock, only layered friction. Details: [docs/CONTENT-PROTECTION.md](docs/CONTENT-PROTECTION.md).
