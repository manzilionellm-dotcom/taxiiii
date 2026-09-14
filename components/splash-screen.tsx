import { BrandGlyph, BrandMark } from "@/components/brand-mark";
import { BRAND } from "@/lib/branding";

export function SplashScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
      <div className="splash-ring mb-6">
        <BrandGlyph size={72} />
      </div>
      <BrandMark className="text-3xl text-[var(--forest)]" />
      <p className="mt-4 max-w-xs font-serif text-xl leading-snug text-black">{BRAND.slogan}</p>
      <p className="mt-2 max-w-xs text-sm text-[var(--muted)]">{BRAND.keyMessage}</p>
      <p className="mt-5 max-w-xs text-sm leading-6 text-[#1f3d2b]">
        Läraren är här. / L&apos;enseignant est là.
      </p>
      <div className="mt-10 flex gap-1.5" aria-hidden>
        <span className="skeleton h-1.5 w-8 rounded-full" />
        <span className="skeleton h-1.5 w-8 rounded-full" />
        <span className="skeleton h-1.5 w-8 rounded-full" />
      </div>
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
