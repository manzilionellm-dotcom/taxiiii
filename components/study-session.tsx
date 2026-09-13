"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  const { state, setState } = useAppState();
  const dict = t(state.profile.locale);
  const dueIds = useMemo(
    () => state.srs.filter((card) => card.track === track && isDue(card)).map((c) => c.questionId),
    [state.srs, track],
  );
  const [queue, setQueue] = useState<SessionQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [remaining, setRemaining] = useState(SESSION_MS);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchSessionQuestions({
      track,
      mode: "study",
      dueIds,
      fragile: state.profile.fragileMode,
    })
      .then((questions) => {
        if (!cancelled) setQueue(questions);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [dueIds, state.profile.fragileMode, track]);

  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      const left = SESSION_MS - (Date.now() - started);
      setRemaining(Math.max(0, left));
      if (left <= 0) setDone(true);
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  const current = queue?.[index];
  const minutes = Math.ceil(remaining / 60000);

  if (failed) {
    return (
      <EmptyState
        title={dict.errorTitle}
        lead={dict.errorLead}
        actionHref={`/${track}`}
        actionLabel={dict.goHome}
      />
    );
  }

  if (!queue) {
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
        {dueIds.length === 0 ? <p className="text-sm text-[#6b6560]">{dict.noDue}</p> : null}
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
