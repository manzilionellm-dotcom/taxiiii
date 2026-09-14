"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ProtectedView } from "@/components/protected-view";
import { QuestionCard } from "@/components/question-card";
import { ReadinessWidget } from "@/components/readiness-widget";
import { SessionSkeleton } from "@/components/splash-screen";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { computeReadiness } from "@/lib/progress/readiness";
import { TeacherMissNudge } from "@/components/teacher-presence";
import { finishExam, recordAttempt, rememberSession, uid } from "@/lib/progress/store";
import { fetchSessionQuestions } from "@/lib/questions/client";
import { useQuestionCatalog } from "@/lib/questions/use-catalog";
import { missLabelFromText } from "@/lib/teacher/copy.mjs";
import { computeTeacherPresence } from "@/lib/teacher/presence";
import type { SessionQuestion } from "@/lib/questions/session-types";
import type { MockExam, Track } from "@/lib/types";

const EXAM_MS = 50 * 60 * 1000;

export function ExamSession({ track }: { track: Track }) {
  const { state, setState, hydrated } = useAppState();
  const dict = t(state.profile.locale);
  const { catalog } = useQuestionCatalog(track);
  const [exam] = useState<MockExam>(() => ({
    id: uid(),
    track,
    startedAt: new Date().toISOString(),
  }));
  const [queue, setQueue] = useState<SessionQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [remaining, setRemaining] = useState(EXAM_MS);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const finished = useRef(false);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    setFailed(false);
    setQueue(null);
    finished.current = false;
    startedAt.current = null;
    void fetchSessionQuestions({ track, mode: "exam" })
      .then((questions) => {
        if (cancelled) return;
        setQueue(questions);
        startedAt.current = Date.now();
        setRemaining(EXAM_MS);
        setState((prev) =>
          rememberSession(prev, {
            track,
            mode: "exam",
            questionIds: questions.map((item) => item.id),
            index: 0,
            topic: questions[0]?.topic,
            unfinished: true,
          }),
        );
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, reload, track]);

  useEffect(() => {
    if (!startedAt.current) return;
    const timer = window.setInterval(() => {
      const origin = startedAt.current;
      if (!origin) return;
      const left = EXAM_MS - (Date.now() - origin);
      setRemaining(Math.max(0, left));
      if (left <= 0) setDone(true);
    }, 250);
    return () => window.clearInterval(timer);
  }, [queue]);

  useEffect(() => {
    if (!done || finished.current || !queue) return;
    finished.current = true;
    setState((prev) => finishExam(prev, exam, correctCount, queue.length));
  }, [done, correctCount, exam, queue, setState]);

  const current = queue?.[index];
  const readiness = useMemo(
    () => computeReadiness(track, catalog, state.attempts, state.exams),
    [track, catalog, state.attempts, state.exams],
  );

  if (failed) {
    return (
      <EmptyState
        title={dict.tutor}
        lead={dict.teacherSessionError}
        actionLabel={dict.retry}
        onAction={() => setReload((value) => value + 1)}
      />
    );
  }

  if (!hydrated || !queue) {
    return <SessionSkeleton label={dict.teacherLoading} />;
  }

  if (done || !current) {
    const teacher = computeTeacherPresence(state, catalog, track, state.profile.locale);
    return (
      <div className="space-y-4">
        <div className="card space-y-2 px-6 py-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8276]">
            {dict.tutor}
          </p>
          <h1 className="font-serif text-2xl text-black">{dict.teacherExamDone}</h1>
          <p className="font-serif text-4xl tabular-nums text-[#1f3d2b]">
            {correctCount}/{queue.length}
          </p>
          <p className="text-sm leading-6 text-[#1f3d2b]">{dict.teacherExamDoneLead}</p>
          <p className="text-sm text-[#6b6560]">{teacher.greeting}</p>
        </div>
        <ReadinessWidget locale={state.profile.locale} readiness={readiness} />
        <Link href={teacher.correctHref} className="btn-primary inline-flex w-full">
          {dict.teacherCorrectThis}
        </Link>
        <Link href={`/${track}`} className="btn-secondary inline-flex w-full">
          {dict.dashboard}
        </Link>
      </div>
    );
  }

  return (
    <ProtectedView locale={state.profile.locale} exam>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 text-sm text-[#6b6560]">
          <span className="tabular-nums">
            {index + 1}/{queue.length} · {Math.ceil(remaining / 60000)} {dict.minutesLeft}
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
        <p className="text-sm text-[#6b6560]">{dict.teacherExamLead}</p>
        {answered ? <TeacherMissNudge track={track} /> : null}
        <QuestionCard
          key={current.id}
          question={current}
          locale={state.profile.locale}
          fragile={false}
          supportLevel={state.profile.fragileMode ? 2 : 1}
          variant="exam"
          onAnswer={(_letter, correct) => {
            setAnswered(true);
            if (correct) setCorrectCount((value) => value + 1);
            setState((prev) => {
              let next = recordAttempt(prev, {
                questionId: current.id,
                track,
                correct,
                timed: true,
                mockExamId: exam.id,
              });
              const label = missLabelFromText(
                [current.stem_sv, current.trap, current.explanation_sv].join(" "),
              );
              next = rememberSession(next, {
                track,
                mode: "exam",
                questionIds: queue.map((item) => item.id),
                index,
                topic: current.topic,
                unfinished: true,
                missLabel: correct ? next.lastSession?.missLabel : label || undefined,
                missTopic: correct ? next.lastSession?.missTopic : current.topic,
              });
              return next;
            });
          }}
        />
        {answered ? (
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => {
              const nextIndex = index + 1;
              const finished = nextIndex >= queue.length;
              setState((prev) =>
                rememberSession(prev, {
                  track,
                  mode: "exam",
                  questionIds: queue.map((item) => item.id),
                  index: finished ? index : nextIndex,
                  topic: queue[finished ? index : nextIndex]?.topic,
                  unfinished: !finished,
                }),
              );
              if (finished) setDone(true);
              else {
                setIndex(nextIndex);
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
