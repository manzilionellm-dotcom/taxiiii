function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function overlaps(start, end, ranges) {
  return ranges.some((range) => start < range.end && end > range.start);
}

/**
 * Longest-first, non-overlapping, word-bounded matches. Reconstructs the stem verbatim.
 * @param {string} stem
 * @param {{ sv: string, forms?: string[], fr: string }[]} words
 * @returns {{ type: "text" | "blank", text: string, gloss?: string }[]}
 */
export function tokenizeStem(stem, words) {
  const patterns = new Map();
  for (const word of words) {
    const forms = word.forms?.length ? word.forms : [word.sv];
    for (const form of forms) {
      const trimmed = form.trim();
      if (!trimmed) continue;
      const key = trimmed.toLocaleLowerCase("sv");
      if (!patterns.has(key)) patterns.set(key, word.fr);
    }
  }

  const forms = [...patterns.entries()]
    .map(([form, gloss]) => ({ form, gloss }))
    .sort((a, b) => b.form.length - a.form.length || a.form.localeCompare(b.form, "sv"));

  const hits = [];

  for (const item of forms) {
    const regex = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(item.form)}(?![\\p{L}\\p{N}])`,
      "giu",
    );
    for (const match of stem.matchAll(regex)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      if (overlaps(start, end, hits)) continue;
      hits.push({ start, end, text: match[0], gloss: item.gloss });
    }
  }

  hits.sort((a, b) => a.start - b.start || b.end - a.end);

  const tokens = [];
  let last = 0;
  for (const hit of hits) {
    if (hit.start < last) continue;
    if (hit.start > last) {
      tokens.push({ type: "text", text: stem.slice(last, hit.start) });
    }
    tokens.push({ type: "blank", text: hit.text, gloss: hit.gloss });
    last = hit.end;
  }
  if (last < stem.length) {
    tokens.push({ type: "text", text: stem.slice(last) });
  }
  return tokens.length ? tokens : [{ type: "text", text: stem }];
}

export function reconstructStem(tokens) {
  return tokens.map((token) => token.text).join("");
}

export function hasImageUrl(url) {
  return Boolean(url?.trim());
}
