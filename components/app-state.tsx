"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  getAppServerSnapshot,
  getAppSnapshot,
  hydrateAppState,
  subscribeAppState,
  writeAppState,
} from "@/lib/progress/client-store";
import { emptyState } from "@/lib/progress/store";
import type { AppState } from "@/lib/types";

const StateContext = createContext<{
  state: AppState;
  setState: (next: AppState | ((prev: AppState) => AppState)) => void;
  hydrated: boolean;
} | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (hydrated) hydrateAppState();

  const state = useSyncExternalStore(subscribeAppState, getAppSnapshot, getAppServerSnapshot);

  const value = useMemo(
    () => ({
      state: hydrated ? state : emptyState(),
      setState: writeAppState,
      hydrated,
    }),
    [state, hydrated],
  );

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
