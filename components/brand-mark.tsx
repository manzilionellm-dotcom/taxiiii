import { BRAND, brandLockup } from "@/lib/branding";

export function BrandGlyph({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="16" cy="16" r="16" fill="#1f3d2b" />
      <circle
        cx="16"
        cy="16"
        r="7.4"
        fill="none"
        stroke="#fffdf8"
        strokeWidth="2.4"
      />
    </svg>
  );
}

export function BrandMark({
  compact = false,
  glyph = false,
  className = "",
}: {
  compact?: boolean;
  glyph?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        {glyph ? <BrandGlyph size={22} /> : null}
        <span className="inline-flex items-baseline gap-1.5">
          <span className="font-serif tracking-tight">{BRAND.appName}</span>
          <span className="text-[0.7em] font-medium opacity-70">{BRAND.signature}</span>
        </span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {glyph ? <BrandGlyph size={32} /> : null}
      <span className="block">
        <span className="font-serif tracking-tight">{BRAND.appName}</span>
        <span className="ml-1.5 text-sm font-medium opacity-70">{BRAND.signature}</span>
        <span className="sr-only">{brandLockup()}</span>
      </span>
    </span>
  );
}
