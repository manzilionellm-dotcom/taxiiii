# Native wrap (Android Play AAB shipped)

KörkortGO Android is a **Capacitor 7** WebView (`se.mz.korkortgo`, label **KörkortGO by MZ**) that loads the Vercel Next.js app at `https://taxiiii.vercel.app`. Play upload is the `.aab` from `npm run aab`. See [ANDROID.md](ANDROID.md) and [PLAY-CONSOLE.md](PLAY-CONSOLE.md).

The web stack cannot mark the framebuffer as non-capturable. Native flags are the product layer:

| Platform | API | Status |
|---|---|---|
| Android (Capacitor WebView) | `WindowManager.LayoutParams.FLAG_SECURE` on `MainActivity` + `setRecentsScreenshotEnabled(false)` (API 33+) | **Shipped** — `scripts/patch-android.mjs` |
| iOS (Capacitor / WKWebView) | `UIScreen.capturedDidChangeNotification` + blur | Not built yet |
| TWA | Same FLAG_SECURE on the Trusted Web Activity | Alternative; Capacitor is the current Play wrapper |

Do not rely on web blur / focus-hide for screenshot blocking. A second camera pointed at the glass is still possible.
