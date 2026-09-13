# Android APK — KörkortGO by MZ

The Play-store-ready wrapper is **Capacitor 7**. The Next.js app stays on Vercel (API routes, session-signed media, RAG). The APK is a WebView shell with **FLAG_SECURE** so Android blocks screenshots and Recents previews.

App id: `se.mz.korkortgo` (from [`lib/branding.ts`](../lib/branding.ts) `native.appId`).  
Label: **KörkortGO**.  
Default URL: `native.serverUrl` → `https://taxiiii.vercel.app`.

Override the URL when building:

```bash
CAPACITOR_SERVER_URL=https://your-preview.vercel.app npm run apk
```

Questions still come from the **server** (`/api/questions`) once that host is live. Drop the full Manzi (~1475) and research (~193) banks with the import scripts — do not invent Swedish. See [IMPORT.md](IMPORT.md).

## Install on a phone (Lionel)

1. On the phone: **Settings → Security → Install unknown apps** (or **Allow from this source**) for Chrome / Files / Drive.
2. Download [`releases/KorkortGO-by-MZ-debug.apk`](../releases/KorkortGO-by-MZ-debug.apk).
3. Open the file → **Install**.
4. First launch needs **internet**. The WebView loads the Vercel host. After you merge this PR, production `https://taxiiii.vercel.app` is KörkortGO; until then point `CAPACITOR_SERVER_URL` at the PR preview (Vercel Authentication may show a login unless protection is off).

This is a **debug-signed** APK (fine for first handoff). For Play Store later: `cd android && ./gradlew assembleRelease` with your keystore.

## Rebuild on this machine

Needs JDK 17+ and Android SDK (`ANDROID_HOME`).

```bash
export ANDROID_HOME=$HOME/android-sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

npm install
npm run native:icon          # optional, regenerates assets/icon.png
npx cap add android          # first time only
npm run apk                  # cap sync + FLAG_SECURE patch + assembleDebug
```

Output: `releases/KorkortGO-by-MZ-debug.apk` and `android/app/build/outputs/apk/debug/app-debug.apk`.

`scripts/patch-android.mjs` writes `FLAG_SECURE` on `MainActivity` after every sync so `cap sync` cannot drop it.

## Content protection on device

| Layer | Where |
|---|---|
| `FLAG_SECURE` | Android activity (blocks screenshot / Recents) |
| Web overlay, no-copy, signed media | existing Next.js app (see [CONTENT-PROTECTION.md](CONTENT-PROTECTION.md)) |

A second phone photographing the glass still works. Native flags are extra friction, not DRM.
