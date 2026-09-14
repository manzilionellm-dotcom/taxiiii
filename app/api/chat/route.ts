import { answerWithModel, groundedFallback } from "@/lib/rag/answer";
import { clientKey, limitedJson, rateLimit } from "@/lib/protect/rate-limit";
import { withPrivateHeaders } from "@/lib/protect/http";
import { ensureSession } from "@/lib/protect/session";
import type { ChatTurn, Locale } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { session, setCookie } = await ensureSession(request);
  const limited = rateLimit(`chat:${clientKey(request, session.id)}`, 20);
  if (!limited.ok) return limitedJson(limited.retryAfter);

  const body = (await request.json()) as {
    message?: string;
    history?: ChatTurn[];
    locale?: Locale;
    recentMisses?: string[];
  };
  const message = body.message?.trim() ?? "";
  const locale = body.locale === "sv" ? "sv" : "fr";
  const history = Array.isArray(body.history) ? body.history : [];
  const recentMisses = Array.isArray(body.recentMisses)
    ? body.recentMisses.filter((id) => typeof id === "string").slice(0, 6)
    : [];
  if (!message) {
    return Response.json(groundedFallback("", locale, history, recentMisses), {
      headers: withPrivateHeaders(undefined, setCookie),
    });
  }
  const result = await answerWithModel(message, locale, history, recentMisses);
  return Response.json(result, { headers: withPrivateHeaders(undefined, setCookie) });
}
