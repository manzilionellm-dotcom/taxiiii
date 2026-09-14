/**
 * Shared SV token + inflection helpers for the compile-time lexicon
 * and the client glossary lookup. Keep this file dependency-free.
 */

export const GLOSS_HOLD_MS = 430;

const WORD_RE = /[\p{L}]+(?:['’-][\p{L}]+)?|[^\p{L}]+/gu;
const LETTER_RE = /^[\p{L}]+(?:['’-][\p{L}]+)?$/u;
const OPTION_MARKER = /^[a-e]$/i;
const SINGLE_LETTER_WORDS = new Set(["i", "å", "ö"]);

const SUFFIXES = [
  "ningarna",
  "ningen",
  "ningarna",
  "heterna",
  "heten",
  "heter",
  "ningarna",
  "ningarna",
  "andet",
  "andet",
  "erna",
  "arna",
  "orna",
  "ande",
  "ende",
  "ades",
  "ades",
  "ade",
  "ate",
  "are",
  "ast",
  "aste",
  "ens",
  "ets",
  "ers",
  "ars",
  "ors",
  "na",
  "en",
  "et",
  "er",
  "ar",
  "or",
  "at",
  "te",
  "de",
  "ts",
  "ns",
  "s",
  "t",
  "n",
  "a",
];

export function normalizeToken(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("sv")
    .normalize("NFC")
    .replace(/^[“”"'(«]+|[”"'’)».,;:!?…]+$/g, "");
}

export function stripPunctuation(value) {
  return normalizeToken(value).replace(/[^\p{L}\p{N}]+/gu, "");
}

export function isGlossableWord(token) {
  const raw = String(token || "").trim();
  if (!raw) return false;
  if (/^\d+([.,]\d+)?$/.test(raw)) return false;
  if (OPTION_MARKER.test(raw)) return false;
  if (raw.length === 1 && !SINGLE_LETTER_WORDS.has(raw.toLocaleLowerCase("sv"))) return false;
  return LETTER_RE.test(raw);
}

export function splitGlossPieces(text) {
  const pieces = [];
  const source = String(text ?? "");
  if (!source) return pieces;
  for (const match of source.matchAll(WORD_RE)) {
    const value = match[0];
    pieces.push({
      text: value,
      word: LETTER_RE.test(value),
    });
  }
  return pieces;
}

export function lemmaCandidates(token) {
  const key = normalizeToken(token);
  if (!key) return [];
  const seen = new Set();
  const out = [];
  const push = (value) => {
    if (!value || value.length < 2 || seen.has(value)) return;
    seen.add(value);
    out.push(value);
  };
  push(key);
  push(key.replace(/^[“”"']+|[”"']+$/g, ""));

  const folded = key.normalize("NFD").replace(/\p{M}/gu, "");
  if (folded !== key) push(folded);

  for (const suffix of SUFFIXES) {
    if (key.length > suffix.length + 2 && key.endsWith(suffix)) {
      push(key.slice(0, -suffix.length));
    }
  }

  if (key.endsWith("ningen") && key.length > 8) push(key.slice(0, -3));
  if (key.endsWith("ningen") && key.length > 8) push(`${key.slice(0, -3)}`);
  if (key.endsWith("heter") && key.length > 6) push(key.slice(0, -2));
  if (key.endsWith("ligt") && key.length > 6) {
    push(`${key.slice(0, -1)}`);
    push(`${key.slice(0, -4)}lig`);
  }
  if (key.endsWith("isk") || key.endsWith("iskt")) {
    push(key.replace(/t$/, ""));
  }
  if (key.includes("-")) {
    for (const part of key.split("-")) push(part);
  }
  if (key.endsWith("ningen") && key.length > 8) {
    const stem = key.slice(0, -6);
    push(stem);
    push(`${stem}a`);
    push(`${stem}ning`);
  } else if (key.endsWith("ning") && key.length > 6) {
    const stem = key.slice(0, -4);
    push(stem);
    push(`${stem}a`);
  }
  if (key.endsWith("heten") && key.length > 7) {
    push(key.slice(0, -5));
    push(key.slice(0, -2));
  } else if (key.endsWith("het") && key.length > 5) {
    push(key.slice(0, -3));
  }
  if (key.endsWith("ande") && key.length > 6) {
    push(`${key.slice(0, -4)}a`);
    push(key.slice(0, -4));
  }
  if (key.endsWith("else") && key.length > 6) {
    push(key.slice(0, -4));
    push(`${key.slice(0, -4)}a`);
  }

  return out;
}

export function expandLemmaForms(lemma) {
  const base = normalizeToken(lemma);
  if (!base) return [];
  const forms = new Set([base]);
  const add = (value) => {
    if (value && value.length >= 2) forms.add(value);
  };

  for (const suffix of [
    "en",
    "et",
    "n",
    "t",
    "ar",
    "er",
    "or",
    "na",
    "arna",
    "erna",
    "orna",
    "ens",
    "ets",
    "s",
    "a",
    "e",
    "are",
    "ast",
    "aste",
    "ade",
    "at",
    "te",
    "de",
    "t",
    "s",
    "ande",
    "ende",
    "ning",
    "ningen",
    "ningar",
    "ningarna",
    "het",
    "heten",
    "heter",
  ]) {
    add(base + suffix);
  }

  if (base.endsWith("a") && base.length > 3) {
    const stem = base.slice(0, -1);
    add(stem);
    add(`${stem}er`);
    add(`${stem}ar`);
    add(`${stem}de`);
    add(`${stem}te`);
    add(`${stem}ade`);
    add(`${stem}at`);
    add(`${stem}t`);
    add(`${stem}s`);
    add(`${base}s`);
    add(`${base}nde`);
    add(`${stem}ande`);
  }

  if (base.endsWith("e") && base.length > 3) {
    add(base.slice(0, -1));
  }

  return [...forms];
}

export function parseSeedTable(table) {
  const entries = {};
  for (const rawLine of String(table).split(/\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const tab = line.indexOf("\t");
    if (tab === -1) continue;
    const sv = normalizeToken(line.slice(0, tab));
    const fr = line.slice(tab + 1).trim();
    if (!sv || !fr) continue;
    if (!entries[sv]) entries[sv] = fr;
  }
  return entries;
}
