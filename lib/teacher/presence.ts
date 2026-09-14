import { isDue } from "@/lib/progress/srs";
import { trackLabel } from "@/lib/branding";
import {
  continuityGreeting,
  continuityNote,
  dailyTeacherNote,
  missLabelFromText,
  sameCalendarDay,
  topicSv,
} from "@/lib/teacher/copy.mjs";
import { topicsForTrack, type AppState, type Locale, type Topic, type Track, type WeakTopic } from "@/lib/types";

export interface TeacherPresenceModel {
  greeting: string;
  note: string;
  dailyNote: string;
  weak: WeakTopic[];
  resumeHref?: string;
  correctHref: string;
  correctTopic?: Topic;
  missStreak: number;
  missLabel?: string;
}

export function topicAccuracy(
  state: AppState,
  catalog: { id: string; topic: Topic }[],
  track: Track,
): WeakTopic[] {
  const topics = topicsForTrack(track);
  const dueIds = new Set(
    state.srs
      .filter((card) => card.track === track && isDue(card))
      .map((card) => card.conceptId || card.questionId),
  );
  return topics
    .map((topic) => {
      const ids = new Set(catalog.filter((item) => item.topic === topic).map((item) => item.id));
      const attempts = state.attempts.filter(
        (item) => item.track === track && ids.has(item.questionId),
      );
      const recent = attempts.slice(-20);
      const accuracy = recent.length
        ? Math.round((recent.filter((item) => item.correct).length / recent.length) * 100)
        : 100;
      const due = [...ids].filter((id) => dueIds.has(id)).length;
      return { topic, track, accuracy, attempts: recent.length, due };
    })
    .filter((row) => row.attempts >= 2 || (row.due ?? 0) > 0)
    .sort(
      (a, b) =>
        a.accuracy - b.accuracy || (b.due ?? 0) - (a.due ?? 0) || b.attempts - a.attempts,
    );
}

export function missStreakFor(state: AppState, track: Track) {
  const recent = state.attempts.filter((item) => item.track === track).slice(-6);
  let streak = 0;
  for (let i = recent.length - 1; i >= 0; i -= 1) {
    if (recent[i].correct) break;
    streak += 1;
  }
  return streak;
}

export function computeTeacherPresence(
  state: AppState,
  catalog: { id: string; topic: Topic }[],
  track: Track,
  locale: Locale,
  now = new Date(),
): TeacherPresenceModel {
  const name = state.profile.name?.trim();
  const trackName = trackLabel(track);
  const computed = topicAccuracy(state, catalog, track);
  const persisted = (state.weakTopics ?? []).filter((row) => row.track === track);
  const weak = (computed.length ? computed : persisted).slice(0, 3);
  const due = state.srs.filter((card) => card.track === track && isDue(card)).length;
  const last = state.lastSession;
  const lastTopic = last?.topic;
  const weakTop = weak[0];
  const yesterday = Boolean(last?.at && !sameCalendarDay(last.at, now));
  const firstDay = !state.attempts.some((item) => item.track === track);
  const missStreak = missStreakFor(state, track);
  const missLabel =
    last?.missLabel && last.missTopic && weakTop && last.missTopic === weakTop.topic
      ? last.missLabel
      : last?.missLabel && firstDay
        ? last.missLabel
        : weakTop
          ? missLabelFromText(weakTop.topic) || topicSv(weakTop.topic)
          : last?.missLabel;

  const weakLabel = missLabel || (weakTop ? topicSv(weakTop.topic) : "");
  const greeting = continuityGreeting({
    locale,
    name,
    trackName,
    firstDay,
    yesterday,
    lastTopic,
    weakLabel: weakTop ? weakLabel : "",
    weakAccuracy: weakTop?.accuracy,
  });
  const note = continuityNote({ locale, due });
  const resumeHref =
    last?.unfinished && last.questionIds.length && last.track === track
      ? `/${track}/${last.mode}?resume=1`
      : undefined;

  return {
    greeting,
    note,
    dailyNote: dailyTeacherNote(greeting, note),
    weak,
    resumeHref,
    correctHref: weakTop ? `/${track}/study?focus=${weakTop.topic}` : `/${track}/study`,
    correctTopic: weakTop?.topic,
    missStreak,
    missLabel,
  };
}

export function persistableWeakTopics(
  state: AppState,
  catalog: { id: string; topic: Topic }[],
  track: Track,
) {
  const computed = topicAccuracy(state, catalog, track).slice(0, 3);
  const others = (state.weakTopics ?? []).filter((row) => row.track !== track);
  const current = computed.length
    ? computed
    : (state.weakTopics ?? []).filter((row) => row.track === track);
  return [...others, ...current].slice(0, 9);
}

export { missLabelFromText, topicSv };
