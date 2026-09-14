import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const androidHome =
  process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || `${process.env.HOME}/android-sdk`;
const javaHome = process.env.JAVA_HOME || "/usr/lib/jvm/java-21-openjdk-amd64";

function run(cmd, args, extraEnv = {}, cwd = root) {
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
      ANDROID_HOME: androidHome,
      ANDROID_SDK_ROOT: androidHome,
      JAVA_HOME: javaHome,
      ...extraEnv,
    },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function assertFlagSecure() {
  const main = join(
    root,
    "android/app/src/main/java/se/mz/korkortgo/MainActivity.java",
  );
  const src = readFileSync(main, "utf8");
  if (!src.includes("FLAG_SECURE")) {
    console.error("FLAG_SECURE missing from MainActivity.java — refusing to ship");
    process.exit(1);
  }
  if (!src.includes("setRecentsScreenshotEnabled")) {
    console.error("setRecentsScreenshotEnabled missing from MainActivity.java");
    process.exit(1);
  }
}

const secretsKeystore = join(root, "secrets/korkortgo-upload.keystore");
const secretsProps = join(root, "secrets/keystore.properties");
const androidProps = join(root, "android/keystore.properties");

if (!existsSync(androidProps) && !existsSync(secretsProps)) {
  if (!existsSync(secretsKeystore)) {
    console.log("No upload keystore yet — creating one (gitignored).");
    run("node", [join(root, "scripts/create-upload-keystore.mjs")]);
  } else {
    console.error("Missing keystore.properties. Copy android/keystore.properties.example");
    process.exit(1);
  }
}

if (!existsSync(join(root, "assets/icon.png"))) {
  run("node", [join(root, "scripts/make-app-icon.mjs")]);
}

run("node", [join(root, "scripts/write-native-www.mjs")]);
run("npx", ["cap", "sync", "android"]);
run("node", [join(root, "scripts/patch-android.mjs")]);
assertFlagSecure();

const gradlew = join(root, "android/gradlew");
if (!existsSync(gradlew)) {
  console.error("android/gradlew missing — run npx cap add android first");
  process.exit(1);
}

run(gradlew, ["bundleRelease", "assembleRelease", "--no-daemon"], {}, join(root, "android"));

const aab = join(root, "android/app/build/outputs/bundle/release/app-release.aab");
const apk = join(root, "android/app/build/outputs/apk/release/app-release.apk");
if (!existsSync(aab)) {
  console.error("AAB not found at", aab);
  process.exit(1);
}
if (!existsSync(apk)) {
  console.error("APK not found at", apk);
  process.exit(1);
}

const destDir = join(root, "dist/play");
mkdirSync(destDir, { recursive: true });
const aabDest = join(destDir, "KorkortGO-by-MZ-1.0.0.aab");
const apkDest = join(destDir, "KorkortGO-by-MZ-1.0.0.apk");
copyFileSync(aab, aabDest);
copyFileSync(apk, apkDest);

console.log("AAB ready:", aabDest);
console.log("APK ready:", apkDest);
console.log("FLAG_SECURE confirmed in MainActivity.java");
