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
    selectLock.curre