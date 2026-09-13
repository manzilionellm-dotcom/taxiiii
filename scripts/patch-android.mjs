import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib/branding.ts"), "utf8");
const appId = src.match(/appId:\s*"([^"]+)"/)?.[1];
if (!appId) throw new Error("native.appId missing from lib/branding.ts");

const rel = appId.replace(/\./g, "/");
const javaFile = join(root, "android/app/src/main/java", rel, "MainActivity.java");
const ktFile = join(root, "android/app/src/main/java", rel, "MainActivity.kt");

const javaSource = `package ${appId};

import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    applySecureFlag();
  }

  @Override
  public void onResume() {
    super.onResume();
    applySecureFlag();
  }

  private void applySecureFlag() {
    getWindow().setFlags(
      WindowManager.LayoutParams.FLAG_SECURE,
      WindowManager.LayoutParams.FLAG_SECURE
    );
  }
}
`;

const ktSource = `package ${appId}

import android.os.Bundle
import android.view.WindowManager
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    applySecureFlag()
  }

  override fun onResume() {
    super.onResume()
    applySecureFlag()
  }

  private fun applySecureFlag() {
    window.setFlags(
      WindowManager.LayoutParams.FLAG_SECURE,
      WindowManager.LayoutParams.FLAG_SECURE
    )
  }
}
`;

if (existsSync(ktFile)) {
  writeFileSync(ktFile, ktSource);
  console.log("patched", ktFile);
} else {
  writeFileSync(javaFile, javaSource);
  console.log("wrote", javaFile);
}

const stringsFile = join(root, "android/app/src/main/res/values/strings.xml");
if (existsSync(stringsFile)) {
  const appName = src.match(/appName:\s*"([^"]+)"/)?.[1] ?? "KörkortGO";
  let xml = readFileSync(stringsFile, "utf8");
  xml = xml.replace(
    /<string name="app_name">[^<]*<\/string>/,
    `<string name="app_name">${appName}</string>`,
  );
  xml = xml.replace(
    /<string name="title_activity_main">[^<]*<\/string>/,
    `<string name="title_activity_main">${appName}</string>`,
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

const splashSrc = join(root, "assets/splash.png");
const drawable = join(root, "android/app/src/main/res/drawable");
if (existsSync(splashSrc)) {
  mkdirSync(drawable, { recursive: true });
  copyFileSync(splashSrc, join(drawable, "splash.png"));
}

const sdkDir = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || `${process.env.HOME}/android-sdk`;
writeFileSync(
  join(root, "android/local.properties"),
  `sdk.dir=${sdkDir.replace(/\\/g, "\\\\")}\n`,
);
