# Importera forskningskorpus + Manzi (Lionel)

Two files. **Both** are compiled. Manzi never deletes research.

```
data/research-bank.jsonl    ← YouTube + apps + public examples (seed + full mined file)
data/questions.jsonl        ← coordinator merge (1668 lines: Manzi + research copies)
data/questions.json         ← compiled merge (research first, then Manzi; incomplete keys skipped)
data/media-manifest.json    ← private Vercel Blob keys (~1993 rasters)
data/vocab/session-01.json … session-05-friday-mini.json
data/youtube-links.json
data/youtube-transcripts/*.json
docs/apps-report.md
docs/MEDIA.md               ← 2877 rasters / 389MB / Blob upload
```

Coordinator machine (this repo cannot see it until you drop the files):

- `/workspace/taxiprov/manzi/questions-merged.jsonl` — 1668 questions, ~132 with `imageUrl` like `media/T3/…/exam.php-filer/NNN.jpg`
- `/workspace/taxiprov/manzi/images/` — 2877 files, ~389 MB

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

# Lionel's coordinator drop (1668 JSONL + 2877 rasters):
npm run import -- --coordinator
# then (production): BLOB_READ_WRITE_TOKEN=… npm run media:upload
```

See [MEDIA.md](MEDIA.md) for the image pipeline. Never invent SVG drawings for exam items. PDF-only questions stay image-less.

Swedish in research `sv` and Manzi `stem_sv` is copied **word for word**.

The Android APK does not bundle the bank. After Vercel is live it loads questions from `/api/questions` on `native.serverUrl`. Drop the full JSONL here, compile, deploy — the APK picks up the new bank without a Play rebuild if you use the remote WebView host.

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

Unchanged: `id`, `topic`, `stem_sv`, `options`, `answer`, `explanation_sv`, `explanation_fr`, optional `imageUrl` (Manzi path `media/T3/…/exam.php-filer/NNN.jpg`), optional `imageCaption`, `source`. `imageUrl` is normalized to `/media/<logical-key>` and must point at a real raster. Decorative SVGs are stripped.

## Study order

1. Research + `freq: high` (vilotid 11/8, taxameter 12 vs 24 mån, gul heldragen linje, tidbok, prisräkning)
2. Other research
3. Manzi

## RAG

`/api/chat` indexes **compiled questions (research + Manzi)** and **YouTube study notes** (`data/youtube-transcripts/`, `data/rag-extras.json`). Out-of-corpus still refused.

## Vocab / cloze

`data/vocab/session-01` … `session-05-friday-mini` merge into `data/hard-words.json` on compile (taxiförarlegitimation, dygnsvila, taxameter, tidbok, jämförpris, …).

## Images

`--images` walks the **whole tree** (not a flat folder), copies every jpg/png/gif/webp **without resizing**, and links questions by `imageUrl`. Unlinked rasters are still copied. PDFs are skipped.

The 389 MB production set must **not** be committed. Upload with `npm run media:upload` to private Vercel Blob and commit `data/media-manifest.json`. Details: [MEDIA.md](MEDIA.md).

Never delete files on the Desktop/manzi machine — copy only.
