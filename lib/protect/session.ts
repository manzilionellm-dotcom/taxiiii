import { SESSION_COOKIE, SESSION_DAYS, sessionSecret } from "@/lib/protect/constants";
import { randomId, signPayload, verifyPayload } from "@/lib/protect/sign";

export interface ViewerSession {
  id: string;
  iat: number;
  label: string;
}

function utf8ToB64url(text: string) {
  return btoa(unescape(encodeURIComponent(text)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function b64urlToUtf8(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return decodeURIComponent(escape(atob(padded + pad)));
}

function encodeCookie(session: ViewerSession, signature: string) {
  return `${utf8ToB64url(JSON.stringify(session))}.${signature}`;
}

function decodeCookie(value: string): { session: ViewerSession; signature: string } | null {
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  try {
    const session = JSON.parse(b64urlToUtf8(value.slice(0, dot))) as ViewerSession;
    if (!session?.id || !session.iat) return null;
    return { session, signature: value.slice(dot + 1) };
  } catch {
    return null;
  }
}

export function watermarkLabel(name?: string, email?: string, id?: string) {
  const who = [email?.trim(), name?.trim()].filter(Boolean)[0];
  const short = (id ?? randomId()).slice(0, 8);
  return who ? `${who} · ${short}` : `session ${short}`;
}

export async function createSession(label?: string): Promise<ViewerSession> {
  const id = randomId();
  return {
    id,
    iat: Date.now(),
    label: label?.trim() || watermarkLabel(undefined, undefined, id),
  };
}

export async function serializeSession(session: ViewerSession) {
  const payload = JSON.stringify(session);
  const signature = await signPayload(sessionSecret(), payload);
  return encodeCookie(session, signature);
}

export async function readSession(request: Request): Promise<ViewerSession | null> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  if (!match?.[1]) return null;
  const decoded = decodeCookie(decodeURIComponent(match[1]));
  if (!decoded) return null;
  const maxAge = SESSION_DAYS * 24 * 60 * 60 * 1000;
  if (Date.now() - decoded.session.iat > maxAge) return null;
  const ok = await verifyPayload(
    sessionSecret(),
    JSON.stringify(decoded.session),
    decoded.signature,
  );
  return ok ? decoded.session : null;
}

export function sessionCookieHeader(token: string) {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export async function ensureSession(
  request: Request,
  label?: string,
): Promise<{ session: ViewerSession; setCookie?: string }> {
  const existing = await readSession(request);
  if (existing) {
    if (label && label !== existing.label) {
      const next = { ...existing, label };
      return { session: next, setCookie: sessionCookieHeader(await serializeSession(next)) };
    }
    return { session: existing };
  }
  const session = await createSession(label);
  return { session, setCookie: sessionCookieHeader(await serializeSession(session)) };
}

export async function signMediaToken(name: string, sessionId: string, exp = Date.now() + 5 * 60 * 1000) {
  const payload = `${name}|${sessionId}|${exp}`;
  const sig = await signPayload(sessionSecret(), payload);
  return { exp, sig };
}

export async function verifyMediaToken(
  name: string,
  sessionId: string,
  expRaw: string | null,
  sig: string | null,
) {
  const exp = Number(expRaw);
  if (!sig || !Number.isFinite(exp) || exp < Date.now()) return false;
  return verifyPayload(sessionSecret(), `${name}|${sessionId}|${exp}`, sig);
}
