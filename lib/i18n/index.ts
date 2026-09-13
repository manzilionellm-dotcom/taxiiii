import { fr } from "@/lib/i18n/fr";
import { sv, type Dictionary } from "@/lib/i18n/sv";
import type { Locale } from "@/lib/types";

const dictionaries: Record<Locale, Dictionary> = { sv, fr };

export function t(locale: Locale): Dictionary {
  return dictionaries[locale] ?? sv;
}

export { dictionaries };
