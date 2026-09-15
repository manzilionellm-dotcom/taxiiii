import { BrandGlyph, BrandMark } from "@/components/brand-mark";
import { BRAND } from "@/lib/branding";

/**
 * Cold start, one continuous brand moment. The Android launch screen, the
 * Capacitor bridge page (scripts/write-native-www.mjs) and this screen paint
 * the same forest green, so the app opens on its own colour instead of
 * flashing white between three different first paints.
 *
 * Kept deliberately quiet: a launch screen that explains the product is a
 * launch screen the user reads once and then waits through every morning.
 */
export function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-ring">
        <BrandGlyph size={64} tone="light" />
      </div>
      <BrandMark className="mt-6 text-[1.75rem] text-[#fffdf8]" />
      <p className="mt-2 text-sm leading-6 text-[#cfe0d4]">{BRAND.slogan}</p>
      <span className="splash-progress" aria-hidden />
      <span className="sr-only" role="status">
        {BRAND.keyMessage}
      </span>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="skeleton h-4 w-28" />
      <div className="skeleton h-9 w-48" />
      <div className="skeleton h-4 w-full max-w-md" />
      <div className="card space-y-3">
        <div className="skeleton h-8 w-24" />
        <div className="skeleton h-2 w-full" />
        <div className="skeleton h-2 w-5/6" />
        <div className="skeleton h-2 w-4/6" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
      </div>
    </div>
  );
}

export function SessionSkeleton({ label }: { label: string }) {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <div className="question-paper space-y-4">
        <div className="skeleton h-3 w-36" />
        <div className="skeleton h-6 w-full" />
        <div className="skeleton h-6 w-5/6" />
        <div className="skeleton h-16 w-full" />
        <div className="space-y-2">
          <div className="skeleton h-14 w-full" />
          <div className="skeleton h-14 w-full" />
          <div className="skeleton h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
