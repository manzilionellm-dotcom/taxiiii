"use client";

import { useRef, useState } from "react";
import { ClozeText } from "@/components/cloze-text";
import {
  GlossablePassage,
  GlossableText,
  GlossaryProvider,
  GLOSS_HOLD_MS,
  glossHoldConsumed,
} from "@/components/glossary";
import { ProtectedImage } from "@/components/protected-image";
import { t } from "@/lib/i18n";
import { displayFrench, distractorNote, takeawayFor } from "@/lib/questions/review.mjs";
import { isRealFrenchText } from "@/lib/questions/french-text";
import {
  hasImageUrl,
  sanitizeCaption,
  shouldShowImageBeforeAnswer,
} from "@/lib/media/paths.mjs";
import type { SessionQuestion } from "@/lib/questions/session-types";
import type { Locale, SupportLevel } from "@/lib/types";

function ExamFigure({
  question,
  alt,
  unavailableLabel,
  onUnavailable,
  onHold,
  holdHint,
}: {
  question: SessionQuestion;
  alt: string;
  unavailableLabel: string;
  onUnavailable?: () => void;
  onHold?: () => void;
  holdHint?: string;
}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number>(0);
  const start = useRef({ x: 0, y: 0 });
  const fired = useRef(false);
  if (failed) return null;

  const clearHold = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = 0;
  };

  return (
    <figure
      className="exam-figure overflow-hidden rounded-xl border border-[#ddd6c8] bg-[#f3eee4]"
      aria-label={holdHint}
      onContextMenu={(event) => {
        if (onHold) event.preventDefault();
      }}
      onPointerDown={(event) => {
        if (!onHold || event.button !== 0) return;
        fired.current = false;
        start.current = { x: event.clientX, y: event.clientY };
        clearHold();
        timer.current = window.setTimeout(() => {
          fired.current = true;
          onHold();
        }, GLOSS_HOLD_MS);
      }}
      onPointerMove={(event) => {
        if (!timer.current) return;
        if (Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) > 10) {
          clearHold();
        }
      }}
      onPointerUp={() => {
        clearHold();
      }}
      onPointerCancel={clearHold}
    >
      <div className="flex min-h-40 items-center justify-center overflow-auto px-2 pt-3">
        <ProtectedImage
          src={question.imageUrl!}
          alt={alt}
          watermark={question.watermark}
          unavailableLabel={unavailableLabel}
          omitOnError
          onReady={() => setReady(true)}
          onError={() => {
            setFailed(true);
            onUnavailable?.();
          }}
        />
      </div>
      {ready ? (
        <figcaption className="px-4 py-2.5 text-center text-xs text-[#6b6560]">
          {alt}
          {holdHint ? <span className="mt-1 block text-[11px] text-[#b91c1c]">{holdHint}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function QuestionCard({
  question,
  locale,
  fragile,
  supportLevel,
  onAnswer,
  onReviewSoon,
  disabled,
  variant = "study",
}: {
  question: SessionQuestion;
  locale: Locale;
  fragile: boolean;
  supportLevel: SupportLevel;
  onAnswer?: (letter: SessionQuestion["answer"], correct: boolean) => void;
  onReviewSoon?: () => void;
  disabled?: boolean;
  variant?: "study" | "exam";
}) {
  const dict = t(locale);
  const french = question.translation;
  const [picked, setPicked] = useState<string | null>(null);
  const [showFr, setShowFr] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [pdfTranslated, setPdfTranslated] = useState(false);
  const [reviewQueued, setReviewQueued] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const answered = picked !== null;
  const correct = picked === question.answer;
  const compact = variant === "exam";
  const figureAlt = sanitizeCaption(question.imageCaption) || dict.examPageCaption;
  const imageFirst = question.form === "image-first" || Boolean(question.imageFirst);
  const showInlineFigure =
    !answered &&
    !imageFailed &&
    hasImageUrl(question.imageUrl) &&
    (imageFirst || shouldShowImageBeforeAnswer(question));
  const showSolutionFigure = answered && hasImageUrl(question.imageUrl) && !imageFailed;
  const stemFr = displayFrench(french.stem);
  const explanationFr =
    displayFrench(french.explanation || question.explanation_fr) ||
    String(question.explanation_fr || "").trim();
  const takeaway = takeawayFor(question, explanationFr);
  const distractors = distractorNote(question);
  const hasFrench =
    isRealFrenchText(stemFr) ||
    question.options.some((option) => isRealFrenchText(french.options?.[option.letter]));

  function markImageUnavailable() {
    setImageFailed(true);
    setLightbox(false);
  }

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

        {imageFirst && showInlineFigure ? (
          <ExamFigure
            question={question}
            alt={figureAlt}
            unavailableLabel={dict.imageUnavailable}
            onUnavailable={markImageUnavailable}
            onHold={() => setPdfTranslated((value) => !value)}
            holdHint={dict.glossPdfHint}
          />
        ) : null}

        <GlossablePassage label={dict.glossQuestion} fr={stemFr} hint={dict.glossPassageHint}>
          <ClozeText
            stem={question.stem_sv}
            locale={locale}
            fragile={fragile}
            supportLevel={supportLevel}
            revealAll={answered}
          />
        </GlossablePassage>

        {!imageFirst && showInlineFigure ? (
          <ExamFigure
            question={question}
            alt={figureAlt}
            unavailableLabel={dict.imageUnavailable}
            onUnavailable={markImageUnavailable}
            onHold={() => setPdfTranslated((value) => !value)}
            holdHint={dict.glossPdfHint}
          />
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
                  onPointerUp={() => {
                    if (glossHoldConsumed()) return;
                    select(option.letter);
                  }}
                  onClick={() => {
                    if (glossHoldConsumed()) return;
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
                  <span className="min-w-0 flex-1">
                    <GlossablePassage
                      label={`${dict.glossQuestion} ${option.letter}`}
                      fr={french.options?.[option.letter]}
                      hint={dict.glossOptionHint}
                      activate="hold"
                    >
                      <span className="block font-medium leading-6">
                        <GlossableText text={option.text} variant="option" />
                      </span>
                    </GlossablePassage>
                    {(answered || showFr) &&
                    isRealFrenchText(french.options?.[option.letter]) ? (
                      <span className="question-fr-premium mt-1 block text-sm leading-6">
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
          <section className="solution-panel" aria-live="polite">
            <header className="flex items-baseline justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b6560]">
                {dict.solution}
              </p>
              <p className={`text-sm font-semibold ${correct ? "text-emerald-800" : "text-red-800"}`}>
                {correct ? dict.correct : dict.incorrect}
              </p>
            </header>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8276]">
                {dict.takeaway}
              </p>
              <GlossablePassage label={dict.takeaway} fr={takeaway.fr} hint={dict.glossExplainHint}>
                <p className="text-[1.02rem] leading-7 text-black">
                  <GlossableText text={takeaway.sv} variant="stem" />
                </p>
              </GlossablePassage>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8276]">
                {dict.whyCorrect} · {question.answer} · {dict.glossExplainHint}
              </p>
              <GlossablePassage
                label={dict.explanation}
                fr={explanationFr}
                hint={dict.glossExplainHint}
              >
                <p className="whitespace-pre-wrap text-[0.98rem] leading-7 text-black">
                  <GlossableText text={question.explanation_sv} variant="stem" />
                </p>
              </GlossablePassage>
            </div>

            {distractors ? (
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8276]">
                  {dict.whyOthersWrong}
                </p>
                <GlossablePassage
                  label={dict.whyOthersWrong}
                  fr={distractors.fr}
                  hint={dict.glossExplainHint}
                >
                  <p className="text-[0.98rem] leading-7 text-black">
                    <GlossableText text={distractors.sv} variant="stem" />
                  </p>
                </GlossablePassage>
                {showFr && isRealFrenchText(distractors.fr) ? (
                  <p className="question-fr-premium text-[0.95rem] leading-7">{distractors.fr}</p>
                ) : null}
              </div>
            ) : null}

            {showSolutionFigure ? (
              compact ? (
                <button type="button" className="btn-secondary w-full" onClick={() => setLightbox(true)}>
                  {dict.viewExamPage}
                </button>
              ) : (
                <div className="space-y-3">
                  <ExamFigure
                    question={question}
                    alt={figureAlt}
                    unavailableLabel={dict.imageUnavailable}
                    onUnavailable={markImageUnavailable}
                    onHold={() => setPdfTranslated((value) => !value)}
                    holdHint={dict.glossPdfHint}
                  />
                  <button type="button" className="btn-secondary w-full" onClick={() => setLightbox(true)}>
                    {dict.viewExamPage}
                  </button>
                </div>
              )
            ) : null}

            {!compact && !correct && onReviewSoon ? (
              <button
                type="button"
                className="btn-secondary w-full"
                disabled={reviewQueued}
                onClick={() => {
                  onReviewSoon();
                  setReviewQueued(true);
                }}
              >
                {reviewQueued ? dict.reviewSoonDone : dict.reviewSoon}
              </button>
            ) : null}
          </section>
        ) : null}

        {lightbox && hasImageUrl(question.imageUrl) && !imageFailed ? (
          <div className="exam-lightbox" role="dialog" aria-modal="true" aria-label={dict.examPageCaption}>
            <div className="exam-lightbox-sheet">
              <ExamFigure
                question={question}
                alt={figureAlt}
                unavailableLabel={dict.imageUnavailable}
                onUnavailable={markImageUnavailable}
                onHold={() => setPdfTranslated((value) => !value)}
                holdHint={dict.glossPdfHint}
              />
              {pdfTranslated ? (
                <PdfTranslation
                  stemFr={stemFr}
                  optionFr={question.options.map((option) => ({
                    letter: option.letter,
                    text: french.options?.[option.letter],
                  }))}
                  explanationFr={explanationFr}
                  empty={dict.translationSoon}
                />
              ) : null}
              <button type="button" className="btn-primary w-full" onClick={() => setLightbox(false)}>
                {dict.closeExamPage}
              </button>
            </div>
          </div>
        ) : null}
      </article>
    </GlossaryProvider>
  );
}

function PdfTranslation({
  stemFr,
  optionFr,
  explanationFr,
  empty,
}: {
  stemFr?: string | null;
  optionFr: Array<{ letter: string; text?: string }>;
  explanationFr?: string | null;
  empty: string;
}) {
  const lines = [
    isRealFrenchText(stemFr) ? stemFr : null,
    ...optionFr.map((option) =>
      isRealFrenchText(option.text) ? `${option.letter}. ${option.text}` : null,
    ),
    isRealFrenchText(explanationFr) ? explanationFr : null,
  ].filter((line): line is string => Boolean(line));
  if (!lines.length) {
    return <p className="question-fr-premium text-sm">{empty}</p>;
  }
  return (
    <div className="pdf-fr-panel space-y-2">
      {lines.map((line) => (
        <p key={line.slice(0, 48)} className="question-fr-premium whitespace-pre-wrap text-[0.98rem] leading-7">
          {line}
        </p>
      ))}
    </div>
  );
}
