# Content protection (honest limits)

KörkortGO makes casual copy, scrape, and screenshot-and-share harder. It does **not** make screenshots impossible.

## What is in place

| Layer | Mechanism |
|---|---|
| Select / copy | `.protected-content { user-select: none }`, no context menu, block Ctrl/Cmd+C/A/U/S/P and F12 on quiz/exam/Calcul/chat |
| Print | `beforeprint` / Print Screen are cancelled; the question is **not** hidden when the window loses focus |
| Images | `content/media/…` or private Vercel Blob → `/api/media/:path*?exp=&sig=` (HMAC, 5 min) → canvas + watermark. Nested Manzi keys (`T3/…/exam.php-filer/NNN.jpg`) are signed as the full logical path. |
| Bank | `import "server-only"` on `lib/questions/bank.ts`. Session API only. |
| Transport | CSP, `X-Frame-Options: DENY`, `Cache-Control: private, no-store` |
| Legal | ToS must be accepted at onboarding |

## What still works for an attacker

- OS screenshot / snipping tool / another camera
- DevTools on a loaded session slice (not the full bank)
- Recording the display
- Switching away from the tab (web study/exam no longer hides the question)

Treat this as **friction + legal notice**, not DRM. Web study/exam does **not** use a focus-loss overlay.

## Android (FLAG_SECURE)

The Capacitor APK sets `WindowManager.LayoutParams.FLAG_SECURE` on the activity. Android then blocks most screenshots and Recents thumbnails. Rebuild after `cap sync` with `npm run apk` so [scripts/patch-android.mjs](../scripts/patch-android.mjs) re-applies the flag. Details: [ANDROID.md](ANDROID.md).

## Production

Set `SESSION_SECRET` (long random). The HMAC signs cookies and media tokens. The in-memory rate limiter is per instance (fine for a single Vercel region demo; use Redis/Upstash if you scale out).
