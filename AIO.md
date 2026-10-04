# AIO (Sprint) — source unique : aio.config.json

Site réel : **KörkortGO** (`https://taxiiii.vercel.app`), préparation au teoriprov suédois. Textes visibles et `llms.txt` en suédois. Ce n'est pas une offre IPTV : pas de prix, pas de débit, pas de tutoriel d'installation.

- `npm run aio:llms` régénère `public/llms.txt`
- `npm run build && npm start` puis `node scripts/aio-check.mjs http://localhost:3000/` : preuve sur HTML brut (Citation Hooks 40–60 mots, JSON-LD parsable, alt, transcription vidéo, `/llms.txt`)
- Les h3 de la FAQ + `<p>` sont rendus par `components/aio-public.tsx` (Server Component). Le JSON-LD est dans `app/page.tsx`. Les deux sont dans le HTML sans JavaScript.
- `plans` et `tutorials` sont `null` : pas de Product, pas de HowTo.
