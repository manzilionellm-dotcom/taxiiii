import type { HardWord } from "@/lib/types";
import raw from "@/data/hard-words.json";
import {
  hasImageUrl,
  reconstructStem,
  tokenizeStem as annotateStem,
} from "@/lib/tokenize-stem.mjs";

export const HARD_WORDS: HardWord[] = raw as HardWord[];

export interface ClozeToken {
  type: "text" | "blank";
  text: string;
  gloss?: string;
}

export function tokenizeStem(stem: string, words = HARD_WORDS): ClozeToken[] {
  return annotateStem(stem, words) as ClozeToken[];
}

export { reconstructStem, hasImageUrl };
