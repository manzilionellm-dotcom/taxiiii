import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const secretsDir = join(root, "secrets");
const keystorePath = join(secretsDir, "korkortgo-upload.keystore");
const propsPath = join(secretsDir, "keystore.properties");
const androidPropsPath = join(root, "android/keystore.properties");
const notePath = join(secretsDir, "PLAY-SIGNING.note.md");
const alias = "korkortgo-upload";

function run(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: "utf8" });
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim();
    throw new Error(`${cmd} ${args.join(" ")} failed: ${err}`);
  }
  return (result.stdout || "") + (result.stderr || "");
}

if (existsSync(keystorePath) && process.argv[2] !== "--force") {
  console.error("Refusing to overwrite existing", keystorePath);
  console.error("Pass --force only if you intend to mint a NEW upload key (breaks Play updates).");
  process.exit(1);
}

mkdirSync(secretsDir, { recursive: true });

const password = randomBytes(24).toString("base64url");

run("keytool", [
  "-genkeypair",
  "-v",
  "-keystore",
  keystorePath,
  "-storetype",
  "PKCS12",
  "-keyalg",
  "RSA",
  "-keysize",
  "2048",
  "-validity",
  "10000",
  "-alias",
  alias,
  "-storepass",
  password,
  "-keypass",
  password,
  "-dname",
  "CN=KorkortGO by MZ, OU=MZ, O=MZ, L=Stockholm, ST=Stockholm, C=SE",
]);

const props = [
  `storeFile=${keystorePath}`,
  `storePassword=${password}`,
  `keyAlias=${alias}`,
  `keyPassword=${password}`,
  "",
].join("\n");

writeFileSync(propsPath, props, { mode: 0o600 });
writeFileSync(androidPropsPath, props, { mode: 0o600 });

const certOut = run("keytool", [
  "-list",
  "-v",
  "-keystore",
  keystorePath,
  "-storepass",
  password,
  "-alias",
  alias,
]);

const sha1 = certOut.match(/SHA1:\s*(.+)/)?.[1]?.trim() ?? "(see keytool -list)";
const sha256 = certOut.match(/SHA256:\s*(.+)/)?.[1]?.trim() ?? "(see keytool -list)";

const note = `# KörkortGO by MZ — Play upload key (SECRET)

**Do not commit this file. Do not paste it into the PR, Slack, or email.**

Package: \`se.mz.korkortgo\`
Keystore: \`${keystorePath}\`
Store type: PKCS12
Alias: \`${alias}\`
Validity: 10000 days

Store password: \`${password}\`
Key password: \`${password}\`

SHA-1: \`${sha1}\`
SHA-256: \`${sha256}\`

## How Lionel must store this

1. Download this note + \`korkortgo-upload.keystore\` from the Cursor agent artifacts (and keep the copies under \`secrets/\` on the build machine).
2. Put **both** the \`.keystore\` file and the two passwords in a password manager (1Password / Bitwarden) **and** an offline USB that is not the laptop you use daily.
3. Google Play App Signing: Play Console holds the **app signing key**. This file is only the **upload key**. You need it for every AAB you upload.
4. If this key is lost, use Play Console → Setup → App signing → Request upload key reset. You cannot recover the private key from the AAB.
5. Never add \`secrets/\`, \`*.keystore\`, or \`keystore.properties\` to git. \`git check-ignore -v secrets/korkortgo-upload.keystore\` should print a gitignore rule.

Rebuild:

\`\`\`bash
npm run aab
\`\`\`
`;

writeFileSync(notePath, note, { mode: 0o600 });

console.log("Created upload keystore:", keystorePath);
console.log("Passwords + fingerprints:", notePath);
console.log("SHA-256:", sha256);
