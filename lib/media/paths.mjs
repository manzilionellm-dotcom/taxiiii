/**
 * Manzi exam media keys.
 * Coordinator drop uses paths like `media/T3/.../exam.php-filer/NNN.jpg`.
 * Logical key is the path under /media/ (slashes kept). Never invent SVGs.
 */

export const COORDINATOR_MANZI_JSONL =
  process.env.MANZI_JSONL || "/workspace/taxiprov/manzi/questions-merged.jsonl";
export const COORDINATOR_MANZI_IMAGES =
  process.env.MANZI_IMAGES || "/workspace/taxiprov/manzi/images";

export const RASTER_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);
export const MEDIA_EXTS = new Set([...RASTER_EXTS, ".svg"]);

/** Generated art that must never stand in for a Manzi exam photo. */
export const FAKE_EXAM_SVG_NAMES = new Set(["gul-heldragen-linje.svg"]);

export const GUL_LINJE_ID = "rs-yt-lag1-gul-linje";
export const GUL_LINJE_STEM =
  /gul\s+heldragen\s+linje|heldragen\s+linje.{0,48}trottoar|trottoarkant.{0,48}heldragen/i;

export function extOf(name) {
  const match = String(name).toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match ? match[1] : "";
}

export function isRasterExt(name) {
  return RASTER_EXTS.has(extOf(name));
}

export function isFakeExamSvg(url) {
  if (!url) return false;
  const base = String(url)
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.split("?")[0]
    ?.toLowerCase();
  return FAKE_EXAM_SVG_NAMES.has(base || "");
}

export function hasAuthenticImageUrl(url) {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  if (isFakeExamSvg(trimmed)) return false;
  return true;
}

export function isSafeMediaKey(key) {
  if (!key || typeof key !== "string") return false;
  if (key.includes("\0")) return false;
  const normalized = key.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized || normalized.startsWith("/") || normalized.includes("://")) return false;
  const parts = normalized.split("/");
  if (parts.some((part) => part === ".." || part === "." || part === "")) return false;
  if (parts.some((part) => part === "windows" && parts[0] === "windows")) {
    /* keep normal folders named windows */
  }
  return MEDIA_EXTS.has(extOf(normalized));
}

/**
 * `media/T3/a/exam.php-filer/1.jpg` → `T3/a/exam.php-filer/1.jpg`
 * `/media/stopplikt.svg` → `stopplikt.svg`
 */
export function toLogicalKey(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  let value = imageUrl.trim().replace(/\\/g, "/");
  if (!value) return null;
  value = value.replace(/^file:\/\//i, "");
  value = value.replace(/^https?:\/\/[^/]+/i, "");
  value = value.split(/[?#]/)[0];
  value = value.replace(/^\.?\//, "");
  value = value.replace(/^\/+/, "");
  if (value.toLowerCase().startsWith("content/media/")) {
    value = value.slice("content/media/".length);
  }
  if (value.toLowerCase().startsWith("media/")) {
    value = value.slice("media/".length);
  }
  if (!isSafeMediaKey(value)) return null;
  return value;
}

export function toImageUrl(logicalKey) {
  const key = toLogicalKey(logicalKey);
  return key ? `/media/${key}` : undefined;
}

/**
 * Private Blob `get()` accepts a full URL or the store pathname
 * (`media/pdf-pages/S_KERHET-2/page-11.jpg`). Production can resolve
 * pdf-pages entries from pathname + BLOB_READ_WRITE_TOKEN before `url` is filled.
 */
export function blobRefForManifest(entry) {
  if (!entry || typeof entry !== "object") return null;
  const url = typeof entry.url === "string" ? entry.url.trim() : "";
  if (url) return url;
  const pathname = typeof entry.pathname === "string" ? entry.pathname.trim() : "";
  return pathname || null;
}

export function contentTypeFor(name) {
  switch (extOf(name)) {
    case ".svg":
      return "image/svg+xml; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

/**
 * Restore Swedish letters when UTF-8 was read as Latin-1, and replace
 * diamond/bullet separators that show up as mojibake between words.
 */
const MOJIBAKE_PAIRS = [
  ["Ã¥", "å"],
  ["Ã¤", "ä"],
  ["Ã¶", "ö"],
  ["Ã…", "Å"],
  ["Ã„", "Ä"],
  ["Ã–", "Ö"],
  ["Ã©", "é"],
  ["Ã¨", "è"],
  ["Ã¼", "ü"],
];

export function sanitizeCaption(text) {
  if (!text) return "";
  let value = String(text);
  for (const [wrong, right] of MOJIBAKE_PAIRS) {
    value = value.split(wrong).join(right);
  }
  if (/Ã.|Â./.test(value)) {
    try {
      const bytes = Uint8Array.from([...value].map((char) => char.charCodeAt(0) & 0xff));
      const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      if (decoded && !decoded.includes("\uFFFD") && /[åäöÅÄÖéèü]/.test(decoded)) {
        value = decoded;
      }
    } catch {
      /* keep original */
    }
  }
  value = value.normalize("NFC");
  value = value.replace(/\uFFFD/g, "");
  value = value.replace(/[\u00B7\u2022\u2219\u22C5\u25CF\u25C6\u2666\u25CA\u25A0]/g, " ");
  value = value.replace(/\s+/g, " ").trim();
  return value;
}

export function candidateSourceRels(logicalKey) {
  const key = toLogicalKey(logicalKey);
  if (!key) return [];
  return [key, `media/${key}`];
}

export function findManziRasterForStem(stem, questions) {
  const needle = String(stem || "");
  if (!needle) return null;
  const hits = questions.filter((question) => {
    if (question.corpus === "research") return false;
    if (!GUL_LINJE_STEM.test(`${question.id} ${question.stem_sv || ""}`)) return false;
    const key = toLogicalKey(question.imageUrl);
    return key && isRasterExt(key) && !isFakeExamSvg(key);
  });
  if (!hits.length && GUL_LINJE_STEM.test(needle)) {
    return (
      questions.find((question) => {
        const key = toLogicalKey(question.imageUrl);
        return key && isRasterExt(key) && /gul|heldragen|trottoar/i.test(key);
      }) || null
    );
  }
  return hits[0] || null;
}

export function stripFakeExamArt(question) {
  if (!question) return question;
  const next = { ...question };
  if (next.imageCaption) next.imageCaption = sanitizeCaption(next.imageCaption);
  if (isFakeExamSvg(next.imageUrl) || !hasAuthenticImageUrl(next.imageUrl)) {
    delete next.imageUrl;
  } else {
    const url = toImageUrl(next.imageUrl);
    if (url) next.imageUrl = url;
    else delete next.imageUrl;
  }
  return next;
}

export function attachAuthenticMedia(questions) {
  const list = questions.map(stripFakeExamArt);
  const gul = list.find((item) => item.id === GUL_LINJE_ID);
  if (gul && !toLogicalKey(gul.imageUrl)) {
    const match = findManziRasterForStem(gul.stem_sv, list);
    if (match?.imageUrl) {
      gul.imageUrl = toImageUrl(match.imageUrl);
      if (match.imageCaption) gul.imageCaption = sanitizeCaption(match.imageCaption);
    }
  }
  return list;
}

export { hasAuthenticImageUrl as hasImageUrl };
