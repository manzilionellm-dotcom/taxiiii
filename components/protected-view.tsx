"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/types";

/**
 * Web study/exam wrapper. The focus-loss overlay (« Innehållet är dolt ») is
 * disabled — taxiiii.vercel.app is a prototype. Native FLAG_SECURE anti-screenshot
 * lives on the Android APK (follow-up), not here.
 */
export function ProtectedView({
  children,
}: {
  children: ReactNode;
  locale: Locale;
  exam?: boolean;
}) {
  return <div className="protected-content relative">{children}</div>;
}
