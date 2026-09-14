import { LAW_WATCH_META } from "@/lib/law-watch-meta";

export interface LawWatchMeta {
  lastIngest: string | null;
  updatedAt: string;
  status: "scaffold" | "draft" | "merged";
  cadenceDays?: number;
}

export function lawWatchMeta(): LawWatchMeta {
  return {
    lastIngest: LAW_WATCH_META.lastIngest ?? null,
    updatedAt: LAW_WATCH_META.updatedAt,
    status: LAW_WATCH_META.status,
    cadenceDays: LAW_WATCH_META.cadenceDays ?? 2,
  };
}

export function lawWatchFresh(now = new Date(), windowDays = 3) {
  const iso = lawWatchMeta().lastIngest;
  if (!iso) return false;
  const then = new Date(iso);
  const delta = now.getTime() - then.getTime();
  return delta >= 0 && delta <= windowDays * 24 * 60 * 60 * 1000;
}

export function lawWatchDateLabel(locale: "fr" | "sv") {
  const iso = lawWatchMeta().lastIngest || lawWatchMeta().updatedAt;
  if (!iso) return "";
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString(locale === "fr" ? "fr-FR" : "sv-SE", {
    day: "numeric",
    month: "short",
  });
}
