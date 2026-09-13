import type { HardWord } from "@/lib/types";
import raw from "@/data/hard-words.json";

export const HARD_WORDS: HardWord[] = raw as HardWord[];

export interface ClozeToken {
  type: "text" | "blank";
  text: string;
  gloss?: string;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function tokenizeStem(stem: string, words = HARD_WORDS): ClozeToken[] {
  const patterns = words
    .flatMap((word) =>
      (word.forms?.length ? word.forms : [word.sv]).map((form) => ({
        form,
        gloss: word.fr,
      })),
    )
    .sort((a, b) => b.form.length - a.form.length);

  if (patterns.length === 0) {
    return [{ type: "text", text: stem }];
  }

  const regex = new RegExp(
    `(${patterns.map((item) => escapeRegExp(item.form)).join("|")})`,
    "gi",
  );

  const tokens: ClozeToken[] = [];
  let last = 0;
  for (const match of stem.matchAll(regex)) {
    const index = match.index ?? 0;
    if (index > last) {
      tokens.push({ type: "text", text: stem.slice(last, index) });
    }
    const matched = match[0];
    const gloss =
      patterns.find((item) => item.form.toLowerCase() === matched.toLowerCase())
        ?.gloss ?? "";
    tokens.push({ type: "blank", text: matched, gloss });
    last = index + matched.length;
  }
  if (last < stem.length) {
    tokens.push({ type: "text", text: stem.slice(last) });
  }
  return tokens.length ? tokens : [{ type: "text", text: stem }];
}
