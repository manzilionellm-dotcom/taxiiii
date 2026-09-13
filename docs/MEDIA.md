# Manzi exam images (real rasters only)

Lionel’s coordinator box already has the drop. This repo **cannot see that machine** — run the commands below on it (or copy the two paths into this workspace) so every authentic exam photo is imported and linked.

## Coordinator paths (source of truth)

| What | Path | Size |
|---|---|---|
| Merged questions | `/workspace/taxiprov/manzi/questions-merged.jsonl` | **1668** lines |
| Image tree | `/workspace/taxiprov/manzi/images/` | **2877** files, ~**389 MB** (`T1/` `T2/` `T3/` `bok3/` `utbildning/` `teori…`) |

About **225** questions carry `imageUrl` values: **132** Manzi rasters like `media/T3/lagstiftning/exam.php-filer/101.jpg`, plus **93** authentic PDF-page JPEGs for Lagstiftning / Säkerhet stems that say «på bilden» (`/media/pdf-pages/LAGSTIFNING-{n}/page-{qq}.jpg` and `/media/pdf-pages/S_KERHET-{n}/page-{qq}.jpg`). Mapping: `data/pdf-page-links.json`. **Never invent a drawing** to fill a gap.

`rs-yt-lag1-gul-linje` (research / YouTube): use a real Manzi Lagstiftning photo of *gul heldragen linje* **if** the imported bank has one. If it does not, **show no image**. The decorative `gul-heldragen-linje.svg` is deleted and must not come back.

## Do not commit 389 MB to git

`content/media/*.svg` are demo illustrations for the tiny sample bank only. The full Manzi tree is gitignored. Production uses **Vercel Blob** (private) + signed `/api/media/...` + canvas watermark. Original resolution is kept — no resize, no re-encode.

## One-shot import on the coordinator

```bash
cd /path/to/taxiiii

npm run import -- --coordinator
# same as:
# npm run import -- \
#   --manzi /workspace/taxiprov/manzi/questions-merged.jsonl \
#   --images /workspace/taxiprov/manzi/images
```

This:

1. Copies the 1668-line JSONL → `data/questions.jsonl` (research bank untouched)
2. Walks the 2877-file tree and copies **every raster** (jpg/jpeg/png/gif/webp) into `content/media/…` preserving `T3/…/exam.php-filer/NNN.jpg`
3. Rewrites each question `imageUrl` to `/media/<logical-key>` when the file exists
4. Drops broken `imageUrl`s instead of showing a fake
5. Writes `data/media-report.json` with the checklist below
6. Attaches a Manzi gul-linje raster to `rs-yt-lag1-gul-linje` when a stem match exists

Env overrides: `MANZI_JSONL`, `MANZI_IMAGES`.

## Upload to Vercel Blob (required for production)

1. In the Vercel project **taxiiii**, Storage → Blob store `store_VmgBARxpqkgZrT73` (already has the **2086** private rasters: 1993 T3/… + 93 `pdf-pages/`).
2. Set `BLOB_READ_WRITE_TOKEN` on Production + Preview (Settings → Environment Variables). Locally: `vercel env pull` or paste the token.
3. From the machine that has the 389 MB tree **after** `npm run import -- --coordinator`:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_… npm run media:upload -- --from content/media
```

Writes `data/media-manifest.json` (logical key → private blob URL + byte size). **Commit the manifest**, not the binaries. Redeploy. `/api/media/T3/…/101.jpg` reads local files first, then Blob, and returns the **original bytes**.

## Checklist after a drop

From `data/media-report.json` / the import log:

- [ ] `rastersCopied` ≈ 2877 (minus PDFs / non-images)
- [ ] `questionsTotal` = compiled research + Manzi QCM that have an answer key (source JSONL is 1668 + research bank)
- [ ] `questionsWithImageUrl` = Manzi rasters linked to compiled items (`/media/…`, never `gul-heldragen-linje.svg`)
- [ ] `data/media-manifest.json` ≈ **2086** private Blob entries (1993 T3/… + 93 PDF pages; commit the manifest, not the binaries)
- [ ] `questionsMissingFile` explained (research-* without a PDF page, or path mismatch)
- [ ] `gulLinje` is a `/media/T3/…jpg` **or** `null` — never `gul-heldragen-linje.svg`

```bash
npm run test:media
npm run check:corpus
npm run build
```

## App display

- Nested Manzi paths are first-class: `/api/media/T3/lagstiftning/exam.php-filer/101.jpg?exp=&sig=`
- Canvas watermark stays. Source pixels stay full-resolution (`naturalWidth` × `naturalHeight`).
- Captions run through `sanitizeCaption` so `·` / `♦` between Swedish words become spaces, and `Ã¥` → `å`.
