# Native wrap (Android shipped)

KörkortGO Android is a **Capacitor 7** WebView (`se.mz.korkortgo`) that loads the Vercel Next.js app. See [ANDROID.md](ANDROID.md) to install or rebuild the APK.

The web stack cannot mark the framebuffer as non-capturable. Native flags add a layer:

| Platform | API | Status |
|---|---|---|
| Android (Capacitor WebView) | `WindowManager.LayoutParams.FLAG_SECURE` on `MainActivity` | **Shipped** — `scripts/patch-android.mjs` |
| iOS (Capacitor / WKWebView) | `UIScreen.capturedDidChangeNotification` + blur | Not built yet |
| TWA | Same FLAG_SECURE on the Trusted Web Activity | Alternative; Capacitor is the current APK |

Keep the web overlay + signed media. Native flags are an extra layer, not a replacement. A second camera pointed at the glass is still possible.
