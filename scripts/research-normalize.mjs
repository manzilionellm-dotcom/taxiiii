/** Normalize Lionel's research-bank schema → app question model. Swedish `sv` is never rewritten. */

import { sanitizeCaption, stripFakeExamArt, toImageUrl } from "../lib/media/paths.mjs";

const TOPICS = new Set(["lagstiftning", "sakerhet", "karta", "bkort"]);
const LETTERS = ["A", "B", "C", "D", "E"];

/** Coordinator drop uses finer topics than the four exam tracks. */
export const TOPIC_ALIASES = {
  vilotid: "lagstiftning",
  pris: "lagstiftning",
  vagskyltar: "sakerhet",
  bemotande: "sakerhet",
  fordonskannedom: "sakerhet",
};

export function parseJsonl(text) {
  const issues = [];
  const records = [];
  text.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) return;
    try {
      records.push(JSON.parse(trimmed));
    } catch {
      issues.push(`line ${index + 1}: invalid JSON`);
    }
  });
  return { records, issues };
}

export function splitSvAlts(sv) {
  const parts = String(sv).split(/\s*\|\s*Alt:\s*/);
  const stem = parts[0].trim();
  const options = [];
  for (const chunk of parts.slice(1)) {
    const match = chunk.match(/^\s*([A-E])\.\s*(.+)$/s);
    if (match) options.push({ letter: match[1], text: match[2].trim() });
  }
  return { stem, options };
}

