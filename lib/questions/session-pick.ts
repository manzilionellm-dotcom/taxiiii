import "server-only";

import { getFrench, interleave, questionsForTrack } from "@/lib/questions/bank";
import { studyPriority } from "@/lib/questions/priority";
import { conceptIdFor, presentConcept } from "@/lib/questions/variants.mjs";
import type { QuestionCatalogItem, SessionQuestion } from "@/lib/questions/session-types";
import { signMediaToken, type ViewerSession } from "@/lib/protect/session";
import { topicsForTrack, type QuestionRecord, type Topic, type Track } from "@/lib/types";
import { hasAuthenticImageUrl, sanitizeCaption, toLogicalKey } from "@/lib/media/paths.mjs";
import { mediaKeyAvailable, signedMediaPath } from "@/lib/media/store";

export type { QuestionCatalogItem, SessionQuestion };

export async function protectQuestion(
  question: QuestionRecord,
  session: ViewerSession,
): Promise<SessionQuestion> {
  const key = toLogicalKey(question.imageUrl);
  let imageUrl: string | undefined;
  if (key && hasAuthenticImageUrl(question.imageUrl) && (await mediaKeyAvailable(key))) {
    const token = await signMediaToken(key, session.id);
    imageUrl = signedMediaPath(key, token.exp, token.sig);
  }
  const imageCaption = question.imageCaption
    ? sanitizeCaption(question.imageCaption)
    : undefined;
  const imageFirst = Boolean(imageUrl) && (question.form === "image-first" || question.imageFirst);
  return {
    ...question,
    ...(imageUrl ? { imageUrl } : { imageUrl: undefined }),
    ...(imageCaption ? { imageCaption } : { imageCaption: undefined }),
    imageFirst,
    form: imageFirst ? question.form : question.form === "image-first" ? "original" : question.form,
    translation: getFrench(question),
    watermark: session.label,
  };
}

export function catalogForTrack(track: Track): QuestionCatalogItem[] {
  return questionsForTrack(track).map((question) => ({
    id: question.id,
    topic: question.topic,
  }));
}

export function topicTotals(track: Track) {
  return topicsForTrack(track).map((topic) => ({
    topic,
    total: catalogForTrack(track).filter((item) => item.topic === topic).length,
  }));
}

export function parseDueToken(token: string): { id: string; lastForm?: string } {
  const [id, lastForm] = String(token || "")
    .split("~")
    .map((part) => part.trim());
  return { id, lastForm: lastForm || undefined };
}

export function pickStudy(
  track: Track,
  dueIds: Set<string>,
  fragile: boolean,
  dueForms: Record<string, string> = {},
  focusTopic?: Topic | null,
) {
  const bank = questionsForTrack(track);
  const byId = new Map(bank.map((question) => [question.id, question]));
  const seen = new Set<string>();
  const dueItems: QuestionRecord[] = [];
  for (const raw of dueIds) {
    const { id, lastForm: tokenForm } = parseDueToken(raw);
    if (!id) continue;
    const seed = byId.get(id) || bank.find((question) => conceptIdFor(question) === id);
    if (!seed) continue;
    const concept = conceptIdFor(seed);
    if (seen.has(concept)) continue;
    seen.add(concept);
    dueItems.push(presentConcept(seed, bank, tokenForm || dueForms[id] || dueForms[concept]));
  }
  const rest = bank
    .filter((question) => !seen.has(conceptIdFor(question)))
    .sort((a, b) => {
      if (focusTopic) {
        const af = a.topic === focusTopic ? 0 : 1;
        const bf = b.topic === focusTopic ? 0 : 1;
        if (af !== bf) return af - bf;
      }
      return studyPriority(a) - studyPriority(b);
    });
  const dueFocused = focusTopic ? dueItems.filter((item) => item.topic === focusTopic) : dueItems;
  const dueOther = focusTopic ? dueItems.filter((item) => item.topic !== focusTopic) : [];
  const mixed = interleave([...dueFocused, ...rest, ...dueOther]);
  return mixed.slice(0, fragile ? 6 : 10);
}

export function pickResume(track: Track, ids: string[], dueForms: Record<string, string> = {}) {
  const bank = questionsForTrack(track);
  const byId = new Map(bank.map((question) => [question.id, question]));
  const result: QuestionRecord[] = [];
  for (const raw of ids) {
    const { id, lastForm } = parseDueToken(raw);
    const seed = byId.get(id) || bank.find((question) => conceptIdFor(question) === id);
    if (!seed) continue;
    result.push(presentConcept(seed, bank, lastForm || dueForms[id]));
  }
  return result;
}

export function pickExam(track: Track) {
  const bank = [...questionsForTrack(track)];
  for (let i = bank.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [bank[i], bank[j]] = [bank[j], bank[i]];
  }
  return bank.slice(0, Math.min(65, bank.length));
}
