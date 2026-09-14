"use client";

import { emptyState, loadState, saveState } from "@/lib/progress/store";
import type { AppState } from "@/lib/types";

const EMPTY = emptyState();
let snapshot = EMPTY;
let didHydrate = false;
const listeners = new Set<() => void>();

export function subscribeAppState(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAppSnapshot() {
  return snapshot;
}

export function getAppServerSnapshot() {
  return EMPTY;
}

export function hydrateAppState() {
  if (didHydrate || typeof window === "undefined") return;
  didHydrate = true;
  snapshot = loadState();
  if (snapshot.profile.onboarded) {
    saveState(snapshot);
  }
  queueMicrotask(() => {
    listeners.forEach((listener) => listener());
  });
}

export function writeAppState(next: AppState | ((prev: AppState) => AppState)) {
  snapshot = typeof next === "function" ? next(snapshot) : next;
  saveState(snapshot);
  listeners.forEach((listener) => listener());
}
