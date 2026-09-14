# Play Console — KörkortGO by MZ

First production upload for package **`se.mz.korkortgo`**.

## What to upload

Use the **Android App Bundle** (`.aab`), not the APK.

1. Open [Google Play Console](https://play.google.com/console) → Create app (or the existing draft).
2. App name: **KörkortGO by MZ**
3. Default language: Swedish (`sv-SE`)
4. App or game: **App** · Free · Category **Education** (or Auto & Vehicles)
5. **Release → Production** (or Internal testing first) → Create release → **Upload AAB**
6. File: `dist/play/KorkortGO-by-MZ-1.0.0.aab`

Play App Signing: Google generates and holds the **app signing key**. The keystore in `secrets/` is only the **upload key**. Keep it forever.

Upload certificate fingerprint for this first keystore (public, not a password):

- SHA-256: `F4:C4:85:F4:D6:A2:F5:66:04:60:96:CC:F1:0A:32:0E:30:9A:5D:9F:AC:B6:7F:77:8D:33:38:5A:0A:26:CE:45`

## Store listing (starter)

| Field | Copy |
|---|---|
| Title | KörkortGO by MZ |
| Short description | Förstå teorin. Klara provet. Körkort, Taxi och Taxi Företag. |
| Full description | KörkortGO by MZ — Förstå teorin. Klara provet. Lär dig på svenska. Förstå på ditt språk. Professionell teoriprov-träning för Körkort (permis B), Taxi (taxiförarlegitimation) och Taxi Företag (taxitrafiktillstånd). |

You still need Play assets Google will block the release without: icon 512×512, feature graphic 1024×500, 2+ phone screenshots, privacy policy URL, content rating questionnaire, target audience, Data safety form.

Data safety (honest baseline for this wrapper):

- App collects / shares: follow whatever the live site at `https://taxiiii.vercel.app` does (account/profile in localStorage is on-device; network goes to Vercel).
- Screenshots: blocked with `FLAG_SECURE` (declare screenshot restriction if the form asks).

## App identity (must match the AAB)

| Field | Value |
|---|---|
| Package name / applicationId | `se.mz.korkortgo` |
| versionCode | `1` |
| versionName | `1.0.0` |
| minSdkVersion | `23` (Android 6) |
| targetSdkVersion | `35` |
| compileSdk | `35` |

Bump `versionCode` (and usually `versionName`) in `android/app/build.gradle` for every new Play upload.

## Permissions

Declared in `android/app/src/main/AndroidManifest.xml`:

| Permission | Why |
|---|---|
| `android.permission.INTERNET` | Load `https://taxiiii.vercel.app` in the WebView |

No camera, storage, location, or notifications. Keep it that way unless a native plugin truly needs more.

## FLAG_SECURE

`MainActivity` sets `WindowManager.LayoutParams.FLAG_SECURE` on create / start / resume / focus, and `setRecentsScreenshotEnabled(false)` on API 33+. Android then blocks screenshots, most screen recording, Recents thumbnails, and lock-screen previews of the activity.

Confirm in source before upload:

```bash
grep -n FLAG_SECURE android/app/src/main/java/se/mz/korkortgo/MainActivity.java
```

## After the AAB is on Play

1. Roll out to **Internal testing** first, install from the testing link, confirm the site loads and screenshots are blocked (system Screenshot should fail or capture a black frame).
2. Complete Data safety + content rating + privacy policy.
3. Promote to Production when Play review is green.

Uninstall any **debug-signed** `se.mz.korkortgo` APK on the test phone before installing the Play build.
