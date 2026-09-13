# Native wrap (future)

The web stack cannot mark the framebuffer as non-capturable. If KörkortGO is later wrapped:

| Platform | API | Note |
|---|---|---|
| Android (Capacitor / TWA / WebView) | `WindowManager.LayoutParams.FLAG_SECURE` | Blocks most system screenshots and recents previews. Set on the Activity that hosts the WebView. |
| iOS (Capacitor / WKWebView) | Screen-capture notifications (`UIScreen.capturedDidChangeNotification`) + prefer not to advertise ReplayKit | You can blur the native layer when `isCaptured` is true. There is no public equivalent of FLAG_SECURE. |
| TWA | Same as Android FLAG_SECURE on the Trusted Web Activity | Still does nothing to a second phone photographing the glass. |

Keep the web overlay + signed media even after a native wrap. Native flags are an extra layer, not a replacement.
