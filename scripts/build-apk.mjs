import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || `${process.env.HOME}/android-sdk`;

function run(cmd, args, extraEnv = {}, cwd = root) {
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
      ANDROID_HOME: androidHome,
      ANDROID_SDK_ROOT: androidHome,
      ...extraEnv,
    },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(join(root, "assets/icon.png"))) {
  run("node", [join(root, "scripts/make-app-icon.mjs")]);
}
run("node", [join(root, "scripts/write-native-www.mjs")]);
run("npx", ["cap", "sync", "android"]);
run("node", [join(root, "scripts/patch-android.mjs")]);

const mainActivity = join(
  root,
  "android/app/src/main/java/se/mz/korkortgo/MainActivity.java",
);
if (!existsSync(mainActivity) || !readFileSync(mainActivity, "utf8").includes("FLAG_SECURE")) {
  console.error("FLAG_SECURE missing from MainActivity.java");
  process.exit(1);
}

const gradlew = join(root, "android/gradlew");
if (!existsSync(gradlew)) {
  console.error("android/gradlew missing — run npx cap add android first");
  process.exit(1);
}

run(gradlew, ["assembleDebug", "--no-daemon"], {
  JAVA_HOME: process.env.JAVA_HOME || "/usr/lib/jvm/java-21-openjdk-amd64",
}, join(root, "android"));

const apk = join(
  root,
  "android/app/build/outputs/apk/debug/app-debug.apk",
);
if (!existsSync(apk)) {
  console.error("APK not found at", apk);
  process.exit(1);
}

const destDir = join(root, "releases");
mkdirSync(destDir, { recursive: true });
const dest = join(destDir, "KorkortGO-by-MZ-debug.apk");
copyFileSync(apk, dest);
console.log("APK ready:", dest);
