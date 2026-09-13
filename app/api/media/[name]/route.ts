import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { clientKey, limitedJson, rateLimit } from "@/lib/protect/rate-limit";
import { PRIVATE_CACHE } from "@/lib/protect/constants";
import { ensureSession, verifyMediaToken } from "@/lib/protect/session";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { session, setCookie } = await ensureSession(request);
  const limited = rateLimit(`media:${clientKey(request, session.id)}`, 80);
  if (!limited.ok) return limitedJson(limited.retryAfter);

  const { name: raw } = await context.params;
  const name = decodeURIComponent(raw);
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return new Response("invalid", { status: 400 });
  }

  const url = new URL(request.url);
  const ok = await verifyMediaToken(
    name,
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

  try {
    const file = await readFile(join(process.cwd(), "content/media", name));
    const headers = new Headers({
      "Content-Type": TYPES[extname(name).toLowerCase()] ?? "application/octet-stream",
      "Cache-Control": PRIVATE_CACHE,
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    });
    if (setCookie) headers.append("Set-Cookie", setCookie);
    return new Response(file, { headers });
  } catch {
    return new Response("missing", { status: 404, headers: { "Cache-Control": PRIVATE_CACHE } });
  }
}