export function stemKey(text) {
  return String(text || "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function recordStem(record) {
  if (!record) return "";
  if (typeof record.stem_sv === "string" && record.stem_sv.trim()) return record.stem_sv.trim();
  if (typeof record.sv === "string" && record.sv.trim()) return splitSvAlts(record.sv).stem;
  if (typeof record.sv_original === "string" && record.sv_original.trim()) {
    return splitSvAlts(record.sv_original).stem;
  }
  return "";
}

export function mapTopic(topic) {
  if (!topic) return "lagstiftning";
  if (TOPICS.has(topic)) return topic;
  return TOPIC_ALIASES[topic] || null;
}

export function mapFreq(freq) {
  if (freq == null || freq === "") return undefined;
  const value = String(freq).toLowerCase().trim();
  if (["high", "haute", "hög", "h"].includes(value)) return "high";
  if (["medium", "moyenne", "medel", "m"].includes(value)) return "medium";
  if (["low", "basse", "låg", "l"].includes(value)) return "low";
  return undefined;
}

export function coerceTrap(trap) {
  return typeof trap === "string" && trap.trim() ? trap.trim() : undefined;
}

/**
 * French coaching notes / scrape leftovers that must never become exam language.
 * Swedish stems may use «à» (à 6,5 h) — that alone is not a leak.
 */
const FRENCH_EXAM_LEAK =
  /\b(?:ne pas|ne délivre|n['’]est|ce n['’]|seulement|chauffeur|fréquence|taximètre|responsabilité|traduction littérale|piège fréquent|oublier|ignorer les|prise en charge|localité|carte de ville|confondre|confondu|contrôle technique|renforcée|exempté|coordonnées|quadrillage|découpage|bonne réponse|mots-clés|à quelle|qui est|que faire|quand utiliser|aussi appelé|agence qui|éco-conduite|santé-sécurité|code de la route|repos journalier|carnet de temps|affichage des|prix de comparaison|titulaire de|transport scolaire|transport adapté|profondeur des|pneus cloutés|index des noms|organisme d|loi sur le|astreinte|feuille de route|atelier accrédit|position latérale|premiers secours|pas seulement|chercher une|petite localité|convertir heures|au total ne suffit|les deux doivent|plus gros bloc|s['’]enregistrer|à renouveler|très fréquent|règles ceinture|souvent (?:traité|adapté|confondu|p\.)|facteur majeur|période d['’]usage|complément de la|atlas rouge|petites localités|flèches noires|numéroté dans|seuls ateliers|loi centrale|base des connaissances|disponibilité pour|mentions obligatoires|parfois à la place|doit être dans|pour inconscient|avec 112|si découpé|trajet passager|jour = |autoris(?:e|er) seulement|la dépose|tous les 2 ans|du métier|pour les <)/i;

const PLACEHOLDER_OPTION = /^(question|option|alt\.?|n\/a|todo|tbd|\.\.\.)$/i;

export function looksFrenchExamLeak(text) {
  return typeof text === "string" && FRENCH_EXAM_LEAK.test(text);
}

export function isPlaceholderOption(text) {
  return typeof text === "string" && PLACEHOLDER_OPTION.test(text.trim());
}

export function isResearchOwnedId(id) {
  return String(id || "").startsWith("research-") || String(id || "").startsWith("rs-");
}

function swedishExamFieldOk(text) {
  return Boolean(text) && !looksFrenchExamLeak(text) && !isPlaceholderOption(text);
}

function examSafeTrap(trap) {
  const value = coerceTrap(trap);
  return value && swedishExamFieldOk(value) ? value : undefined;
}

function optionTextKey(text) {
  return stemKey(text).replace(/[.,;:()]/g, "");
}

export function letterFromAnswer(answer, options) {
  if (LETTERS.includes(answer)) return answer;
  if (typeof answer !== "string" || !answer.trim() || !Array.isArray(options)) return undefined;
  const exact = options.find((option) => option.text === answer);
  if (exact) return exact.letter;
  const needle = optionTextKey(answer);
  if (!needle) return undefined;
  const fuzzy = options.find((option) => {
    const hay = optionTextKey(option.text);
    return hay === needle || hay.includes(needle) || needle.includes(hay);
  });
  return fuzzy?.letter;
}

export function isResearchShape(record) {
  return record && typeof record.sv === "string" && record.sv.trim();
}

export function isManziShape(record) {
  return record && typeof record.stem_sv === "string" && Array.isArray(record.options);
}

function cleanOptions(options) {
  if (!Array.isArray(options)) return [];
  return options
    .map((option, index) => {
      if (typeof option === "string") {
        const letter = LETTERS[index];
        return letter && option.trim() ? { letter, text: option.trim() } : null;
      }
      if (!option || typeof option !== "object") return null;
      const letter = LETTERS.includes(option.letter) ? option.letter : LETTERS[index];
      const text = typeof option.text === "string" ? option.text.trim() : "";
      return letter && text ? { letter, text } : null;
    })
    .filter(Boolean);
}

function fallbackExplanation(record, lang, trap) {
  const existing = lang === "sv" ? record.explanation_sv : record.explanation_fr;
  if (typeof existing === "string" && existing.trim()) return existing.trim();
  const note = lang === "sv" ? record.note_sv : record.note_fr;
  const svTrap = lang === "sv" ? examSafeTrap(trap) : coerceTrap(trap);
  if (typeof note === "string" && note.trim()) {
    const extra =
      lang === "sv"
        ? [svTrap ? `Vanlig fälla: ${svTrap}.` : "", record.source ? `Källa: ${record.source}` : ""]
        : [svTrap ? `Piège fréquent : ${svTrap}.` : "", record.source ? `Source : ${record.source}` : ""];
    return [note.trim(), ...extra].filter(Boolean).join(" ");
  }
  if (lang === "sv") {
    return [
      LETTERS.includes(record.answer) ? `Rätt svar: ${record.answer}.` : "",
      svTrap ? `Vanlig fälla: ${svTrap}.` : "",
      `Källa: ${record.source || "research"}`,
    ]
      .filter(Boolean)
      .join(" ");
  }
  return [
    LETTERS.includes(record.answer) ? `Bonne réponse : ${record.answer}.` : "",
    svTrap ? `Piège fréquent : ${svTrap}.` : "",
    `Source : ${record.source || "research"}`,
  ]
    .filter(Boolean)
    .join(" ");
}

function emptyResult(warnings, issues = []) {
  return { issues, warnings, question: null, translation: null };
}

export function coordinatorToResearchSource(record) {
  const stem = recordStem(record);
  const sv =
    (typeof record.sv === "string" && record.sv.trim()) ||
    (typeof record.sv_original === "string" && record.sv_original.trim()) ||
    stem;
  const next = {
    id: record.id,
    topic: mapTopic(record.topic) || record.topic,
    sv,
    ...(record.stem_sv ? { stem_sv: record.stem_sv } : {}),
    ...(Array.isArray(record.options) ? { options: record.options } : {}),
    ...(record.answer != null && record.answer !== "" ? { answer: record.answer } : {}),
    ...(record.explanation_sv ? { explanation_sv: record.explanation_sv } : {}),
    ...(record.explanation_fr ? { explanation_fr: record.explanation_fr } : {}),
    ...(record.fr ? { fr: record.fr } : {}),
    ...(record.note_sv ? { note_sv: record.note_sv } : {}),
    ...(record.note_fr ? { note_fr: record.note_fr } : {}),
    source: record.source || "research",
    ...(record.type ? { type: record.type } : {}),
    ...(mapFreq(record.freq) ? { freq: mapFreq(record.freq) } : {}),
    ...(coerceTrap(record.trap) ? { trap: coerceTrap(record.trap) } : {}),
    ...(record.youtubeId ? { youtubeId: record.youtubeId } : {}),
    ...(toImageUrl(record.imageUrl) ? { imageUrl: toImageUrl(record.imageUrl) } : {}),
    ...(record.sv_original ? { sv_original: record.sv_original } : {}),
  };
  return next;
}

export function mergeResearchSources(seedRecords, incomingRecords) {
  const out = [];
  const stems = new Set();
  for (const record of seedRecords) {
    out.push(record);
    const key = stemKey(recordStem(record));
    if (key) stems.add(key);
  }
  for (const raw of incomingRecords) {
    const record = coordinatorToResearchSource(raw);
    const key = stemKey(recordStem(record));
    if (key && stems.has(key)) continue;
    if (key) stems.add(key);
    out.push(record);
  }
  return out;
}

export function normalizeResearchRecord(record, index) {
  const issues = [];
  const warnings = [];
  const prefix = record.id || `research#${index + 1}`;
  if (record?.type === "term") {
    return emptyResult([`${prefix}: term skipped (vocab, not QCM)`]);
  }
  if (!isResearchShape(record)) {
    return { issues: [`${prefix}: missing sv`], warnings, question: null, translation: null };
  }
  const topic = mapTopic(record.topic);
  if (record.topic && !topic) {
    issues.push(`${prefix}: topic must be lagstiftning|sakerhet|karta|bkort`);
  }
  const { stem, options: embedded } = splitSvAlts(record.sv);
  const options = embedded.length ? embedded : cleanOptions(record.options);
  if (!swedishExamFieldOk(stem)) {
    return emptyResult([`${prefix}: skipped — stem is not Swedish exam language`]);
  }
  if (options.length < 2) {
    return emptyResult([`${prefix}: skipped — fewer than 2 real options (no invented keys)`]);
  }
  if (options.some((option) => !swedishExamFieldOk(option.text))) {
    return emptyResult([`${prefix}: skipped — French or placeholder in options`]);
  }
  const trap = examSafeTrap(record.trap) || "";
  if (coerceTrap(record.trap) && !trap) {
    warnings.push(`${prefix}: dropped French/coaching trap`);
  }
  const answer = letterFromAnswer(record.answer, options);
  if (!answer) {
    return emptyResult([`${prefix}: skipped — missing answer key`]);
  }
  if (!options.some((option) => option.letter === answer)) {
    return emptyResult([`${prefix}: skipped — answer ${answer} not among options`]);
  }
  const id = record.id || `rs-${index + 1}`;
  const explanation_sv = fallbackExplanation(record, "sv", trap);
  const explanation_fr = fallbackExplanation(record, "fr", trap);
  const freq = mapFreq(record.freq);
  const question = {
    id,
    topic: topic || "lagstiftning",
    stem_sv: stem,
    options,
    answer,
    explanation_sv,
    explanation_fr,
    source: record.source || "research",
    corpus: "research",
    ...(freq ? { freq } : {}),
    ...(trap ? { trap } : {}),
    ...(record.type ? { type: record.type } : {}),
    ...(record.youtubeId ? { youtubeId: record.youtubeId } : {}),
    ...(toImageUrl(record.imageUrl) ? { imageUrl: toImageUrl(record.imageUrl) } : {}),
    ...(record.imageCaption || record.caption
      ? { imageCaption: sanitizeCaption(record.imageCaption || record.caption) }
      : {}),
  };
  Object.assign(question, stripFakeExamArt(question));
  const translation = record.fr
    ? { stem: record.fr, options: record.options_fr || undefined }
    : null;
  return { issues, warnings, question, translation };
}

export function normalizeManziRecord(record, index) {
  const issues = [];
  const warnings = [];
  const prefix = record.id || `manzi#${index + 1}`;
  if (record?.type === "term") {
    return emptyResult([`${prefix}: term skipped (vocab, not QCM)`]);
  }
  if (!isManziShape(record)) {
    return { issues: [`${prefix}: missing stem_sv/options`], warnings, question: null };
  }
  const options = cleanOptions(record.options);
  if (options.length < 2) {
    return emptyResult([`${prefix}: skipped — fewer than 2 options`]);
  }
  const researchOwned =
    record.corpus === "research" || String(record.id || "").startsWith("research-");
  if (researchOwned) {
    if (!swedishExamFieldOk(record.stem_sv) || options.some((option) => !swedishExamFieldOk(option.text))) {
      return emptyResult([`${prefix}: skipped — French or placeholder in research exam fields`]);
    }
  }
  const answer = letterFromAnswer(record.answer, options);
  if (!answer) {
    return emptyResult([`${prefix}: skipped — missing answer key`]);
  }
  if (!options.some((option) => option.letter === answer)) {
    return emptyResult([`${prefix}: skipped — answer ${answer} not among options`]);
  }
  const topic = mapTopic(record.topic);
  if (!topic) {
    issues.push(`${prefix}: topic must be lagstiftning|sakerhet|karta|bkort`);
    return { issues, warnings, question: null };
  }
  let trap = researchOwned ? examSafeTrap(record.trap) : coerceTrap(record.trap);
  if (researchOwned && coerceTrap(record.trap) && !trap) {
    warnings.push(`${prefix}: dropped French/coaching trap`);
  }
  const freq = mapFreq(record.freq);
  const question = {
    id: record.id,
    topic,
    stem_sv: record.stem_sv,
    options,
    answer,
    explanation_sv: fallbackExplanation({ ...record, answer }, "sv", trap),
    explanation_fr: fallbackExplanation({ ...record, answer }, "fr", trap),
    ...(toImageUrl(record.imageUrl) ? { imageUrl: toImageUrl(record.imageUrl) } : {}),
    ...(record.imageCaption || record.caption
      ? { imageCaption: sanitizeCaption(record.imageCaption || record.caption) }
      : {}),
    source: record.source || (researchOwned ? "research" : "manzi"),
    corpus: researchOwned ? "research" : record.corpus || "manzi",
    ...(freq ? { freq } : {}),
    ...(trap ? { trap } : {}),
    ...(record.type ? { type: record.type } : {}),
    ...(record.youtubeId ? { youtubeId: record.youtubeId } : {}),
  };
  Object.assign(question, stripFakeExamArt(question));
  return { issues, warnings, question };
}

const HIGH_FREQ =
  /vilotid|dygnsvila|taxameter|24 mån|heldragen|tidbok|prisräkn|jämförpris|11 timm|åtta timm|8 timm|prisuppgift|700/i;

const STARTER_PATTERNS = [
  /heldragen|gul linje|gul-linje/i,
  /taxameter|24 mån|plomber/i,
  /vilotid|dygnsvila|11 timm|8 timm|6,5|6\.5/i,
  /tidbok/i,
  /prisräkn|jämförpris|prisuppgift|prisresa|700/i,
];

function haystack(question) {
  return [question.id, question.stem_sv, question.trap ?? "", question.source ?? ""].join(" ");
}

export function starterRank(question) {
  const text = haystack(question);
  const index = STARTER_PATTERNS.findIndex((pattern) => pattern.test(text));
  return index === -1 ? STARTER_PATTERNS.length : index;
}

export function studyPriority(question) {
  const research = question.corpus === "research";
  const high = question.freq === "high" || HIGH_FREQ.test(haystack(question));
  if (research && high) return 0;
  if (research) return 1;
  return 2;
}

export function compareStudyOrder(a, b) {
  const d = studyPriority(a) - studyPriority(b);
  if (d !== 0) return d;
  const start = starterRank(a) - starterRank(b);
  if (start !== 0) return start;
  const fa = a.freq === "high" ? 0 : a.freq === "medium" ? 1 : 2;
  const fb = b.freq === "high" ? 0 : b.freq === "medium" ? 1 : 2;
  return fa - fb || a.id.localeCompare(b.id);
}

export function sortForStudy(questions) {
  const remaining = [...questions];
  const head = [];
  for (const pattern of STARTER_PATTERNS) {
    const index = remaining.findIndex(
      (question) => studyPriority(question) === 0 && pattern.test(haystack(question)),
    );
    if (index !== -1) head.push(...remaining.splice(index, 1));
  }
  remaining.sort(compareStudyOrder);
  return [...head, ...remaining];
}
