"use client";

import { useState } from "react";
import { ClozeText } from "@/components/cloze-text";
import { ProtectedImage } from "@/components/protected-image";
import { t } from "@/lib/i18n";
import { hasImageUrl } from "@/lib/tokenize-stem.mjs";
import type { SessionQuestion } from "@/lib/questions/session-types";
import type { Locale, SupportLevel } from "@/lib/types";

export function QuestionCard({
  question,
  locale,
  fragile,
  supportLevel,
  onAnswer,
  disabled,
}: {
  question: SessionQuestion;
  locale: Locale;
  fragile: boolean;
  supportLevel: SupportLevel;
  onAnswer?: (letter: SessionQuestion["answer"], correct: boolean) => void;
  disabled?: boolean;
}) {
  const dict = t(locale);
  const french = question.translation;
  const [picked, setPicked] = useState<string | null>(null);
  const [showFr, setShowFr] = useState(supportLevel >= 2);

  const answered = picked !== null;
  const correct = picked === question.answer;

  return (
    <article className="card space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.14em] text-[#6b6560]">
        <span title={question.source ?? question.corpus}>
          {dict.topic[question.topic]}
          {question.corpus === "research"
            ? ` · ${dict.corpusResearch}`
            : question.corpus === "manzi"
              ? ` · ${dict.corpusManzi}`
              : ""}
          {question.freq === "high" ? ` · ${dict.freqHigh}` : ""}
        </span>
        <span>{question.id}</span>
      </header>

      <ClozeText
        stem={question.stem_sv}
        locale={locale}
        fragile={fragile}
        supportLevel={supportLevel}
        revealAll={answered}
      />

      {showFr || supportLevel >= 3 ? (
        <p className="question-fr text-[1.02rem] leading-7 text-[#1d4ed8]">{french.stem}</p>
      ) : (
        <button
          type="button"
          className="text-sm font-medium text-[#1d4ed8]"
          onClick={() => setShowFr(true)}
        >
          {dict.showTranslation}
        </button>
      )}

      {hasImageUrl(question.imageUrl) ? (
        <figure className="overflow-hidden rounded-xl border border-[#ddd6c8] bg-[#f7f2e8]">
          <ProtectedImage
            src={question.imageUrl!}
            alt={dict.imageCaption}
            watermark={question.watermark}
            unavailableLabel={dict.imageUnavailable}
          />
          <figcaption className="px-4 pb-3 text-center text-xs text-[#6b6560]">
            {dict.imageCaption}
          </figcaption>
        </figure>
      ) : null}

      <ul className="space-y-2 pb-2">
        {question.options.map((option) => {
          const selected = picked === option.letter;
          const isRight = answered && option.letter === question.answer;
          const isWrong = answered && selected && !correct;
          return (
            <li key={option.letter}>
              <button
                type="button"
                disabled={disabled || answered}
                onClick={() => {
                  setPicked(option.letter);
                  onAnswer?.(option.letter, option.letter === question.answer);
                }}
                className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left text-black transition ${
                  isRight
                    ? "border-emerald-700 bg-emerald-50"
                    : isWrong
                      ? "border-red-300 bg-red-50"
                      : selected
                        ? "border-[#1f3d2b] bg-[#1f3d2b]/5"
                        : "border-[#ddd6c8] bg-white hover:border-[#1f3d2b]/40"
                }`}
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f4efe4] font-semibold">
                  {option.letter}
                </span>
                <span>
                  <span className="block font-medium">{option.text}</span>
                  {(answered || showFr) && french.options?.[option.letter] ? (
                    <span className="mt-1 block text-sm text-[#1d4ed8]">
                      {french.options[option.letter]}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {answered ? (
        <div className="rounded-xl bg-[#f4efe4] px-4 py-3">
          <p className="text-sm font-semibold text-black">
            {correct ? dict.correct : dict.incorrect} · {dict.explanation}
          </p>
          <p className="mt-2 text-[0.98rem] leading-7 text-black">{question.explanation_sv}</p>
          {supportLevel > 0 ? (
            <p className="mt-2 text-[0.95rem] leading-7 text-[#1d4ed8]">
              {question.explanation_fr}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
