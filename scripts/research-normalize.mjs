/** Normalize Lionel's research-bank schema → app question model. Swedish `sv` is never rewritten. */

const TOPICS = new Set(["lagstiftning", "sakerhet", "karta", "bkort"]);
const LETTERS = ["A", "B", "C", "D", "E"];

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

export function isResearchShape(record) {
  return record && typeof record.sv === "string" && record.sv.trim();
}

export function isManziShape(record) {
  return record && typeof record.stem_sv === "string" && Array.isArray(record.options);
}

export function normalizeResearchRecord(record, index) {
  const issues = [];
  const prefix = record.id || `research#${index + 1}`;
  if (!isResearchShape(record)) {
    return { issues: [`${prefix}: missing sv`], question: null, translation: null };
  }
  if (record.topic && !TOPICS.has(record.topic)) {
    issues.push(`${prefix}: topic must be lagstiftning|sakerhet|karta|bkort`);
  }
  const { stem, options: embedded } = splitSvAlts(record.sv);
  let options = embedded;
  if (!options.length && Array.isArray(record.options)) options = record.options;
  const trap = record.trap ? String(record.trap) : "";
  if (!options.length) {
    const answerText = typeof record.answer === "string" && !LETTERS.includes(record.answer)
      ? record.answer
      : stem;
    options = [{ letter: "A", text: answerText }];
    if (trap) {
      trap.split(/[|,]/).map((part) => part.trim()).filter(Boolean).forEach((text, i) => {
        const letter = LETTERS[i + 1];
        if (letter) options.push({ letter, text });
      });
    }
    if (options.length < 2) {
      options.push({ letter: "B", text: "Påståendet stämmer inte." });
    }
  }
  let answer = record.answer;
  if (!LETTERS.includes(answer)) {
    const hit = options.find((option) => option.text === record.answer);
    answer = hit?.letter ?? options[0].letter;
  }
  if (!options.some((option) => option.letter === answer)) {
    issues.push(`${prefix}: answer ${answer} not in options`);
  }
  const id = record.id || `rs-${index + 1}`;
  const explanation_sv =
    record.explanation_sv ||
    [record.note_sv, trap ? `Vanlig fälla: ${trap}.` : "", `Källa: ${record.source || "research"}`]
      .filter(Boolean)
      .join(" ");
  const explanation_fr =
    record.explanation_fr ||
    [record.note_fr, trap ? `Piège fréquent : ${trap}.` : "", `Source : ${record.source || "research"}`]
      .filter(Boolean)
      .join(" ");
  const question = {
    id,
    topic: record.topic || "lagstiftning",
    stem_sv: stem,
    options,
    answer,
    explanation_sv,
    explanation_fr,
    source: record.source || "research",
    corpus: "research",
    ...(record.freq ? { freq: record.freq } : {}),
    ...(trap ? { trap } : {}),
    ...(record.type ? { type: record.type } : {}),
    ...(record.youtubeId ? { youtubeId: record.youtubeId } : {}),
    ...(record.imageUrl ? { imageUrl: record.imageUrl } : {}),
  };
  const translation = record.fr
    ? { stem: record.fr, options: record.options_fr || undefined }
    : null;
  return { issues, question, translation };
}

export function normalizeManziRecord(record, index) {
  const issues = [];
  const prefix = record.id || `manzi#${index + 1}`;
  if (!isManziShape(record)) {
    return { issues: [`${prefix}: missing stem_sv/options`], question: null };
  }
  const question = {
    id: record.id,
    topic: record.topic,
    stem_sv: record.stem_sv,
    options: record.options.map((option) => ({ letter: option.letter, text: option.text })),
    answer: record.answer,
    explanation_sv: record.explanation_sv,
    explanation_fr: record.explanation_fr,
    ...(record.imageUrl ? { imageUrl: record.imageUrl } : {}),
    source: record.source || "manzi",
    corpus: record.corpus || "manzi",
    ...(record.freq ? { freq: record.freq } : {}),
    ...(record.trap ? { trap: record.trap } : {}),
    ...(record.type ? { type: record.type } : {}),
    ...(record.youtubeId ? { youtubeId: record.youtubeId } : {}),
  };
  return { issues, question };
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

export function sortForStudy(questions) {
  return [...questions].sort((a, b) => {
    const d = studyPriority(a) - studyPriority(b);
    if (d !== 0) return d;
    const start = starterRank(a) - starterRank(b);
    if (start !== 0) return start;
    const fa = a.freq === "high" ? 0 : a.freq === "medium" ? 1 : 2;
    const fb = b.freq === "high" ? 0 : b.freq === "medium" ? 1 : 2;
    return fa - fb || a.id.localeCompare(b.id);
  });
}
