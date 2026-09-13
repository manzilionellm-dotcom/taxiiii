import "server-only";

import { getFrench, questionsForTrack } from "@/lib/questions/bank";
import { studyPriority } from "@/lib/questions/priority";
import type { QuestionCatalogItem, SessionQuestion } from "@/lib/questions/session-types";
import { signMediaToken, type ViewerSession } from "@/lib/protect/session";
import { topicsForTrack, type QuestionRecord, type Track } from "@/lib/types";
import { hasAuthenticImageUrl, sanitizeCaption, toLogicalKey } from "@/lib/media/paths.mjs";
import { signedMediaPath } from "@/lib/media/store";

export type { QuestionCatalogItem, SessionQuestion };

export async function protectQuestion(
  question: QuestionRecord,
  session: ViewerSession,
): Promise<SessionQuestion> {
  const key = toLogicalKey(question.imageUrl);
  let imageUrl: string | undefined;
  if (key && hasAuthenticImageUrl(question.imageUrl)) {
    const token = await signMediaToken(key, session.id);
    imageUrl = signedMediaPath(key, token.exp, token.sig);
  }
  const imageCaption = question.imageCaption
    ? sanitizeCaption(question.imageCaption)
    : undefined;
  return {
    ...question,
    ...(imageUrl ? { imageUrl } : { imageUrl: undefined }),
    ...(imageCaption ? { imageCaption } : { imageCaption: undefined }),
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

export function pickStudy(track: Track, dueIds: Set<string>, fragile: boolean) {
  const bank = [...questionsForTrack(track)].sort((a, b) => {
    const dueDelta = Number(dueIds.has(b.id)) - Number(dueIds.has(a.id));
    if (dueDelta !== 0) return dueDelta;
    return studyPriority(a) - studyPriority(b);
  });
  return bank.slice(0, fragile ? 6 : 10);
}

export function pickExam(track: Track) {
  const bank = [...questionsForTrack(track)];
  for (let i = bank.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [bank[i], bank[j]] = [bank[j], bank[i]];
  }
  return bank.slice(0, Math.min(8, bank.length));
}
