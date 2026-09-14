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

/**
 * Generated art that must never stand in for a Manzi exam photo.
 *
 * These were hand-drawn schematics sitting in `content/media/`. The card
 * captions any uncaptioned figure «Examenssida», so a drawn squiggle was
 * presented to the student as a real exam page. `e4-karta.svg` was live on two
 * Karta questions and its «Nyköping» label was mojibake on top of that. Both
 * questions read fine from their text alone, so no image beats invented art —
 * the same rule as #20 for PDF pages: never invent a raster.
 */
export const FAKE_EXAM_SVG_NAMES = new Set([
  "gul-heldragen-linje.svg",
  "e4-karta.svg",
  "cirkulationsplats.svg",
  "stopplikt.svg",
  "taxameter.svg",
  "vilt.svg",
]);

export const GUL_LINJE_ID = "rs-yt-lag1-gul-linje";
export const GUL_LINJE_STEM =
  /gul\s+heldragen\s+linje|heldragen\s+linje.{0,48}trottoar|trottoarkant.{0,48}heldragen/i;

/**
 * Coordinator-verified: every LAGSTIFNING / S_KERHET QCM lives on that book's
 * PDF page N (question N). Do not invent kkalk-T-* links. Skip typo ids
 * such as S_KERHET-7-Q2009 (page 2009 does not exist).
 */
export const PDF_PAGE_ID = /^(LAGSTIFNING|S_KERHET)-(\d+)-Q(\d+)$/;
export const PDF_PAGE_MAX_Q = 80;
export const BLOB_STORE_HOST = "https://vmgbarxpqkgzrt73.private.blob.vercel-storage.com";

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
 * `LAGSTIFNING-1-Q1` → `/media/pdf-pages/LAGSTIFNING-1/page-01.jpg`
 * `S_KERHET-7-Q19` → `/media/pdf-pages/S_KERHET-7/page-19.jpg`
 */
export function parsePdfPageId(id) {
  const match = PDF_PAGE_ID.exec(String(id || ""));
  if (!match) return null;
  const qq = Number(match[3]);
  if (!Number.isInteger(qq) || qq < 1 || qq > PDF_PAGE_MAX_Q) return null;
  const page = String(qq).padStart(2, "0");
  const folder = `${match[1]}-${match[2]}`;
  const logicalKey = `pdf-pages/${folder}/page-${page}.jpg`;
  return {
    book: match[1],
    bookNum: match[2],
    qq,
    page,
    folder,
    logicalKey,
    pathname: `media/${logicalKey}`,
    imageUrl: `/media/${logicalKey}`,
  };
}

export function pdfPageImageUrlFromId(id) {
  return parsePdfPageId(id)?.imageUrl ?? null;
}

export function applyPdfPageImageUrl(question) {
  if (!question) return question;
  const parsed = parsePdfPageId(question.id);
  if (!parsed) return question;
  return { ...question, imageUrl: parsed.imageUrl };
}

/**
 * Prefer the store pathname so `get()` uses BLOB_READ_WRITE_TOKEN's store.
 * Full URLs can point at a stale host after a store rotation.
 */
export function blobRefForManifest(entry) {
  if (!entry || typeof entry !== "object") return null;
  const pathname = typeof entry.pathname === "string" ? entry.pathname.trim() : "";
  if (pathname) return pathname;
  const url = typeof entry.url === "string" ? entry.url.trim() : "";
  return url || null;
}

/**
 * True when Blob/local actually has bytes. Phantom pdf-pages keys from
 * link-pdf-pages (no `size`, not in the original 93 upload) must not be served.
 */
export function mediaKeyIsPresent(logicalKey, entry, media = {}) {
  if (!logicalKey) return false;
  if (typeof media.hasLocal === "function" && media.hasLocal(logicalKey)) return true;
  if (Number(entry?.size) > 0) return true;
  if (entry?.confirmed === true) return true;
  const confirmed = media.confirmedKeys;
  if (confirmed && typeof confirmed.has === "function" && confirmed.has(logicalKey)) return true;
  if (Array.isArray(confirmed) && confirmed.includes(logicalKey)) return true;
  return false;
}

export function dropMissingImageUrl(question, files = {}, media = {}) {
  if (!question) return question;
  const key = toLogicalKey(question.imageUrl);
  if (!key) {
    if (question.imageUrl) {
      const next = { ...question };
      delete next.imageUrl;
      return next;
    }
    return question;
  }
  if (mediaKeyIsPresent(key, files[key], media)) return question;
  const next = { ...question };
  delete next.imageUrl;
  return next;
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

export function attachAuthenticMedia(questions, media = null) {
  const list = questions.map((question) => stripFakeExamArt(applyPdfPageImageUrl(question)));
  const gul = list.find((item) => item.id === GUL_LINJE_ID);
  if (gul && !toLogicalKey(gul.imageUrl)) {
    const match = findManziRasterForStem(gul.stem_sv, list);
    if (match?.imageUrl) {
      gul.imageUrl = toImageUrl(match.imageUrl);
      if (match.imageCaption) gul.imageCaption = sanitizeCaption(match.imageCaption);
    }
  }
  if (media && (media.files || media.confirmedKeys || media.hasLocal)) {
    return list.map((question) => dropMissingImageUrl(question, media.files || {}, media));
  }
  return list;
}

export function isPdfPageImage(url) {
  const key = toLogicalKey(url);
  return Boolean(key && key.startsWith("pdf-pages/") && isRasterExt(key));
}

export function questionNeedsExamFigure(question) {
  const text = `${question?.id || ""} ${question?.stem_sv || ""} ${question?.imageCaption || ""}`;
  return /på bilden|bilden|tabellen|tabell|tariff|summatariff|fast\s*pris|lufttryck|enligt (bilden|tabellen)/i.test(
    text,
  );
}

export function shouldShowImageBeforeAnswer(question) {
  if (!hasAuthenticImageUrl(question?.imageUrl)) return false;
  if (!isPdfPageImage(question.imageUrl)) return true;
  return questionNeedsExamFigure(question);
}

export { hasAuthenticImageUrl as hasImageUrl };
