import { trackLabel } from "@/lib/branding";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function TrustStrip({ locale }: { locale: Locale }) {
  const dict = t(locale);
  const items = [
    `${dict.swedish} + ${dict.french}`,
    dict.trustReady,
    `${trackLabel("b")} · ${trackLabel("taxi")} · ${trackLabel("owner")}`,
  ];

  return (
    <ul className="trust-strip">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
