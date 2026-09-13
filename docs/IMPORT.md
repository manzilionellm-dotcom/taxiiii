# Importera forskningskorpus + Manzi (Lionel)

Two files. **Both** are compiled. Manzi never deletes research.

```
data/research-bank.jsonl    ← YouTube + apps + public examples (~193 when full)
data/questions.jsonl        ← Manzi bank (~1475 when full)
data/questions.json         ← compiled merge (research first, then Manzi)
data/vocab/session-01.json … session-05-friday-mini.json
data/youtube-links.json
data/youtube-transcripts/*.json
docs/apps-report.md
```

Do **not** drop `research-bank.jsonl` when you add the large Manzi file.

## Commands

```bash
npm run import:check
# validate + compile both banks

npm run import -- --manzi /path/to/manzi.jsonl
# copies Manzi only, recompiles, leaves research-bank.jsonl alone

npm run import -- --research /path/to/research-bank.jsonl
# copies research only (full ~193), leaves Manzi alone

npm run import -- --manzi /path/manzi.jsonl --research /path/research.jsonl --images /path/media
```

Swedish in research `sv` and Manzi `stem_sv` is copied **word for word**.

## Research schema

```json
{
  "id": "rs-yt-lag1-taxameter-24",
  "sv": "Hur lång tid får det högst vara mellan besiktning av en taxameter? | Alt: A. 6 månader | Alt: B. 18 månader | Alt: C. 12 månader | Alt: D. 24 månader",
  "fr": "Quel délai maximal entre deux contrôles du taximètre ?",
  "type": "qcm",
  "source": "youtube:BFwxXv3hujU+teori-taxi.com",
  "topic": "lagstiftning",
  "answer": "C",
  "trap": "24 månader",
  "freq": "high",
  "youtubeId": "BFwxXv3hujU"
}
```

Normalize on import:

- `sv` → `stem_sv` (text before `| Alt:`)
- `| Alt: A. …` → `options`
- `fr` → `data/translations.fr.json` (blue line)
- `corpus` = `research`
- `freq` / `trap` / `source` kept

Until the full ~193-line file is dropped, the repo ships a **high-frequency seed** (YouTube 11/8, taxameter 24 mån, gul linje, tidbok, prisräkning, plus official SFS/Trafikverket). Replace `data/research-bank.jsonl` with the full mined file — do not merge it into Manzi’s JSONL.

## Manzi schema

Unchanged: `id`, `topic`, `stem_sv`, `options`, `answer`, `explanation_sv`, `explanation_fr`, optional `imageUrl`, `source`.

## Study order

1. Research + `freq: high` (vilotid 11/8, taxameter 12 vs 24 mån, gul heldragen linje, tidbok, prisräkning)
2. Other research
3. Manzi

## RAG

`/api/chat` indexes **compiled questions (research + Manzi)** and **YouTube study notes** (`data/youtube-transcripts/`, `data/rag-extras.json`). Out-of-corpus still refused.

## Vocab / cloze

`data/vocab/session-01` … `session-05-friday-mini` merge into `data/hard-words.json` on compile (taxiförarlegitimation, dygnsvila, taxameter, tidbok, jämförpris, …).

## Images

`--images` copies into `content/media/` (session-signed `/api/media`, not a public CDN folder). Never delete files on the Desktop/manzi machine — copy only.
