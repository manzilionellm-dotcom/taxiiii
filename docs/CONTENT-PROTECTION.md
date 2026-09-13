# Content protection (honest limits)

KörkortGO makes casual copy, scrape, and screenshot-and-share harder. It does **not** make screenshots impossible.

## What is in place

| Layer | Mechanism |
|---|---|
| Select / copy | `.protected-content { user-select: none }`, no context menu, block Ctrl/Cmd+C/A/U/S/P and F12 on quiz/exam/Calcul/chat |
| Focus | `visibilitychange`, `blur`, `beforeprint`, Print Screen → black overlay |
| Exam | Overlay + short delay before “Jag är tillbaka” |
| Images | `content/media/` → `/api/media/:name?exp=&sig=` (HMAC, 5 min) → canvas + watermark |
| Bank | `import "server-only"` on `lib/questions/bank.ts`. Session API only. |
| Transport | CSP, `X-Frame-Options: DENY`, `Cache-Control: private, no-store` |
| Legal | ToS must be accepted at onboarding; warning after 3 hides in 60 s |

## What still works for an attacker

- OS screenshot / snipping tool / another camera
- DevTools on a loaded session slice (not the full bank)
- Recording the display
- A modified client that ignores the overlay

Treat this as **friction + legal notice**, not DRM.

## Android (FLAG_SECURE)

The Capacitor APK sets `WindowManager.LayoutParams.FLAG_SECURE` on the activity. Android then blocks most screenshots and Recents thumbnails. Rebuild after `cap sync` with `npm run apk` so [scripts/patch-android.mjs](../scripts/patch-android.mjs) re-applies the flag. Details: [ANDROID.md](ANDROID.md).

## Production

Set `SESSION_SECRET` (long random). The HMAC signs cookies and media tokens. The in-memory rate limiter is per instance (fine for a single Vercel region demo; use Redis/Upstash if you scale out).
