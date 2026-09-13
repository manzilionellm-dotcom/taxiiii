"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ProtectedView } from "@/components/protected-view";
import { QuestionCard } from "@/components/question-card";
import { SessionSkeleton } from "@/components/splash-screen";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { recordAttempt } from "@/lib/progress/store";
import { isDue } from "@/lib/progress/srs";
import { fetchSessionQuestions } from "@/lib/questions/client";
import type { SessionQuestion } from "@/lib/questions/session-types";
import type { Track } from "@/lib/types";

const SESSION_MS = 8 * 60 * 1000;

export function StudySession({ track }: { track: Track }) {
  const { state, setState, hydrated } = useAppState();
  const dict = t(state.profile.locale);
  const [queue, setQueue] = useState<SessionQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [remaining, setRemaining] = useState(SESSION_MS);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    setFailed(false);
    setQueue(null);
    setIndex(0);
    setAnswered(false);
    setDone(false);
    startedAt.current = null;
    const dueIds = state.srs
      .filter((card) => card.track === track && isDue(card))
      .map((card) => card.questionId);
    void fetchSessionQuestions({
      track,
      mode: "study",
      dueIds,
      fragile: state.profile.fragileMode,
    })
      .then((questions) => {
        if (cancelled) return;
        setQueue(questions);
        startedAt.current = Date.now();
        setRemaining(SESSION_MS);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, reload, state.profile.fragileMode, track]);

  useEffect(() => {
    if (!startedAt.current) return;
    const timer = window.setInterval(() => {
      const origin = startedAt.current;
      if (!origin) return;
      const left = SESSION_MS - (Date.now() - origin);
      setRemaining(Math.max(0, left));
      if (left <= 0) setDone(true);
    }, 250);
    return () => window.clearInterval(timer);
  }, [queue]);

  const current = queue?.[index];
  const minutes = Math.ceil(remaining / 60000);
  const dueCount = state.srs.filter((card) => card.track === track && isDue(card)).length;

  if (failed) {
    return (
      <EmptyState
        title={dict.errorTitle}
        lead={dict.sessionError}
        actionLabel={dict.retry}
        onAction={() => setReload((value) => value + 1)}
      />
    );
  }

  if (!hydrated || !queue) {
    return <SessionSkeleton label={dict.loadingSession} />;
  }

  if (done || !current) {
    return (
      <EmptyState
        title={dict.sessionDone}
        actionHref={`/${track}`}
        actionLabel={dict.dashboard}
      />
    );
  }

  return (
    <ProtectedView locale={state.profile.locale}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 text-sm text-[#6b6560]">
          <span className="tabular-nums">
            {index + 1}/{queue.length} · {minutes} {dict.minutesLeft}
          </span>
          <Link href={`/${track}`} className="min-h-10 font-medium text-[#1f3d2b]">
            {dict.back}
          </Link>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#ece6d8]">
          <div
            className="h-full rounded-full bg-[#1f3d2b] transition-[width] duration-300"
            style={{ width: `${((index + (answered ? 1 : 0)) / queue.length) * 100}%` }}
          />
        </div>
        {dueCount === 0 ? <p className="text-sm text-[#6b6560]">{dict.noDue}</p> : null}
        <QuestionCard
          key={current.id}
          question={current}
          locale={state.profile.locale}
          fragile={state.profile.fragileMode}
          supportLevel={state.profile.supportLevel}
          onAnswer={(_letter, correct) => {
            setAnswered(true);
            setState((prev) =>
              recordAttempt(prev, { questionId: current.id, track, correct }),
            );
          }}
        />
        {answered ? (
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => {
              if (index + 1 >= queue.length) setDone(true);
              else {
                setIndex((value) => value + 1);
                setAnswered(false);
              }
            }}
          >
            {dict.next}
          </button>
        ) : null}
      </div>
    </ProtectedView>
  );
}
