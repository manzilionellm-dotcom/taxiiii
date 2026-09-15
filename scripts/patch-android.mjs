import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib/branding.ts"), "utf8");
const appId = src.match(/appId:\s*"([^"]+)"/)?.[1];
if (!appId) throw new Error("native.appId missing from lib/branding.ts");

const displayName =
  src.match(/displayName:\s*"([^"]+)"/)?.[1] ??
  src.match(/appName:\s*"([^"]+)"/)?.[1] ??
  "KörkortGO by MZ";

const rel = appId.replace(/\./g, "/");
const javaFile = join(root, "android/app/src/main/java", rel, "MainActivity.java");
const ktFile = join(root, "android/app/src/main/java", rel, "MainActivity.kt");

const javaSource = `package ${appId};

import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

/**
 * Play Store shell for KörkortGO by MZ.
 *
 * Anti-screenshot is native {@link WindowManager.LayoutParams#FLAG_SECURE} on this
 * window (screenshots, screen capture, Recents thumbnail, lock-screen preview,
 * multi-window). Do not rely on web blur / focus-hide for this.
 */
public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    applySecureFlag();
    super.onCreate(savedInstanceState);
    applySecureFlag();
  }

  @Override
  public void onStart() {
    super.onStart();
    applySecureFlag();
  }

  @Override
  public void onResume() {
    super.onResume();
    applySecureFlag();
  }

  @Override
  public void onAttachedToWindow() {
    super.onAttachedToWindow();
    applySecureFlag();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    applySecureFlag();
  }

  private void applySecureFlag() {
    if (getWindow() == null) {
      return;
    }
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      setRecentsScreenshotEnabled(false);
    }
  }
}
`;

const ktSource = `package ${appId}

import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    applySecureFlag()
    super.onCreate(savedInstanceState)
    applySecureFlag()
  }

  override fun onStart() {
    super.onStart()
    applySecureFlag()
  }

  override fun onResume() {
    super.onResume()
    applySecureFlag()
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    applySecureFlag()
  }

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    super.onWindowFocusChanged(hasFocus)
    applySecureFlag()
  }

  private fun applySecureFlag() {
    val window = window ?: return
    window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      setRecentsScreenshotEnabled(false)
    }
  }
}
`;

if (existsSync(ktFile)) {
  writeFileSync(ktFile, ktSource);
  console.log("patched", ktFile);
} else {
  mkdirSync(dirname(javaFile), { recursive: true });
  writeFileSync(javaFile, javaSource);
  console.log("wrote", javaFile);
}

const stringsFile = join(root, "android/app/src/main/res/values/strings.xml");
if (existsSync(stringsFile)) {
  let xml = readFileSync(stringsFile, "utf8");
  xml = xml.replace(
    /<string name="app_name">[^<]*<\/string>/,
    `<string name="app_name">${displayName}</string>`,
  );
  xml = xml.replace(
    /<string name="title_activity_main">[^<]*<\/string>/,
    `<string name="title_activity_main">${displayName}</string>`,
  );
  writeFileSync(stringsFile, xml);
}

const manifest = join(root, "android/app/src/main/AndroidManifest.xml");
if (existsSync(manifest)) {
  let xml = readFileSync(manifest, "utf8");
  if (!xml.includes("android.permission.INTERNET")) {
    xml = xml.replace(
      "<application",
      '    <uses-permission android:name="android.permission.INTERNET" />\n    <application',
    );
  }
  xml = xml.replace(
    /android:usesCleartextTraffic="true"/,
    'android:usesCleartextTraffic="false"',
  );
  writeFileSync(manifest, xml);
}

/**
 * Launch screen art into every folder Android may resolve.
 *
 * This used to write `drawable/splash.png` only — but `cap sync` also lays
 * down `drawable-port-*` and `drawable-land-*` copies, and a qualified folder
 * always beats the unqualified one, so on a real phone the brand splash was
 * never the bitmap that rendered. Portrait art goes to the port buckets,
 * landscape art to the land buckets, portrait to the bare fallback.
 */
const res = join(root, "android/app/src/main/res");
const splashPort = join(root, "assets/splash-port.png");
const splashLand = join(root, "assets/splash-land.png");
const DENSITIES = ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"];
if (existsSync(splashPort) && existsSync(splashLand)) {
  const targets = [["drawable", splashPort]];
  for (const density of DENSITIES) {
    targets.push([`drawable-port-${density}`, splashPort]);
    targets.push([`drawable-land-${density}`, splashLand]);
  }
  for (const [folder, src] of targets) {
    const dir = join(res, folder);
    mkdirSync(dir, { recursive: true });
    copyFileSync(src, join(dir, "splash.png"));
  }
}

const sdkDir = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || `${process.env.HOME}/android-sdk`;
writeFileSync(
  join(root, "android/local.properties"),
  `sdk.dir=${sdkDir.replace(/\\/g, "\\\\")}\n`,
);
