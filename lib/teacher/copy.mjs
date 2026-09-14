/** Teacher voice — exam terms stay Swedish; the sentence frame follows locale. */

export const TOPIC_SV = {
  lagstiftning: "Lagstiftning",
  sakerhet: "Säkerhet",
  karta: "Karta",
  bkort: "Körkort",
  agare: "Taxi Företag",
};

export const EXAM_TERMS = [
  { re: /vilotid|dygnsvila/i, label: "vilotid" },
  { re: /tariff\s*31|söndag/i, label: "tariff 31" },
  { re: /taxameter|24\s*mån|plomber/i, label: "taxameter" },
  { re: /heldragen|gul linje|gul-linje/i, label: "heldragen linje" },
  { re: /tidbok/i, label: "tidbok" },
  { re: /prisräkn|jämförpris|prisuppgift|prisresa/i, label: "prisräkning" },
  { re: /tariff/i, label: "tariff" },
];

export function topicSv(topic) {
  return TOPIC_SV[topic] || topic || "";
}

export function missLabelFromText(text) {
  const hay = String(text || "");
  for (const term of EXAM_TERMS) {
    if (term.re.test(hay)) return term.label;
  }
  return "";
}

export function sameCalendarDay(iso, now = new Date()) {
  if (!iso) return false;
  const then = new Date(iso);
  return (
    then.getFullYear() === now.getFullYear() &&
    then.getMonth() === now.getMonth() &&
    then.getDate() === now.getDate()
  );
}

/**
 * @param {{
 *   locale: "fr" | "sv",
 *   name?: string,
 *   trackName: string,
 *   firstDay?: boolean,
 *   yesterday?: boolean,
 *   lastTopic?: string,
 *   weakLabel?: string,
 *   weakAccuracy?: number,
 * }} input
 */
export function continuityGreeting(input) {
  const locale = input.locale === "fr" ? "fr" : "sv";
  const name = String(input.name || "").trim();
  const trackName = input.trackName;
  const lastTopic = input.lastTopic ? topicSv(input.lastTopic) || input.lastTopic : "";
  const weakLabel = input.weakLabel || "";
  const acc = Number.isFinite(input.weakAccuracy) ? input.weakAccuracy : null;

  if (input.firstDay) {
    return locale === "fr"
      ? `On commence tranquillement ${trackName}. Un concept à la fois.`
      : `Vi börjar lugnt med ${trackName}. Ett begrepp i taget.`;
  }

  let opener =
    locale === "fr"
      ? name
        ? `${name}, on reprend ${trackName}`
        : `On reprend ${trackName}`
      : name
        ? `${name}, vi tar upp ${trackName}`
        : `Vi tar upp ${trackName}`;

  if (lastTopic && input.yesterday) {
    opener = locale === "fr" ? `Hier tu étais sur ${lastTopic}` : `I går var du på ${lastTopic}`;
  } else if (lastTopic) {
    opener = locale === "fr" ? `On continue ${lastTopic}` : `Vi fortsätter med ${lastTopic}`;
  }

  if (weakLabel && acc !== null) {
    const today =
      locale === "fr"
        ? `Aujourd'hui on corrige ${weakLabel} (${acc}%).`
        : `I dag rättar vi ${weakLabel} (${acc}%).`;
    return `${opener}… ${today}`;
  }

  return `${opener}.`;
}

export function continuityNote(input) {
  const locale = input.locale === "fr" ? "fr" : "sv";
  const due = Number(input.due) || 0;
  if (due > 0) {
    return locale === "fr"
      ? `${due} cartes à revoir aujourd'hui.`
      : `${due} kort att repetera i dag.`;
  }
  return locale === "fr"
    ? "Rien n'est dû — on mélange quand même les thèmes."
    : "Inget förfallet just nu — vi blandar ämnen ändå.";
}

export function dailyTeacherNote(greeting, note) {
  return [greeting, note].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
