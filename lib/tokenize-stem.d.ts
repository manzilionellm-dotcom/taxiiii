export interface HardWordLike {
  sv: string;
  forms?: string[];
  fr: string;
}

export interface ClozeToken {
  type: "text" | "blank";
  text: string;
  gloss?: string;
}

export function tokenizeStem(stem: string, words: HardWordLike[]): ClozeToken[];
export function reconstructStem(tokens: ClozeToken[]): string;
export function hasImageUrl(url?: string | null): boolean;
