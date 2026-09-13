# Importera Manzis frågebank (Lionel)

Swedish stems, options and explanations are **never rewritten**. The importer copies JSONL lines as-is after schema validation.

## Drop path

```
taxiiii/
  data/questions.jsonl      ← replace this file with the full ~1475-line bank
  public/media/             ← images referenced by imageUrl
```

Until the full bank is uploaded, `data/questions.jsonl` holds a **sample that uses the same schema and UI**.

## Schema (one JSON object per line)

```json
{
  "id": "string",
  "topic": "lagstiftning|sakerhet|karta|bkort",
  "stem_sv": "...",
  "options": [{ "letter": "A", "text": "..." }],
  "answer": "A",
  "explanation_sv": "...",
  "explanation_fr": "...",
  "imageUrl": "/media/optional-file.jpg",
  "source": "manzi"
}
```

Rules:

- `topic` `bkort` → Permis B. `lagstiftning` / `sakerhet` / `karta` → Permis taxi.
- Keep `stem_sv`, `options[].text`, `explanation_sv` **word for word**.
- `imageUrl` should be a public path, usually `/media/<filename>`.
- Extra fields are stripped on import. Do not put French stems in the JSONL unless you also add `data/translations.fr.json`.

## Commands

```bash
# validate only
npm run import:check

# copy bank into the app + write data/questions.json
npm run import -- /path/to/manzi-bank.jsonl

# same + copy an images folder into public/media/
npm run import -- /path/to/manzi-bank.jsonl --images /path/to/manzi-images
```

The script:

1. Parses JSONL (skips blank lines and `#` comments).
2. Validates required fields and that `answer` exists in `options`.
3. Rejects duplicate ids.
4. Writes `data/questions.jsonl` and `data/questions.json` **verbatim** for the Swedish fields.
5. Optionally copies `.svg .png .jpg .jpeg .webp .gif` into `public/media/`.

## French UI overlay

Question text on screen is always the original `stem_sv` (black). The blue line under it comes from `data/translations.fr.json` keyed by `id`. If an id is missing, the UI shows a placeholder — it still never changes the Swedish.

After a full import, add translations:

```json
{
  "your-id": {
    "stem": "French stem",
    "options": { "A": "...", "B": "..." }
  }
}
```

`explanation_fr` already lives on each JSONL row.

## Images

- Keep filenames stable so `imageUrl` still matches.
- Do not delete anything on Lionel’s Desktop/manzi machine — copy into this repo only.
- Dual coding: the question screen shows the image when `imageUrl` is set.

## Vector index (optional)

Without `OPENAI_API_KEY` / `AI_GATEWAY_API_KEY` the chat uses scripted corpus search over **all** questions + explanations + image paths.

With a key, `/api/chat` still retrieves from the same corpus first and instructs the model to answer only from those excerpts. To store embeddings in Postgres, enable pgvector and use `prisma/schema.prisma` → `QuestionEmbedding`.
