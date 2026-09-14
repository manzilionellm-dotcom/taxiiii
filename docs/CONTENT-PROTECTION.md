# Content protection (honest limits)

**Web (`taxiiii.vercel.app`) is a prototype.** Study/exam must stay usable when the window loses focus. There is no « Innehållet är dolt » overlay and no aggressive web anti-screenshot. Image watermarks may still appear.

**The real product** is the Android app on Google Play (`se.mz.korkortgo`), which uses native `FLAG_SECURE`. See [ANDROID.md](ANDROID.md) and [PLAY-CONSOLE.md](PLAY-CONSOLE.md).

KörkortGO still makes casual scrape-and-share a bit harder on the server side. It does **not** make screenshots impossible on the web.

## What is in place

| Layer | Mechanism |
|---|---|
| Web study/exam | No hide-on-blur / hide-on-visibility overlay. Questions stay visible when multitasking. |
| Images | `content/media/…` or private Vercel Blob → `/api/media/:path*?exp=&sig=` (HMAC, 5 min) → canvas + optional watermark. Nested Manzi keys (`T3/…/exam.php-filer/NNN.jpg`) are signed as the full logical path. |
| Bank | `import "server-only"` on `lib/questions/bank.ts`. Session API only. |
| Transport | CSP, `X-Frame-Options: DENY`, `Cache-Control: private, no-store` |
| Legal | ToS must be accepted at onboarding |
| Android Play | Native `FLAG_SECURE` on `MainActivity` + Recents screenshot disabled (API 33+) |

## What still works on web

- Switching away from the tab — the question stays visible
- OS screenshot / snipping tool / another camera
- DevTools on a loaded session slice (not the full bank)
- Recording the display

On the **Play/APK** build, OS screenshots are blocked by `FLAG_SECURE` (black frame / system error). A second camera pointed at the glass still works.

## Android (FLAG_SECURE) — the Play product control

The Capacitor app sets `WindowManager.LayoutParams.FLAG_SECURE` on `MainActivity` (also `setRecentsScreenshotEnabled(false)` on API 33+). Android then blocks screenshots, most capture APIs, Recents thumbnails, and lock-screen previews. Rebuild with `npm run aab` so [scripts/patch-android.mjs](../scripts/patch-android.mjs) re-applies the flag after `cap sync`.

This is independent of any web overlay. Do not reintroduce a blur/focus hide as a substitute. Details: [ANDROID.md](ANDROID.md) · Play upload: [PLAY-CONSOLE.md](PLAY-CONSOLE.md).

## Production

Set `SESSION_SECRET` (long random). The HMAC signs cookies and media tokens. The in-memory rate limiter is per instance (fine for a single Vercel region demo; use Redis/Upstash if you scale out).
