"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Focus mode. While a question session is on screen the bottom tab bar steps
 * aside so the session's own action bar owns the thumb zone: one fixed target
 * for "next" instead of a button that moves with the length of the solution.
 * Every serious quiz app does this — the answer → verdict → next loop must
 * never cost a scroll or a hunt.
 */
const ChromeContext = createContext<{
  focus: boolean;
  setFocus: (value: boolean) => void;
} | null>(null);

export function ChromeProvider({ children }: { children: ReactNode }) {
  const [focus, setFocus] = useState(false);
  const value = useMemo(() => ({ focus, setFocus }), [focus]);
  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>;
}

export function useChrome() {
  const ctx = useContext(ChromeContext);
  if (!ctx) throw new Error("useChrome must be used within ChromeProvider");
  return ctx;
}

/** Claim focus mode for as long as the calling component is mounted. */
export function useFocusMode(active = true) {
  const { setFocus } = useChrome();
  useEffect(() => {
    if (!active) return;
    setFocus(true);
    return () => setFocus(false);
  }, [active, setFocus]);
}
