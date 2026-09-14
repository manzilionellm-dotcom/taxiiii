# Content protection (honest limits)

**Web (`taxiiii.vercel.app`) is a prototype.** Study/exam must stay usable when the window loses focus. There is no « Innehållet är dolt » overlay and no aggressive web anti-screenshot. Image watermarks may still appear.

**The real product** is the Android APK for Google Play, which uses native `FLAG_SECURE`. APK / Play packaging is a follow-up — not this web hotfix.

KörkortGO still makes casual scrape-and-share a bit harder on the server side. It does **not** make screenshots impossible on the web.

## What is in place

| Layer | Mechanism |
|---|---|
| Web study/exam | No hide-on-blur / hide-on-visibility overlay. Questions stay visible when multitasking. |
| Images | `content/media/…` or private Vercel Blob → `/api/media/:path*?exp=&sig=` (HMAC, 5 min) → canvas + optional watermark. Nested Manzi keys (`T3/…/exam.php-filer/NNN.jpg`) are signed as the full logical path. |
| Bank | `import "server-only"` on `lib/questions/bank.ts`. Session API only. |
| Transport | CSP, `X-Frame-Options: DENY`, `Cache-Control: private, no-store` |
| Legal | ToS must be accepted at onboarding |
| Android APK | `FLAG_SECURE` on the Capacitor activity (Play packaging is a later PR) |

## What still works on web

- Switching away from the tab — the question stays visible
- OS screenshot / snipping tool / another camera
- DevTools on a loaded session slice (not the full bank)
- Recording the display

## Android (FLAG_SECURE)

The Capacitor APK sets `WindowManager.LayoutParams.FLAG_SECURE` on the activity. Android then blocks most screenshots and Recents thumbnails. Rebuild after `cap sync` with `npm run apk` so [scripts/patch-android.mjs](../scripts/patch-android.mjs) re-applies the flag. Details: [ANDROID.md](ANDROID.md).

## Production

Set `SESSION_SECRET` (long random). The HMAC signs cookies and media tokens. The in-memory rate limiter is per instance (fine for a single Vercel region demo; use Redis/Upstash if you scale out).
