"use client";

import { useState } from "react";
import { ClozeText } from "@/components/cloze-text";
import { GlossableText, GlossaryProvider } from "@/components/glossary";
import { ProtectedImage } from "@/components/protected-image";
import { t } from "@/lib/i18n";
import { hasImageUrl } from "@/lib/tokenize-stem.mjs";
import { sanitizeCaption } from "@/lib/media/paths.mjs";
import { isRealFrenchText } from "@/lib/questions/french-text";
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

  function select(letter: SessionQuestion["answer"]) {
    if (disabled || answered) return;
    setPicked(letter);
    onAnswer?.(letter, letter === question.answer);
  }

  return (
    <GlossaryProvider locale={locale}>
      <article className="question-paper space-y-5">
        <header className="space-y-1 text-[11px] uppercase tracking-[0.14em] text-[#6b6560]">
          <span title={question.source ?? question.corpus}>
            {dict.topic[question.topic]}
            {question.corpus === "research"
              ? ` · ${dict.corpusResearch}`
              : question.corpus === "manzi"
                ? ` · ${dict.corpusManzi}`
                : question.corpus === "owner-seed" ||
                    question.corpus === "owner-official" ||
                    question.corpus === "owner-import"
                  ? ` · ${dict.corpusOwner}`
                  : ""}
            {question.freq === "high" ? ` · ${dict.freqHigh}` : ""}
          </span>
          <span className="block truncate text-right text-[10px] tracking-normal text-[#8a8276]">
            {question.id}
          </span>
        </header>

        <ClozeText
          stem={question.stem_sv}
          locale={locale}
          fragile={fragile}
          supportLevel={supportLevel}
          revealAll={answered}
        />

        {isRealFrenchText(french.stem) ? (
          showFr || supportLevel >= 3 ? (
            <p className="question-fr text-[1.02rem] leading-7">{french.stem}</p>
          ) : (
            <button
              type="button"
              className="min-h-11 text-left text-sm font-medium text-[#1d4ed8]"
              onClick={() => setShowFr(true)}
            >
              {dict.showTranslation}
            </button>
          )
        ) : null}

        {hasImageUrl(question.imageUrl) ? (
          <figure className="overflow-hidden rounded-xl border border-[#ddd6c8] bg-[#f3eee4]">
            <div className="flex min-h-40 items-center justify-center overflow-auto px-2 pt-3">
              <ProtectedImage
                src={question.imageUrl!}
                alt={sanitizeCaption(question.imageCaption) || dict.imageCaption}
                watermark={question.watermark}
                unavailableLabel={dict.imageUnavailable}
              />
            </div>
            <figcaption className="px-4 py-2.5 text-center text-xs text-[#6b6560]">
              {sanitizeCaption(question.imageCaption) || dict.imageCaption}
            </figcaption>
          </figure>
        ) : null}

        <ul className="space-y-2.5 pb-2">
          {question.options.map((option) => {
            const selected = picked === option.letter;
            const isRight = answered && option.letter === question.answer;
            const isWrong = answered && selected && !correct;
            return (
              <li key={option.letter}>
                <div
                  role="button"
                  tabIndex={disabled || answered ? -1 : 0}
                  aria-disabled={disabled || answered}
                  onClick={(event) => {
                    if ((event.target as HTMLElement).closest("[data-gloss-word]")) return;
                    select(option.letter);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      select(option.letter);
                    }
                  }}
                  className={`flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-3 text-left text-black transition ${
                    isRight
                      ? "border-emerald-700 bg-emerald-50"
                      : isWrong
                        ? "border-red-300 bg-red-50"
                        : selected
                          ? "border-[#1f3d2b] bg-[#1f3d2b]/5"
                          : "border-[#ddd6c8] bg-white hover:border-[#1f3d2b]/40"
                  } ${disabled || answered ? "cursor-default" : ""}`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold ${
                      isRight
                        ? "bg-emerald-700 text-white"
                        : isWrong
                          ? "bg-red-600 text-white"
                          : "bg-[#f3eee4] text-[#1f3d2b]"
                    }`}
                  >
                    {option.letter}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium leading-6">
                      <GlossableText text={option.text} variant="option" />
                    </span>
                    {(answered || showFr) &&
                    isRealFrenchText(french.options?.[option.letter]) ? (
                      <span className="mt-1 block text-sm leading-6 text-[#1d4ed8]">
                        {french.options[option.letter]}
                      </span>
                    ) : null}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {answered ? (
          <div className="rounded-xl bg-[#f3eee4] px-4 py-3.5">
            <p className="text-sm font-semibold text-black">
              {correct ? dict.correct : dict.incorrect} · {dict.explanation}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-[0.98rem] leading-7 text-black">
              {question.explanation_sv}
            </p>
            {supportLevel > 0 && isRealFrenchText(question.explanation_fr) ? (
              <p className="mt-2 whitespace-pre-wrap text-[0.95rem] leading-7 text-[#1d4ed8]">
                {question.explanation_fr}
              </p>
            ) : null}
          </div>
        ) : null}
      </article>
    </GlossaryProvider>
  );
}
