export const COORDINATOR_MANZI_JSONL: string;
export const COORDINATOR_MANZI_IMAGES: string;
export const RASTER_EXTS: Set<string>;
export const MEDIA_EXTS: Set<string>;
export const FAKE_EXAM_SVG_NAMES: Set<string>;
export const GUL_LINJE_ID: string;
export const GUL_LINJE_STEM: RegExp;

export function extOf(name: string): string;
export function isRasterExt(name: string): boolean;
export function isFakeExamSvg(url?: string | null): boolean;
export function hasAuthenticImageUrl(url?: string | null): boolean;
export function hasImageUrl(url?: string | null): boolean;
export function isSafeMediaKey(key?: string | null): boolean;
export function toLogicalKey(imageUrl?: string | null): string | null;
export function toImageUrl(logicalKey?: string | null): string | undefined;
export function blobRefForManifest(entry?: { url?: string | null; pathname?: string | null } | null): string | null;
export function contentTypeFor(name: string): string;
export function sanitizeCaption(text?: string | null): string;
export function candidateSourceRels(logicalKey: string): string[];
export function findManziRasterForStem(
  stem: string,
  questions: Array<{
    id?: string;
    stem_sv?: string;
    corpus?: string;
    imageUrl?: string;
    imageCaption?: string;
  }>,
): { imageUrl?: string; imageCaption?: string } | null;
export function stripFakeExamArt<T extends { imageUrl?: string; imageCaption?: string }>(
  question: T,
): T;
export function attachAuthenticMedia<T extends { id: string; stem_sv?: string; imageUrl?: string; imageCaption?: string; corpus?: string }>(
  questions: T[],
): T[];
