import type { QuestionCatalogItem, SessionQuestion } from "@/lib/questions/session-types";
import type { Track } from "@/lib/types";

export type { QuestionCatalogItem, SessionQuestion };

export async function fetchCatalog(track: Track): Promise<QuestionCatalogItem[]> {
  const response = await fetch(`/api/questions?mode=meta&track=${track}`, {
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!response.ok) return [];
  const data = (await response.json()) as { catalog?: QuestionCatalogItem[] };
  return data.catalog ?? [];
}

export async function fetchSessionQuestions(input: {
  track: Track;
  mode: "study" | "exam";
  dueIds?: string[];
  fragile?: boolean;
}): Promise<SessionQuestion[]> {
  const params = new URLSearchParams({
    mode: input.mode,
    track: input.track,
  });
  if (input.fragile) params.set("fragile", "1");
  if (input.dueIds?.length) params.set("due", input.dueIds.join(","));
  const response = await fetch(`/api/questions?${params}`, {
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error("session_load_failed");
  const data = (await response.json()) as { questions?: SessionQuestion[] };
  return data.questions ?? [];
}
