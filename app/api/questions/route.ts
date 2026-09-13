import { catalogForTrack, pickExam, pickStudy, protectQuestion } from "@/lib/questions/session-pick";
import { clientKey, limitedJson, rateLimit } from "@/lib/protect/rate-limit";
import { withPrivateHeaders } from "@/lib/protect/http";
import { ensureSession } from "@/lib/protect/session";
import type { Track } from "@/lib/types";

export const runtime = "nodejs";

function parseTrack(value: string | null): Track | null {
  return value === "b" || value === "taxi" ? value : null;
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

  const due = new Set(
    (url.searchParams.get("due") ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );
  const picked =
    mode === "exam"
      ? pickExam(track)
      : pickStudy(track, due, url.searchParams.get("fragile") === "1");
  const questions = await Promise.all(picked.map((item) => protectQuestion(item, session)));

  return Response.json(
    { count: questions.length, questions, watermark: session.label },
    { headers: withPrivateHeaders(undefined, setCookie) },
  );
}
