"use client";

import { createCard, reviewCard } from "@/lib/progress/srs";
import { ensureOnboardedTracks } from "@/lib/progress/tracks";
import type {
  AppState,
  Attempt,
  ChatTurn,
  LastSession,
  Locale,
  MockExam,
  Profile,
  SrsCard,
  SupportLevel,
  Topic,
  Track,
  WeakTopic,
} from "@/lib/types";

export const STORAGE_KEY = "korklart.v1";

export const defaultProfile: Profile = {
  name: "",
  email: "",
  tracks: ["taxi"],
  activeTrack: "taxi",
  locale: "sv",
  fragileMode: false,
  supportLevel: 2,
  showTranslations: true,
  onboarded: false,
  tosAccepted: false,
};

export function emptyState(): AppState {
  return {
    version: 1,
    profile: defaultProfile,
    attempts: [],
    srs: [],
    exams: [],
    chat: [],
    lastSession: undefined,
    weakTopics: [],
    teacherNotes: [],
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== 1) return emptyState();
    return {
      ...emptyState(),
      ...parsed,
      lastSession: parsed.lastSession,
      weakTopics: parsed.weakTopics ?? [],
      teacherNotes: parsed.teacherNotes ?? [],
      profile: ensureOnboardedTracks({ ...defaultProfile, ...parsed.profile }),
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: AppState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function cardKey(card: { questionId: string; conceptId?: string; track: Track }) {
  return `${card.track}:${card.conceptId || card.questionId}`;
}

export function recordAttempt(
  state: AppState,
  input: {
    questionId: string;
    track: Track;
    correct: boolean;
    timed?: boolean;
    mockExamId?: string;
    conceptId?: string;
    form?: SrsCard["lastForm"];
    variantId?: string;
  },
): AppState {
  const conceptId = input.conceptId || input.questionId;
  const attempt: Attempt = {
    id: uid(),
    questionId: input.questionId,
    track: input.track,
    correct: input.correct,
    at: new Date().toISOString(),
    timed: Boolean(input.timed),
    mockExamId: input.mockExamId,
  };
  const existing = state.srs.find((card) => cardKey(card) === `${input.track}:${conceptId}`);
  const card = existing ?? createCard(input.questionId, input.track);
  const reviewed = {
    ...reviewCard({ ...card, conceptId, questionId: input.questionId }, input.correct ? 4 : 1),
    conceptId,
    lastForm: input.form || card.lastForm,
    lastVariantId: input.variantId || card.lastVariantId,
  };
  const srs = [
    ...state.srs.filter((item) => cardKey(item) !== `${input.track}:${conceptId}`),
    reviewed,
  ];
  return { ...state, attempts: [...state.attempts, attempt], srs };
}

/** Mark the card due immediately so a miss returns in the next study mix. */
export function bumpReviewSoon(
  state: AppState,
  input: { questionId: string; track: Track; conceptId?: string; form?: SrsCard["lastForm"] },
): AppState {
  const conceptId = input.conceptId || input.questionId;
  const existing = state.srs.find((card) => cardKey(card) === `${input.track}:${conceptId}`);
  const card = existing ?? createCard(input.questionId, input.track);
  const next = {
    ...card,
    questionId: input.questionId,
    conceptId,
    lastForm: input.form || card.lastForm,
    interval: 1 / (24 * 60),
    due: new Date().toISOString(),
  };
  return {
    ...state,
    srs: [...state.srs.filter((item) => cardKey(item) !== `${input.track}:${conceptId}`), next],
  };
}

export function finishExam(
  state: AppState,
  exam: MockExam,
  correct: number,
  total: number,
): AppState {
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  const next: MockExam = {
    ...exam,
    finishedAt: new Date().toISOString(),
    correct,
    total,
    score,
  };
  return {
    ...state,
    exams: [...state.exams.filter((item) => item.id !== exam.id), next],
    lastSession: state.lastSession
      ? { ...state.lastSession, unfinished: false, at: new Date().toISOString() }
      : state.lastSession,
  };
}

export function appendChat(state: AppState, turns: ChatTurn[]): AppState {
  return { ...state, chat: [...state.chat, ...turns].slice(-80) };
}

export function updateProfile(state: AppState, patch: Partial<Profile>): AppState {
  return { ...state, profile: { ...state.profile, ...patch } };
}

export function setLocale(state: AppState, locale: Locale): AppState {
  return updateProfile(state, { locale });
}

export function setSupport(state: AppState, supportLevel: SupportLevel): AppState {
  return updateProfile(state, { supportLevel });
}

export function rememberSession(
  state: AppState,
  input: {
    track: Track;
    mode: LastSession["mode"];
    questionIds: string[];
    index?: number;
    topic?: Topic;
    unfinished?: boolean;
    weakTopics?: WeakTopic[];
    note?: string;
    missLabel?: string;
    missTopic?: Topic;
  },
): AppState {
  const lastSession: LastSession = {
    track: input.track,
    mode: input.mode,
    questionIds: input.questionIds,
    index: input.index ?? 0,
    topic: input.topic,
    unfinished: input.unfinished ?? true,
    at: new Date().toISOString(),
    missLabel: input.missLabel ?? state.lastSession?.missLabel,
    missTopic: input.missTopic ?? state.lastSession?.missTopic,
  };
  const notes = input.note
    ? [...(state.teacherNotes ?? []).slice(-11), input.note]
    : state.teacherNotes;
  return {
    ...state,
    lastSession,
    weakTopics: input.weakTopics ?? state.weakTopics,
    teacherNotes: notes,
  };
}
