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

  return (
    <p className="question-sv font-serif text-[1.15rem] leading-8 text-black sm:text-[1.25rem]">
      {tokens.map((token, index) => {
        if (token.type === "text") {
          return <span key={index}>{token.text}</span>;
        }
        const i = blankSlots.findIndex((item) => item.index === index);
        const ok = normalize(values[i] ?? "") === normalize(token.text);
        const show = revealAll || revealed[i] || ok;
        const choices = fragile
          ? Array.from(new Set([token.text, ...blanks.map((b) => b.text)]))
              .sort((a, b) => a.localeCompare(b, "sv"))
          : [];

        return (
          <span key={index} className="inline-block align-baseline">
            {show ? (
              <span className="inline-flex flex-col items-start">
                <strong className="font-bold text-[#b91c1c]">{token.text}</strong>
                {supportLevel > 0 && token.gloss ? (
                  <span className="text-[0.7rem] font-sans font-medium leading-4 text-[#b91c1c]/80">
                    {token.gloss}
                  </span>
                ) : null}
              </span>
            ) : fragile ? (
              <span className="mx-0.5 inline-flex flex-wrap gap-1 align-middle">
                {choices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    className="rounded-md border border-[#ddd6c8] bg-white px-2 py-0.5 font-sans text-sm text-black"
                    onClick={() => {
                      const next = [...values];
                      next[i] = choice;
                      setValues(next);
                      if (normalize(choice) === normalize(token.text)) {
                        const rev = [...revealed];
                        rev[i] = true;
                        setRevealed(rev);
                      }
                    }}
                  >
                    {choice}
                  </button>
                ))}
              </span>
            ) : (
              <span className="mx-1 inline-flex items-center gap-1 align-middle">
                <input
                  aria-label={dict.typeWord}
                  value={values[i] ?? ""}
                  onChange={(event) => {
                    const next = [...values];
                    next[i] = event.target.value;
                    setValues(next);
                  }}
                  className="w-32 rounded-md border border-[#c41e3a]/40 bg-white px-2 py-1 font-sans text-sm text-black"
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
            )}
          </span>
        );
      })}
    </p>
  );
}
