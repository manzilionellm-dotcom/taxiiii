import { ensureClientSession } from "@/lib/protect/client-session";
import type { QuestionCatalogItem, SessionQuestion } from "@/lib/questions/session-types";
import type { Topic, Track } from "@/lib/types";

export type { QuestionCatalogItem, SessionQuestion };

export async function fetchCatalog(track: Track): Promise<QuestionCatalogItem[]> {
  await ensureClientSession();
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
  resumeIds?: string[];
  fragile?: boolean;
  topic?: Topic;
}): Promise<SessionQuestion[]> {
  const params = new URLSearchParams({
    mode: input.mode,
    track: input.track,
  });
  if (input.fragile) params.set("fragile", "1");
  if (input.dueIds?.length) params.set("due", input.dueIds.join(","));
  if (input.resumeIds?.length) params.set("resume", input.resumeIds.join(","));
  if (input.topic) params.set("topic", input.topic);
  await ensureClientSession();
  const response = await fetch(`/api/questions?${params}`, {
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error("session_load_failed");
  const data = (await response.json()) as { questions?: SessionQuestion[] };
  return data.questions ?? [];
}
