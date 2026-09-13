import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { blobRefForManifest, contentTypeFor, isSafeMediaKey, toLogicalKey } from "@/lib/media/paths.mjs";

type ManifestFile = {
  pathname: string;
  size: number;
  contentType?: string;
  url?: string;
};

type Manifest = {
  version: number;
  files: Record<string, ManifestFile>;
};

let manifestCache: Manifest | null = null;

function mediaRoot() {
  return resolve(process.cwd(), "content/media");
}

export async function loadManifest(): Promise<Manifest> {
  if (manifestCache) return manifestCache;
  try {
    const raw = await readFile(resolve(process.cwd(), "data/media-manifest.json"), "utf8");
    manifestCache = JSON.parse(raw) as Manifest;
  } catch {
    manifestCache = { version: 1, files: {} };
  }
  return manifestCache;
}

export async function readLocalMedia(key: string) {
  const logical = toLogicalKey(key);
  if (!logical || !isSafeMediaKey(logical)) return null;
  const dest = resolve(mediaRoot(), logical);
  if (!dest.startsWith(mediaRoot())) return null;
  try {
    const info = await stat(dest);
    if (!info.isFile()) return null;
    const file = await readFile(dest);
    return { bytes: Uint8Array.from(file), type: contentTypeFor(logical), size: info.size };
  } catch {
    return null;
  }
}

async function readBlobMedia(key: string) {
  const logical = toLogicalKey(key);
  if (!logical) return null;
  const entry = (await loadManifest()).files[logical];
  const blobRef = blobRefForManifest(entry);
  if (!blobRef || !process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { get } = await import("@vercel/blob");
    const result = await get(blobRef, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const buffer = Buffer.from(await new Response(result.stream).arrayBuffer());
    return {
      bytes: new Uint8Array(buffer),
      type: result.blob.contentType || entry?.contentType || contentTypeFor(logical),
      size: buffer.byteLength,
    };
  } catch {
    return null;
  }
}

export async function readMediaBytes(key: string) {
  const local = await readLocalMedia(key);
  if (local) return local;
  return readBlobMedia(key);
}

export function signedMediaPath(logicalKey: string, exp: number, sig: string) {
  const segments = logicalKey.split("/").map((part) => encodeURIComponent(part));
  return `/api/media/${segments.join("/")}?exp=${exp}&sig=${sig}`;
}
