# Owner / PC import drops

Put coordinator JSONL here. `npm run import` / `npm run import:check` reads every `*.jsonl` after `data/research-bank.jsonl` and before Manzi.

Taxi Ägare EXE dump (301 unique ids):

- `agare-mini-01.jsonl` … `agare-mini-31.jsonl`
- Do **not** restore `agare-exe-chunk1.jsonl` (truncated; the minis already cover those questions).

Rules:

- `corpus` must stay `owner-import` so the 42 `owner-seed` items are not rewritten.
- Options may use `text_sv`; the compiler maps that to `text`.
- `track: "owner"` becomes `trackHint`.
- Keep `explanation_sv` as the facit line. Missing `explanation_fr` is a one-line translation of that facit, never invented law.
- Dedupe is by `id` (first copy wins). Incomplete dump rows (missing answer key or fewer than 2 option texts) are skipped at compile time — do not invent stems, options, or facit.
