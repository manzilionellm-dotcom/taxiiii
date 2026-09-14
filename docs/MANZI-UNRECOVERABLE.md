# Manzi unrecoverable QCMs (no on-disk facit)
Generated 2026-09-14. Terms intentionally excluded from QCM.
PC Shell machineId not routed in this executor (H7 + MANZI scans attempted; CopyToBox/sand PC tools unavailable here).

## Summary
- Recovered later compile PR: **1** live (`LAGSTIFNING-4-Q6` answer F + option F SWEDAC; LETTERS A–F) — now in `data/questions.json`
- Plus **4** PDF demangles already-kept (LAG-1-Q27, LAG-2-Q4, LAG-7-Q27, S_KERHET-7-Q2009)
- Remaining no-answer (Manzi pass): **61** (28 BKORT-Q + 28 korkortA + 5 KARTA Kvibille Q4)
- `S_KERHET-1-Q1` is in the live bank after 100c (answer **C** among A/B/C). Source `questions.jsonl` still records the scrape (facit D, option D lost); do not invent D back.
- Remaining answer-not-among-options in jsonl: **1** (`S_KERHET-1-Q1` scrape) — compiled row is the 100c recovery, not a guessed D
- Remaining lt2opts: **15**
- Terms excluded: **58**
- HTM box `htm-bkort` / `bkort-htm`: **not mounted** on this VM — scanner shipped, 0 letters invented
- `bkort-classic-12` (bashastighet 70 landsväg): SV landed with answer B; **no French** — no identical twin to copy. Do not invent FR.

## no-answer ids

`BKORT-Q10`, `BKORT-Q11`, `BKORT-Q12`, `BKORT-Q13`, `BKORT-Q14`, `BKORT-Q15`, `BKORT-Q16`, `BKORT-Q17`, `BKORT-Q18`, `BKORT-Q19`, `BKORT-Q20`, `BKORT-Q21`, `BKORT-Q22`, `BKORT-Q23`, `BKORT-Q24`, `BKORT-Q25`, `BKORT-Q26`, `BKORT-Q27`, `BKORT-Q28`, `BKORT-Q29`, `BKORT-Q3`, `BKORT-Q30`, `BKORT-Q31`, `BKORT-Q32`, `BKORT-Q33`, `BKORT-Q34`, `BKORT-Q35`, `BKORT-Q4`, `KARTA-KARTP2-Q4`, `KARTA-KARTP3-Q4`, `KARTA-KARTP6-Q4`, `KARTA-KARTP7-Q4`, `KARTA-KARTP8-Q4`, `korkortA-10`, `korkortA-11`, `korkortA-12`, `korkortA-13`, `korkortA-14`, `korkortA-15`, `korkortA-16`, `korkortA-17`, `korkortA-18`, `korkortA-19`, `korkortA-20`, `korkortA-21`, `korkortA-22`, `korkortA-23`, `korkortA-24`, `korkortA-25`, `korkortA-26`, `korkortA-27`, `korkortA-28`, `korkortA-29`, `korkortA-3`, `korkortA-30`, `korkortA-31`, `korkortA-32`, `korkortA-33`, `korkortA-34`, `korkortA-35`, `korkortA-4`

## lt2opts ids

`S_KERHET-1-Q27`, `research-0013`, `research-0122`, `research-0123`, `research-0124`, `research-0125`, `research-0126`, `research-0127`, `research-0128`, `research-0129`, `research-0130`, `research-0132`, `research-0133`, `research-0134`, `research-0135`

## term ids (excluded OK)

`research-0136`, `research-0137`, `research-0138`, `research-0139`, `research-0140`, `research-0141`, `research-0142`, `research-0143`, `research-0144`, `research-0145`, `research-0146`, `research-0147`, `research-0148`, `research-0149`, `research-0150`, `research-0151`, `research-0152`, `research-0153`, `research-0154`, `research-0155`, `research-0156`, `research-0157`, `research-0158`, `research-0159`, `research-0160`, `research-0161`, `research-0162`, `research-0163`, `research-0164`, `research-0165`, `research-0166`, `research-0167`, `research-0168`, `research-0169`, `research-0170`, `research-0171`, `research-0172`, `research-0173`, `research-0174`, `research-0175`, `research-0176`, `research-0177`, `research-0178`, `research-0179`, `research-0180`, `research-0181`, `research-0182`, `research-0183`, `research-0184`, `research-0185`, `research-0186`, `research-0187`, `research-0188`, `research-0189`, `research-0190`, `research-0191`, `research-0192`, `research-0193`

### Reason notes
- BKORT/korkortA: HTM exam only, no questionkey on box (EXTRACT-REPORT).
- KARTA *‑Q4 Kvibille: no s4/questionkey for kartp2/3/6/7/8.
- Research: empty or non-letter-mappable answers.
- S_KERHET-1-Q27: PDF answer D, empty image-only option texts.

## PC gold paths (2026-09-14 dig)

- `C:\Users\fortu\ManziQA` (MANZI / user fortu): **MT5 TrendZones QA**, not taxi QCM facit — do not treat as exam bank.
- Desktop `scan-banks.ps1` / `scan-banks-out.txt`: scanner only; box already has `/workspace/pc-dump/scan-banks.ps1`. Re-run on MANZI via parent Shell+CopyToBox if new taxi dumps appear.
- H7 `C:\Users\Admin\Desktop\manzi`: still the taxi treasure; already largely imported. Remaining BKORT/korkortA/Kvibille Q4 still lack questionkey facit on box.
- Cross-match remaining 186 non-term skips vs `/workspace/pc-dump/**/*.jsonl`: **0** new A–F answers with ≥2 options.
