import { clientKey, limitedJson, rateLimit } from "@/lib/protect/rate-limit";
import { withPrivateHeaders } from "@/lib/protect/http";
import { ensureSession, watermarkLabel } from "@/lib/protect/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { name?: string; email?: string };
  const limited = rateLimit(`session:${clientKey(request)}`, 30);
  if (!limited.ok) return limitedJson(limited.retryAfter);
  const provisional = await ensureSession(request);
  const label = watermarkLabel(body.name, body.email, provisional.session.id);
  const { session, setCookie } = await ensureSession(request, label);
  return Response.json(
    { ok: true, watermark: session.label },
    { headers: withPrivateHeaders(undefined, setCookie) },
  );
}

export async function GET(request: Request) {
  const { session, setCookie } = await ensureSession(request);
  return Response.json(
    { ok: true, watermark: session.label },
    { headers: withPrivateHeaders(undefined, setCookie) },
  );
}
