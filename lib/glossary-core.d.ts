export const GLOSS_HOLD_MS: number;

export function normalizeToken(value: string): string;
export function stripPunctuation(value: string): string;
export function isGlossableWord(token: string): boolean;
export function splitGlossPieces(text: string): Array<{ text: string; word: boolean }>;
export function lemmaCandidates(token: string): string[];
export function expandLemmaForms(lemma: string): string[];
export function parseSeedTable(table: string): Record<string, string>;
