"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/types";

/**
 * Web study/exam wrapper. No hide-on-blur overlay — taxiiii.vercel.app is a
 * prototype and must stay usable when the window loses focus. Native FLAG_SECURE
 * anti-screenshot lives on the Android APK only.
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
