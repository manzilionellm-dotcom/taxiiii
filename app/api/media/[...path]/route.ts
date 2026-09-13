import { clientKey, limitedJson, rateLimit } from "@/lib/protect/rate-limit";
import { PRIVATE_CACHE } from "@/lib/protect/constants";
import { ensureSession, verifyMediaToken } from "@/lib/protect/session";
import { isSafeMediaKey, toLogicalKey } from "@/lib/media/paths.mjs";
import { readMediaBytes } from "@/lib/media/store";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { session, setCookie } = await ensureSession(request);
  const limited = rateLimit(`media:${clientKey(request, session.id)}`, 80);
  if (!limited.ok) return limitedJson(limited.retryAfter);

  const { path: segments } = await context.params;
  const joined = (segments ?? []).map((part) => decodeURIComponent(part)).join("/");
  const key = toLogicalKey(joined);
  if (!key || !isSafeMediaKey(key)) {
    return new Response("invalid", { status: 400 });
  }

  const url = new URL(request.url);
  const ok = await verifyMediaToken(
    key,
    session.id,
    url.searchParams.get("exp"),
    url.searchParams.get("sig"),
  );
  if (!ok) {
    return new Response("expired", {
      status: 403,
      headers: { "Cache-Control": PRIVATE_CACHE },
    });
  }

  const media = await readMediaBytes(key);
  if (!media) {
    return new Response("missing", { status: 404, headers: { "Cache-Control": PRIVATE_CACHE } });
  }

  const headers = new Headers({
    "Content-Type": media.type,
    "Cache-Control": PRIVATE_CACHE,
    "Content-Disposition": "inline",
    "X-Content-Type-Options": "nosniff",
    "Content-Length": String(media.bytes.byteLength),
  });
  if (setCookie) headers.append("Set-Cookie", setCookie);
  return new Response(media.bytes, { headers });
}
