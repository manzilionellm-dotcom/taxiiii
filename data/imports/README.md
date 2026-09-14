# Owner / PC import drops

Put coordinator JSONL here. `npm run import` / `npm run import:check` reads every `*.jsonl` after `data/research-bank.jsonl` and before Manzi.

Expected Taxi Ägare EXE dump (301 QCMs):

- `agare-exe-part1.jsonl`
- `agare-exe-part2.jsonl`

Rules:

- `corpus` must stay `owner-import` so the 42 `owner-seed` items are not rewritten.
- Options may use `text_sv`; the compiler maps that to `text`.
- `track: "owner"` becomes `trackHint`.
- Keep `explanation_sv` as the facit line. Missing `explanation_fr` is a one-line translation of that facit, never invented law.
- Dedupe is by `id` (first copy wins).
