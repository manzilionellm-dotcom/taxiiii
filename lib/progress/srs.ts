import type { SrsCard, Track } from "@/lib/types";

const MINUTE = 60 * 1000;

export function createCard(questionId: string, track: Track, now = new Date()): SrsCard {
  return {
    questionId,
    track,
    conceptId: questionId,
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    due: now.toISOString(),
    lapses: 0,
  };
}

/** SM-2 variant. grade 0–5. */
export function reviewCard(card: SrsCard, grade: number, now = new Date()): SrsCard {
  const next = { ...card };
  if (grade < 3) {
    next.repetitions = 0;
    next.interval = 1 / (24 * 60);
    next.lapses += 1;
    next.ease = Math.max(1.3, next.ease - 0.2);
  } else {
    if (next.repetitions === 0) next.interval = 1;
    else if (next.repetitions === 1) next.interval = 6;
    else next.interval = Math.round(next.interval * next.ease);
    next.repetitions += 1;
    next.ease = Math.max(
      1.3,
      next.ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)),
    );
  }
  next.due = new Date(now.getTime() + next.interval * 24 * 60 * MINUTE).toISOString();
  return next;
}

export function isDue(card: SrsCard, now = new Date()) {
  return new Date(card.due).getTime() <= now.getTime();
}
