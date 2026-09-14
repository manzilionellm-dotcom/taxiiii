# Law watch — bi-daily Swedish taxi / körkort updates

The product hook: about every two days, a Grok Bot routine scrapes new Swedish taxi and körkort law (SFS, Transportstyrelsen, Trafikverket, taxameter rules) and **drafts** QCM into this folder. Humans review. A PR merge is what enters the question bank.

The client never invents law. Chat stays corpus-only.

## Files

| Path | Role |
|---|---|
| `data/law-watch/latest.jsonl` | Draft QCM waiting for review (research schema) |
| `data/law-watch/meta.json` | `lastIngest`, `status` (`scaffold` / `draft` / `merged`) |
| `data/research-bank.jsonl` | Live research bank (never replaced by a draft file) |

## Schema (same as research items)

```json
{
  "id": "lw-2026-09-14-vilotid-11",
  "sv": "Hur lång dygnsvila måste en taxiförare minst ha? | Alt: A. 8 timmar | Alt: B. 11 timmar | Alt: C. 9 timmar | Alt: D. 10 timmar",
  "fr": "Quelle est la durée minimale de repos journalier (dygnsvila) ?",
  "type": "qcm",
  "source": "law-watch:SFS",
  "topic": "lagstiftning",
  "answer": "B",
  "trap": "8 timmar",
  "freq": "high"
}
```

Swedish `sv` is copied **verbatim** on compile. `fr` is the blue line, not the exam stem.

## Import (merge, do not replace)

`--research` **replaces** `data/research-bank.jsonl`. That is why this is refused:

```bash
npm run import -- --research data/law-watch/latest.jsonl
# error: Use --law-watch or npm run import:law-watch
```

Safe equivalents — append new ids only, then recompile:

```bash
npm run import:law-watch
npm run import -- --law-watch data/law-watch/latest.jsonl
```

`ingest-law-watch.mjs` skips blank / `#` / `//` lines, skips ids already in `research-bank.jsonl`, writes `data/law-watch/meta.json` (`status: merged`, `lastIngest` = today) only when at least one new row is added, and refreshes `lib/law-watch-meta.ts` so the in-app badge date stays in sync.

Empty `latest.jsonl` is valid: the script reports `0 added` and leaves the bank untouched.

## UI

Home / dashboards show a small **Banque à jour · 14 sept.** line under the teacher check-in. The date is `lastIngest` after a merge, otherwise the scaffold `updatedAt`. Hover shows the brouillon hint until a reviewed ingest lands. The client never scrapes or invents law.

## Bot routine (out of this repo)

1. Scrape official sources (no invented paragraphs).
2. Draft JSONL into `data/law-watch/latest.jsonl`.
3. Set `meta.json` `status` to `draft`.
4. Open a PR. A human merges. CI / `npm run import:law-watch` compiles.

Until the first reviewed ingest, this folder is a scaffold.
