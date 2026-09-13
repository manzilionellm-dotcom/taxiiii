export const SESSION_COOKIE = "kk_sess";
export const SESSION_DAYS = 7;
export const MEDIA_TTL_MS = 5 * 60 * 1000;
export const CAPTURE_WINDOW_MS = 60_000;
export const CAPTURE_WARN_COUNT = 3;

export function sessionSecret() {
  return process.env.SESSION_SECRET || process.env.AUTH_SECRET || "dev-only-korklart-session";
}

export const SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), display-capture=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

export const PRIVATE_CACHE = "private, no-store, max-age=0, must-revalidate";
