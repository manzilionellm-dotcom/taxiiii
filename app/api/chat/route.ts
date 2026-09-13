import { answerWithModel, groundedFallback } from "@/lib/rag/answer";
import type { ChatTurn, Locale } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    message?: string;
    history?: ChatTurn[];
    locale?: Locale;
  };
  const message = body.message?.trim() ?? "";
  const locale = body.locale === "sv" ? "sv" : "fr";
  const history = Array.isArray(body.history) ? body.history : [];
  if (!message) {
    return Response.json(groundedFallback("", locale, history));
  }
  const result = await answerWithModel(message, locale, history);
  return Response.json(result);
}
