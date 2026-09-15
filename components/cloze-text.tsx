"use client";

import { useMemo, useState } from "react";
import { tokenizeStem } from "@/lib/hard-words";
import { t } from "@/lib/i18n";
import type { Locale, SupportLevel } from "@/lib/types";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

export function ClozeText({
  stem,
  locale,
  fragile,
  supportLevel,
  revealAll,
}: {
  stem: string;
  locale: Locale;
  fragile: boolean;
  supportLevel: SupportLevel;
  revealAll?: boolean;
}) {
  const dict = t(locale);
  const tokens = useMemo(() => tokenizeStem(stem), [stem]);
  const blanks = tokens.filter((token) => token.type === "blank");
  const [values, setValues] = useState<string[]>(() => blanks.map(() => ""));
  const [revealed, setRevealed] = useState<boolean[]>(() => blanks.map(() => false));

  const blankSlots = tokens
    .map((token, index) => ({ token, index }))
    .filter((item) => item.token.type === "blank");

  const highlightByDefault = supportLevel >= 2;

  return (
    <p className="question-sv font-serif text-[1.15rem] leading-8 text-black sm:text-[1.25rem]">
      {tokens.map((token, index) => {
        if (token.type === "text") {
          return <span key={index}>{token.text}</span>;
        }
        const i = blankSlots.findIndex((item) => item.index === index);
        const typed = values[i] ?? "";
        const ok = normalize(typed) === normalize(token.text);
        const show = Boolean(revealAll || revealed[i] || ok || highlightByDefault);
        const choices = Array.from(new Set(blanks.map((blank) => blank.text))).sort((a, b) =>
          a.localeCompare(b, "sv"),
        );

        if (show) {
          return (
            <span key={index} className="cloze-box">
              {token.text}
            </span>
          );
        }

        if (fragile) {
          return (
            <label key={index} className="mx-0.5 inline-block align-baseline">
              <span className="sr-only">{dict.recognition}</span>
              <select
                aria-label={dict.recognition}
                value={typed}
                onChange={(event) => {
                  const next = [...values];
                  next[i] = event.target.value;
                  setValues(next);
                  if (normalize(event.target.value) === normalize(token.text)) {
                    const rev = [...revealed];
                    rev[i] = true;
                    setRevealed(rev);
                  }
                }}
                className="cloze-select max-w-[11rem] rounded-md border border-[#c41e3a]/40 bg-white px-1.5 py-0.5 font-sans text-sm text-black"
              >
                <option value="">{dict.recognition}</option>
                {choices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        return (
          <span key={index} className="mx-0.5 inline-flex items-baseline gap-1 align-baseline">
            <input
              aria-label={dict.typeWord}
              value={typed}
              size={Math.max(6, token.text.length)}
              onChange={(event) => {
                const next = [...values];
                next[i] = event.target.value;
                setValues(next);
              }}
              className="h-10 min-w-[4.5rem] max-w-[10rem] rounded-md border border-[#c41e3a]/40 bg-white px-1.5 font-sans text-sm text-black"
            />
            <button
              type="button"
              className="text-xs font-medium text-[#b91c1c] underline"
              onClick={() => {
                const rev = [...revealed];
                rev[i] = true;
                setRevealed(rev);
              }}
            >
              {dict.reveal}
            </button>
          </span>
        );
      })}
    </p>
  );
}
