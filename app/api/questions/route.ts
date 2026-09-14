import { catalogForTrack, pickExam, pickResume, pickStudy, protectQuestion } from "@/lib/questions/session-pick";
import { clientKey, limitedJson, rateLimit } from "@/lib/protect/rate-limit";
import { withPrivateHeaders } from "@/lib/protect/http";
import { ensureSession } from "@/lib/protect/session";
import { TOPICS, type Topic, type Track } from "@/lib/types";

export const runtime = "nodejs";

function parseTrack(value: string | null): Track | null {
  return value === "b" || value === "taxi" || value === "owner" ? value : null;
}

function parseTopic(value: string | null): Topic | null {
  return value && (TOPICS as readonly string[]).includes(value) ? (value as Topic) : null;
}

export async function GET(request: Request) {
  const { session, setCookie } = await ensureSession(request);
  const limited = rateLimit(`questions:${clientKey(request, session.id)}`, 40);
  if (!limited.ok) return limitedJson(limited.retryAfter);

  const url = new URL(request.url);
  const track = parseTrack(url.searchParams.get("track"));
  const mode = url.searchParams.get("mode") ?? "meta";

  if (!track) {
    return Response.json(
      { error: "track required" },
      { status: 400, headers: withPrivateHeaders(undefined, setCookie) },
    );
  }

  if (mode === "meta") {
    const catalog = catalogForTrack(track);
    return Response.json(
      { count: catalog.length, catalog },
      { headers: withPrivateHeaders(undefined, setCookie) },
    );
  }

  if (mode !== "study" && mode !== "exam") {
    return Response.json(
      { error: "unknown mode" },
      { status: 400, headers: withPrivateHeaders(undefined, setCookie) },
    );
  }

  const dueTokens = (url.searchParams.get("due") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const due = new Set(dueTokens);
  const dueForms: Record<string, string> = {};
  for (const token of dueTokens) {
    const [id, form] = token.split("~");
    if (id && form) dueForms[id] = form;
  }
  const resumeIds = (url.searchParams.get("resume") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const picked =
    mode === "exam"
      ? pickExam(track)
      : resumeIds.length
        ? pickResume(track, resumeIds, dueForms)
        : pickStudy(
            track,
            due,
            url.searchParams.get("fragile") === "1",
            dueForms,
            parseTopic(url.searchParams.get("topic") || url.searchParams.get("focus")),
          );
  const questions = await Promise.all(picked.map((item) => protectQuestion(item, session)));

  return Response.json(
    { count: questions.length, questions, watermark: session.label },
    { headers: withPrivateHeaders(undefined, setCookie) },
  );
}
