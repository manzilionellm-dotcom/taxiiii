"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { useFocusMode } from "@/components/chrome";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/**
 * Shared chrome for the study and exam runners.
 *
 * The whole point is the cost of one question. Before: tap an option, scroll
 * past a solution of unknown length, hunt the "next" button, tap it, then
 * scroll back up to read the next stem. Now: tap an option, the verdict and
 * "next" appear at a fixed spot under the thumb, one tap (or a left swipe)
 * advances, and the next question arrives already scrolled to its stem.
 */
export function SessionFrame({
  locale,
  backHref,
  index,
  total,
  minutesLeft,
  lead,
  answered,
  correct,
  nextLabel,
  onNext,
  children,
}: {
  locale: Locale;
  backHref: string;
  index: number;
  total: number;
  minutesLeft: number;
  lead: string;
  answered: boolean;
  correct: boolean;
  nextLabel: string;
  onNext: () => void;
  children: ReactNode;
}) {
  const dict = t(locale);
  useFocusMode();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  /** A new question starts at its stem, never at the previous scroll depth. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [index]);

  /** Keyboard parity for the swipe: Enter / → advance once answered. */
  useEffect(() => {
    if (!answered) return;
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      if (event.key === "Enter" || event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, onNext]);

  return (
    <div
      className="space-y-4"
      onTouchStart={(event) => {
        const touch = event.touches[0];
        touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start || !answered) return;
        const touch = event.changedTouches[0];
        if (!touch) return;
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        /** A flick left, not a diagonal drag and not a vertical scroll. */
        if (dx < -64 && Math.abs(dx) > Math.abs(dy) * 2) onNext();
      }}
    >
      <div className="flex items-center justify-between gap-3 text-sm text-[#6b6560]">
        <span className="tabular-nums">
          {index + 1}/{total} · {minutesLeft} {dict.minutesLeft}
        </span>
        <Link href={backHref} className="min-h-10 font-medium text-[#1f3d2b]">
          {dict.back}
        </Link>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-[#ece6d8]">
        <div
          className="h-full rounded-full bg-[#1f3d2b] transition-[width] duration-300"
          style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      {lead ? <p className="text-sm text-[#6b6560]">{lead}</p> : null}

      {children}

      {/*
        Reserve the action bar's height inside the scroll flow so the last line
        of the solution is readable instead of hiding behind the bar.
      */}
      {answered ? <div aria-hidden className="h-[var(--action-h)]" /> : null}

      {answered ? (
        <div className="session-actions" data-verdict={correct ? "correct" : "wrong"}>
          <div className="session-actions-inner">
            <p className="session-verdict">{correct ? dict.correct : dict.incorrect}</p>
            <button type="button" className="btn-primary flex-1" onClick={onNext}>
              {nextLabel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
