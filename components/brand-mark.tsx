import { BRAND, brandLockup } from "@/lib/branding";

export function BrandMark({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
        <span className="font-serif tracking-tight">{BRAND.appName}</span>
        <span className="text-[0.7em] font-medium opacity-70">{BRAND.signature}</span>
      </span>
    );
  }
  return (
    <span className={`block ${className}`}>
      <span className="font-serif tracking-tight">{BRAND.appName}</span>
      <span className="ml-1.5 text-sm font-medium opacity-70">{BRAND.signature}</span>
      <span className="sr-only">{brandLockup()}</span>
    </span>
  );
}
