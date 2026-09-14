# Compile live Manzi bank past 1378 — 2026-09-14

Branch: `cursor/compile-manzi-bank-f67b`

`#24`/`#25` shipped source patches; `#23` later compiled main to **1397**. The `#25` letter-F / LAG-4-Q6 facit still sat only in `manzi-100b-*.json` and was never merged into `data/questions.jsonl`. This PR runs `manzi:apply` + `import` and **commits** the compiled bank.

## BEFORE (`origin/main` @ `c4e6309`, after #23)

| Metric | Count |
|--------|------:|
| Live `manziCount` | **1397** (was 1378 before #23) |
| Live bank total | 1919 |
| `skippedIncomplete` | **260** |
| `questionsWithImageUrl` | 796 |
| `LAGSTIFNING-4-Q6` | skipped (`answer: ""`, option E = `I verkstad. F. SWEDAC F`) |
| `LETTERS` | A–E |
| HTM box `/workspace/taxiprov/manzi/htm-bkort` + `bkort-htm` | **not mounted** |

## AFTER (`npm run manzi:apply` && `npm run import`)

| Metric | Count |
|--------|------:|
| Live `manziCount` | **1398** (Δ +1 vs #23 / +20 vs stale 1378) |
| Live bank total | 1920 |
| `skippedIncomplete` | **259** |
| `questionsWithImageUrl` | **797** |
| `LAGSTIFNING-4-Q6` | **in bank**, answer **F** (SWEDAC), image `/media/pdf-pages/LAGSTIFNING-4/page-06.jpg` |
| PDF option demangles (already-kept) | LAG-1-Q27, LAG-2-Q4, LAG-7-Q27, S_KERHET-7-Q2009 (F split off E) |
| `LETTERS` | **A–F** |
| Fake SVGs | **0** |
| `bkort-classic-*` in live bank | **0** (still refused) |
| New HTM facit | **0** (box dirs absent — no invent) |

### Recovered this PR
- **`LAGSTIFNING-4-Q6`**: the scrape stored facit letter F on option E (`F. SWEDAC F`) and truncated `explanation_sv` to `Rätt svar: `. `#25` already had the PDF-verbatim split. Apply now **merges** (keeps the exam page).

### Deliberately not applied from `#24` patches
| id | why |
|----|-----|
| `bkort-classic-1..14` | empty options + unmoored letters; twin `kkalk-S-088` proves classic-5 A ≠ D |
| `S_KERHET-1-Q1` | source facit is **D**; option D missing — rewriting to C would invent |
| `LAGSTIFNING-8-Q53` | already repaired on main (#23); do not trim option D |
| `BKORT-Q*` / `korkortA-*` | HTM exams; Manzi wrote «Facit saknas i filen»; box not on this VM |

### HTM scanner
`scripts/recover-htm-bkort-facit.mjs` walks `htm-bkort` / `bkort-htm` (and körkort trees if present) and accepts a letter only when **exactly one** A–F facit pattern matches **and** that letter already exists among the row’s options. Wired into `npm run manzi:apply` / `import`. This run: dirs missing → 0.

## Land
```bash
npm run manzi:apply
npm run import
```

Constraints: Manzi SV verbatim · FLAG_SECURE untouched · no blur · no hybrid FR · no fake SVGs · no invented answers.
