# KörkortGO by MZ — Android artifacts

**Id:** `se.mz.korkortgo` · **Label:** KörkortGO by MZ · slogan **Förstå teorin. Klara provet.**

Play Console wants the **AAB**, not this folder’s old debug APK.

| Artifact | Where (not committed) |
|---|---|
| Play upload AAB | `dist/play/KorkortGO-by-MZ-1.0.0.aab` |
| Sideload release APK | `dist/play/KorkortGO-by-MZ-1.0.0.apk` |
| Gradle AAB | `android/app/build/outputs/bundle/release/app-release.aab` |
| Gradle APK | `android/app/build/outputs/apk/release/app-release.apk` |

Rebuild: `npm run aab`. Signing note (gitignored): `secrets/PLAY-SIGNING.note.md`. Steps: [docs/PLAY-CONSOLE.md](../docs/PLAY-CONSOLE.md).

The debug APK `KorkortGO-by-MZ-debug.apk` (rebuilt 2026-09-14 after #23) is the **sideload test** build. It is debug-signed (`se.mz.korkortgo` 1.0.0), loads **https://taxiiii.vercel.app**, and keeps native `FLAG_SECURE`. Uninstall any older debug/release build of the same id before installing. Not for Play Console — Play wants the AAB.
