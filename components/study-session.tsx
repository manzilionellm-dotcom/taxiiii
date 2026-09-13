"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { QuestionCard } from "@/components/question-card";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { recordAttempt } from "@/lib/progress/store";
import { isDue } from "@/lib/progress/srs";
import { questionsForTrack } from "@/lib/questions/bank";
import { studyPriority } from "@/lib/questions/priority";
import type { QuestionRecord, Track } from "@/lib/types";

const SESSION_MS = 8 * 60 * 1000;

function pickSession(track: Track, dueIds: Set<string>, fragile: boolean): QuestionRecord[] {
  const bank = [...questionsForTrack(track)].sort((a, b) => {
    const dueDelta = Number(dueIds.has(b.id)) - Number(dueIds.has(a.id));
    if (dueDelta !== 0) return dueDelta;
    return studyPriority(a) - studyPriority(b);
  });
  const limit = fragile ? 6 : 10;
  return bank.slice(0, limit);
}

export function StudySession({ track }: { track: Track }) {
  const { state, setState } = useAppState();
  const dict = t(state.profile.locale);
  const dueIds = useMemo(
    () => new Set(state.srs.filter((card) => card.track === track && isDue(card)).map((c) => c.questionId)),
    [state.srs, track],
  );
  const [queue] = useState(() =>
    pickSession(track, dueIds, state.profile.fragileMode),
  );
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [remaining, setRemaining] = useState(SESSION_MS);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      const left = SESSION_MS - (Date.now() - started);
      setRemaining(Math.max(0, left));
      if (left <= 0) setDone(true);
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  const current = queue[index];
  const minutes = Math.ceil(remaining / 60000);

  if (done || !current) {
    return (
      <div className="card space-y-4">
        <h1 className="font-serif text-2xl text-black">{dict.sessionDone}</h1>
        <Link href={`/${track}`} className="btn-primary inline-flex">
          {dict.dashboard}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-[#6b6560]">
        <span>
          {index + 1}/{queue.length} · {minutes} {dict.minutesLeft}
        </span>
        <Link href={`/${track}`}>{dict.back}</Link>
      </div>
      {dueIds.size === 0 ? <p className="text-sm text-[#6b6560]">{dict.noDue}</p> : null}
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
  );
}
