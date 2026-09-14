# Android — KörkortGO by MZ (Play Store)

The shipped product is a **Capacitor 7** Android app (`se.mz.korkortgo`) that loads the live Next.js site at **https://taxiiii.vercel.app**. The web app stays a prototype for study; Google Play is where anti-screenshot belongs.

Anti-screenshot is native **`FLAG_SECURE`** on `MainActivity` (plus Recents screenshot disabled on API 33+). Do **not** rely on web blur / focus-hide.

| Field | Value |
|---|---|
| Application id | `se.mz.korkortgo` |
| Launcher name | **KörkortGO by MZ** |
| Slogan | Förstå teorin. Klara provet. |
| versionCode | `1` |
| versionName | `1.0.0` |
| minSdk | **23** |
| compileSdk / targetSdk | **35** |
| Permissions | `INTERNET`, `VIBRATE` (haptics plugin) |
| WebView URL | `https://taxiiii.vercel.app` (`CAPACITOR_SERVER_URL` override) |

Full Play Console steps: [PLAY-CONSOLE.md](PLAY-CONSOLE.md).

## Install a sideload APK (test only)

1. Phone: **Settings → Security → Install unknown apps** for Chrome / Files.
2. Open the **release-signed** APK (not the old debug APK) → **Install**.
3. First launch needs **internet**. WebView loads `https://taxiiii.vercel.app`.
4. If a debug build with the same id is already installed, uninstall it first (different signing key).

This is **not** the Play upload. Play Console wants the **AAB**.

## Rebuild Play artifacts

Needs **JDK 17+** (21 is fine) and Android SDK (`ANDROID_HOME`) with `platforms;android-35` and `build-tools;35.0.0`.

```bash
export ANDROID_HOME=$HOME/android-sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

npm install
npm run keystore          # first time only — writes gitignored secrets/
npm run aab               # cap sync + FLAG_SECURE patch + bundleRelease + assembleRelease
```

Outputs (gitignored):

- `dist/play/KorkortGO-by-MZ-1.0.0.aab` — upload this to Play Console
- `dist/play/KorkortGO-by-MZ-1.0.0.apk` — sideload test
- Gradle copies: `android/app/build/outputs/bundle/release/app-release.aab`
- `android/app/build/outputs/apk/release/app-release.apk`

Debug APK (not for Play): `npm run apk` → `releases/KorkortGO-by-MZ-debug.apk`.

`scripts/patch-android.mjs` rewrites `MainActivity` after every `cap sync` so Capacitor cannot drop `FLAG_SECURE`.

## Signing

Release builds read `android/keystore.properties` or `secrets/keystore.properties` (both gitignored). Example: [android/keystore.properties.example](../android/keystore.properties.example).

The **upload keystore is never committed**. See `secrets/README.md` and the local `secrets/PLAY-SIGNING.note.md` created by `npm run keystore`.
