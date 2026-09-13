"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { QuestionCard } from "@/components/question-card";
import { ReadinessWidget } from "@/components/readiness-widget";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { computeReadiness } from "@/lib/progress/readiness";
import { finishExam, recordAttempt, uid } from "@/lib/progress/store";
import { questionsForTrack } from "@/lib/questions/bank";
import type { MockExam, Track } from "@/lib/types";

const EXAM_MS = 12 * 60 * 1000;

export function ExamSession({ track }: { track: Track }) {
  const { state, setState } = useAppState();
  const dict = t(state.profile.locale);
  const bank = questionsForTrack(track);
  const [exam] = useState<MockExam>(() => ({
    id: uid(),
    track,
    startedAt: new Date().toISOString(),
  }));
  const [queue] = useState(() =>
    [...bank].sort(() => Math.random() - 0.5).slice(0, Math.min(8, bank.length)),
  );
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [remaining, setRemaining] = useState(EXAM_MS);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      const left = EXAM_MS - (Date.now() - started);
      setRemaining(Math.max(0, left));
      if (left <= 0) setDone(true);
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!done || finished.current) return;
    finished.current = true;
    setState((prev) => finishExam(prev, exam, correctCount, queue.length));
  }, [done, correctCount, exam, queue.length, setState]);

  const current = queue[index];
  const readiness = useMemo(
    () => computeReadiness(track, bank, state.attempts, state.exams),
    [track, bank, state.attempts, state.exams],
  );

  if (done || !current) {
    return (
      <div className="space-y-4">
        <div className="card space-y-2">
          <h1 className="font-serif text-2xl text-black">{dict.examDone}</h1>
          <p className="text-black">
            {correctCount}/{queue.length}
          </p>
        </div>
        <ReadinessWidget locale={state.profile.locale} readiness={readiness} />
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
          {index + 1}/{queue.length} · {Math.ceil(remaining / 60000)} {dict.minutesLeft}
        </span>
        <Link href={`/${track}`}>{dict.back}</Link>
      </div>
      <QuestionCard
        key={current.id}
        question={current}
        locale={state.profile.locale}
        fragile={false}
        supportLevel={state.profile.fragileMode ? 2 : 1}
        onAnswer={(_letter, correct) => {
          setAnswered(true);
          if (correct) setCorrectCount((value) => value + 1);
          setState((prev) =>
            recordAttempt(prev, {
              questionId: current.id,
              track,
              correct,
              timed: true,
              mockExamId: exam.id,
            }),
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
