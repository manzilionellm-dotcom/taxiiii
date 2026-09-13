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

The app builds and runs **without** a database. Progress is stored in the browser. Questions are loaded **per session** from `/api/questions` (the compiled bank stays on the server).

## Production checklist

- [ ] `npm run import:check` on the bank you ship
- [ ] Images present under `content/media/` for every `imageUrl`
- [ ] `data/translations.fr.json` filled for new ids (Swedish stays untouched)
- [ ] Optional: Neon Postgres + `npx prisma migrate deploy` when you persist accounts
- [ ] Auth: local profile is enough for the demo. Add Clerk/Auth.js later; do not block launch.

## RAG

1. Default: lexical search over every question + explanation + image path.
2. With a gateway/OpenAI key: same retrieval, then a low-temperature completion that may only use those excerpts.
3. Out-of-corpus queries return the localized refusal (`outOfCorpus`).
