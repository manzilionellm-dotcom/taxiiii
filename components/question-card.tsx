"use client";

import { useEffect, useRef, useState } from "react";
import { ClozeText } from "@/components/cloze-text";
import { GlossableText, GlossaryProvider } from "@/components/glossary";
import { ProtectedImage } from "@/components/protected-image";
import { answerHaptic } from "@/lib/haptics";
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

function collapseWhitespace(value: string) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function ExamFigure({
  question,
  alt,
  unavailableLabel,
  onUnavailable,
}: {
  question: SessionQuestion;
  alt: string;
  unavailableLabel: string;
  onUnavailable?: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <figure className="exam-figure overflow-hidden rounded-xl border border-[#ddd6c8] bg-[#f3eee4]">
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
        <figcaption className="px-4 py-2.5 text-center text-xs text-[#6b6560]">{alt}</figcaption>
      ) : null}
    </figure>
  );
}

export function QuestionCard({
  question,
  locale,
  fragile,
  supportLevel,
  translationsOn,
  onAnswer,
  onReviewSoon,
  disabled,
  variant = "study",
}: {
  question: SessionQuestion;
  locale: Locale;
  fragile: boolean;
  supportLevel: SupportLevel;
  /** The single persisted preference that decides every French line. */
  translationsOn: boolean;
  onAnswer?: (letter: SessionQuestion["answer"], correct: boolean) => void;
  onReviewSoon?: () => void;
  disabled?: boolean;
  variant?: "study" | "exam";
}) {
  const dict = t(locale);
  const french = question.translation;
  const [picked, setPicked] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [reviewQueued, setReviewQueued] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const solutionRef = useRef<HTMLElement | null>(null);
  /** Second tap in the same event turn must not flip the answer. */
  const selectLock = useRef(false);

  const answered = picked !== null;
  const correct = picked === question.answer;
  const compact = variant === "exam";
  /** Answering can no longer spoil anything, so French always joins the solution. */
  const showFrNow = translationsOn || answered;
  const figureAlt = sanitizeCaption(question.imageCaption) || dict.examPageCaption;
  const imageFirst = question.form === "image-first" || Boolean(question.imageFirst);
  const showInlineFigure =
    !answered &&
    !imageFailed &&
    hasImageUrl(question.imageUrl) &&
    (imageFirst || shouldShowImageBeforeAnswer(question));
  const showSolutionFigure = answered && hasImageUrl(question.imageUrl) && !imageFailed;
  const stemFr = displayFrench(french.stem);
  /** Curated FR wins; a question's own explanation_fr is the fallback. */
  const explanationFr = displayFrench(french.explanation || question.explanation_fr);
  const takeaway = takeawayFor(question, explanationFr);
  const distractors = distractorNote(question);
  /**
   * takeawayFor() falls back to the explanation's opening sentence, and for
   * most Manzi rows the explanation opens with exactly that — so the panel
   * printed one sentence twice under two headings. Drop the takeaway when the
   * explanation below already contains it; the exam variant hides the
   * explanation, so there it always stays.
   */
  const showTakeaway =
    compact || !collapseWhitespace(question.explanation_sv).includes(collapseWhitespace(takeaway.sv));
  const hasFrench =
    isRealFrenchText(stemFr) ||
    question.options.some((option) => isRealFrenchText(french.options?.[option.letter]));

  /** Bring the solution into view on the same tap that answers the question. */
  useEffect(() => {
    if (!answered) return;
    solutionRef.current?.scrollIntoView({
      block: "nearest",
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [answered]);

  function markImageUnavailable() {
    setImageFailed(true);
    setLightbox(false);
  }

  function select(letter: SessionQuestion["answer"]) {
    if (disabled || answered || selectLock.current) return;
    selectLock.current = true;
    setPicked(letter);
    void answerHaptic(letter === question.answer);
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
          />
        ) : null}

        <ClozeText
          stem={question.stem_sv}
          locale={locale}
          fragile={fragile}
          supportLevel={supportLevel}
          revealAll={answered}
        />

        {showFrNow && isRealFrenchText(stemFr) ? (
          <p className="question-fr text-[1.02rem] leading-7">{stemFr}</p>
        ) : null}

        {/*
          Say it when a question has no French yet. Silence reads as a broken
          app — the Swedish sits there and the reader assumes the translation
          failed. A quiet, honest marker also makes the real gap visible.
        */}
        {translationsOn && !hasFrench ? (
          <p className="fr-pending">{dict.translationSoon}</p>
        ) : null}

        {!imageFirst && showInlineFigure ? (
          <ExamFigure
            question={question}
            alt={figureAlt}
            unavailableLabel={dict.imageUnavailable}
            onUnavailable={markImageUnavailable}
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
                  /*
                   * Tap anywhere on the row, glossed words included.
                   *
                   * This used to bail out when the tap landed on a
                   * [data-gloss-word] span — and nearly every Swedish word in
                   * an option is one, so tapping the answer text did nothing
                   * at all and only the letter badge or a gap between words
                   * worked. The guard was never needed: an option's gloss
                   * fires on hold only (glossary.tsx sets allowMouseClick
                   * false for this variant) and a fired hold already stops
                   * the click from reaching here. So a hold still opens the
                   * meaning without answering, and a tap now answers.
                   */
                  onClick={() => select(option.letter)}
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
               