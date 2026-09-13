import { PRIVATE_CACHE } from "@/lib/protect/constants";
import { ensureSession, watermarkLabel, type ViewerSession } from "@/lib/protect/session";

export function withPrivateHeaders(headers?: HeadersInit, setCookie?: string) {
  const next = new Headers(headers);
  next.set("Cache-Control", PRIVATE_CACHE);
  if (setCookie) next.append("Set-Cookie", setCookie);
  return next;
}

export async function requireSession(
  request: Request,
  label?: string,
): Promise<{ session: ViewerSession; setCookie?: string }> {
  return ensureSession(request, label);
}

export function sessionLabelFromBody(body: { name?: string; email?: string } | undefined, id: string) {
  return watermarkLabel(body?.name, body?.email, id);
}
