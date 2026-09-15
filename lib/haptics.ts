"use client";

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

async function impact(style: "Light" | "Medium" | "Heavy", fallbackMs: number) {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle[style] });
    return;
  } catch {
    /* browser or plugin unavailable */
  }
  try {
    navigator.vibrate?.(fallbackMs);
  } catch {
    /* OS or browser declined vibration */
  }
}

/**
 * One refined tick when the luxury gloss chip opens.
 * Capacitor light impact on native; 12ms vibrate on the web; silent if blocked.
 */
export async function tickGlossHaptic() {
  await impact("Light", 12);
}

/**
 * Confirmation of the tap that answers a question. A right answer gets the
 * light tick, a wrong one a heavier thud: the body knows the verdict before
 * the eyes reach the panel, which is what makes the loop feel instant.
 */
export async function answerHaptic(correct: boolean) {
  await impact(correct ? "Light" : "Medium", correct ? 14 : 26);
}
