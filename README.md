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

Manzi’s bank is imported **word for word**. Do not reformulate, summarize, or drop Swedish stems, options, or explanations. Image paths stay attached.

Until the full ~1475 items are dropped in, `data/questions.jsonl` is a **same-schema sample** so the pipeline and UI work end-to-end.

Lionel: see **[docs/IMPORT.md](docs/IMPORT.md)**.

## Scripts

```bash
npm install
npm run import:check          # validate data/questions.jsonl
npm run import -- <file.jsonl> [--images <dir>]
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
| `data/questions.jsonl` | Source of truth (Manzi schema) |
| `data/questions.json` | Generated for the app import |
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
