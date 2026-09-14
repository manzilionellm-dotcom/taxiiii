import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import {
  blobRefForManifest,
  contentTypeFor,
  isSafeMediaKey,
  mediaKeyIsPresent,
  toLogicalKey,
} from "@/lib/media/paths.mjs";

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
let confirmedPdfCache: Set<string> | null = null;

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

export async function loadConfirmedPdfPages(): Promise<Set<string>> {
  if (confirmedPdfCache) return confirmedPdfCache;
  try {
    const raw = await readFile(resolve(process.cwd(), "data/pdf-pages-on-blob.json"), "utf8");
    const keys = JSON.parse(raw) as string[];
    confirmedPdfCache = new Set(Array.isArray(keys) ? keys : []);
  } catch {
    confirmedPdfCache = new Set();
  }
  return confirmedPdfCache;
}

export async function localMediaExists(key: string) {
  const logical = toLogicalKey(key);
  if (!logical || !isSafeMediaKey(logical)) return false;
  const dest = resolve(mediaRoot(), logical);
  if (!dest.startsWith(mediaRoot())) return false;
  try {
    const info = await stat(dest);
    return info.isFile();
  } catch {
    return false;
  }
}

export async function mediaKeyAvailable(key: string) {
  const logical = toLogicalKey(key);
  if (!logical) return false;
  if (await localMediaExists(logical)) return true;
  const entry = (await loadManifest()).files[logical];
  const confirmedKeys = await loadConfirmedPdfPages();
  if (!mediaKeyIsPresent(logical, entry, { confirmedKeys })) return false;
  // Private Blob `get()` needs the store token. Without it, a signed URL
  // still 404s and the client paints the gray « Bilden kunde inte visas » box.
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
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
  const confirmedKeys = await loadConfirmedPdfPages();
  if (!mediaKeyIsPresent(logical, entry, { confirmedKeys })) return null;
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
