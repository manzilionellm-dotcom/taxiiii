"use client";

import { createCard, reviewCard } from "@/lib/progress/srs";
import type {
  AppState,
  Attempt,
  ChatTurn,
  Locale,
  MockExam,
  Profile,
  SupportLevel,
  Track,
} from "@/lib/types";

export const STORAGE_KEY = "korklart.v1";

export const defaultProfile: Profile = {
  name: "",
  email: "",
  tracks: ["taxi"],
  activeTrack: "taxi",
  locale: "fr",
  fragileMode: false,
  supportLevel: 2,
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
      profile: { ...defaultProfile, ...parsed.profile },
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

export function recordAttempt(
  state: AppState,
  input: {
    questionId: string;
    track: Track;
    correct: boolean;
    timed?: boolean;
    mockExamId?: string;
  },
): AppState {
  const attempt: Attempt = {
    id: uid(),
    questionId: input.questionId,
    track: input.track,
    correct: input.correct,
    at: new Date().toISOString(),
    timed: Boolean(input.timed),
    mockExamId: input.mockExamId,
  };
  const existing = state.srs.find(
    (card) => card.questionId === input.questionId && card.track === input.track,
  );
  const card = existing ?? createCard(input.questionId, input.track);
  const reviewed = reviewCard(card, input.correct ? 4 : 1);
  const srs = [
    ...state.srs.filter(
      (item) => !(item.questionId === input.questionId && item.track === input.track),
    ),
    reviewed,
  ];
  return { ...state, attempts: [...state.attempts, attempt], srs };
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
