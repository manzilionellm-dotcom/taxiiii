# Körklart — teoriprov B & taxi

Professional Swedish teoriprov prep for **körkort B** and **taxiförarlegitimation**. Bilingual SV + FR. Linked Vercel project: `manzis-projects-3add5703/taxiiii`.

This is not a toy landing page. It is a working vertical slice:

- Separate **Permis B** and **Permis taxi** journeys, scores, and stats
- Question screen: Swedish **black**, French **blue**, hard words **bold red** + cloze
- Taxi **Calcul** (körekonomi, trip price, distance/time, dygnsvila)
- **IA** chat grounded on the question corpus (refuses out-of-bank answers)
- Readiness score; at **≥ 95%** shows « Bravo, tu es prêt à passer l'examen. » / « Bravo, du är redo att göra provet. »
- SRS 5–10 min sessions, interleaving, fragile-profile mode
- Taxiägare / business nav item is **coming soon**

## Content rule

Two corpora, both kept:

1. **Research** (`data/research-bank.jsonl`) — Lionel’s early bank (~193 when complete): YouTube Lagstiftning del 1–2, prisresan, Karta Taxi 2; teori-taxi.com; TaxiKortet; taxi-prov.se vilotid; Trafikverket. Schema uses `sv` / `fr` / `type` / `source` / `topic` / `answer` / `trap` / `freq`. Swedish `sv` stays intact.
2. **Manzi** (`data/questions.jsonl`) — full QCM (~1475). `stem_sv` / options / explanations stay word for word.

`npm run import` **compiles both**. A larger Manzi file must not drop research. Study order: high-frequency research (vilotid 11/8, taxameter 24 mån fälla, gul heldragen linje, tidbok, prisräkning) **then** Manzi.

Until Lionel drops the full ~193-line `research-bank.jsonl`, the repo ships a high-frequency seed (YouTube + teori-taxi / TaxiKortet / taxi-prov.se / Trafikverket / SFS). Replace the file; do not merge research into Manzi’s JSONL.

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

Without a key, `/api/chat` still answers from the corpus using scripted search.

## Architecture

| Path | Purpose |
|---|---|
| `data/research-bank.jsonl` | Research corpus (YouTube + apps + public law) |
| `data/questions.jsonl` | Manzi QCM (never overwrites research) |
| `data/questions.json` | Compiled merge — research first |
| `data/vocab/` | Cloze sessions 01–05-friday-mini |
| `data/youtube-links.json` + `youtube-transcripts/` | Calcul + RAG |
| `data/translations.fr.json` | Blue FR line under the original SV stem |
| `data/hard-words.json` | Cloze + red gloss dictionary |
| `public/media/` | Dual-coding images (`imageUrl`) |
| `lib/progress/` | localStorage attempts, SM-2 SRS, readiness |
| `lib/rag/` | Corpus index + grounded chat |
| `prisma/schema.prisma` | Future User / Question / SRS / chat / embeddings |

Auth for the MVP is a local profile (onboarding + settings). Progress tables are **per section** (`b` vs `taxi`). Stripe is not present in this repo; nothing to keep.

i18n dictionaries live in `lib/i18n/{sv,fr}.ts`. Add `ar` later by extending `LOCALES` and a new dictionary — question content stays Swedish-first.

## Deploy

See [docs/DEPLOY.md](docs/DEPLOY.md). Framework: Next.js 16 on Vercel project **taxiiii**.
