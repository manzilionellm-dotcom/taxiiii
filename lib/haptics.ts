"use client";

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One refined tick when the luxury gloss chip opens.
 * Capacitor light impact on native; 12ms vibrate on the web; silent if blocked.
 */
export async function tickGlossHaptic() {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
    return;
  } catch {
    /* browser or plugin unavailable */
  }
  try {
    navigator.vibrate?.(12);
  } catch {
    /* OS or browser declined vibration */
  }
}
