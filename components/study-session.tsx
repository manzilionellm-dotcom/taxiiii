"use client";

import { useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ProtectedView } from "@/components/protected-view";
import { QuestionCard } from "@/components/question-card";
import { SessionFrame } from "@/components/session-frame";
import { SessionSkeleton } from "@/components/splash-screen";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { TeacherMissNudge } from "@/components/teacher-presence";
import { bumpReviewSoon, recordAttempt, rememberSession } from "@/lib/progress/store";
import { isDue } from "@/lib/progress/srs";
import { fetchSessionQuestions } from "@/lib/questions/client";
import { missLabelFromText } from "@/lib/teacher/copy.mjs";
import type { SessionQuestion } from "@/lib/questions/session-types";
import { TOPICS, type Topic, type Track } from "@/lib/types";

function queryFlag(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

function queryTopic(): Topic | undefined {
  const raw = queryFlag("focus") || queryFlag("topic");
  return raw && (TOPICS as readonly string[]).includes(raw) ? (raw as Topic) : undefined;
}

const SESSION_MS = 8 * 60 * 1000;

export function StudySession({ track }: { track: Track }) {
  const { state, setState, hydrated } = useAppState();
  const dict = t(state.profile.locale);
  const [queue, setQueue] = useState<SessionQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
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
      .map((card) => {
        const id = card.conceptId || card.questionId;
        return card.lastForm ? `${id}~${card.lastForm}` : id;
      });
    const resumeWanted = queryFlag("resume") === "1";
    const focusTopic = queryTopic();
    const resumeIds =
      resumeWanted &&
      state.lastSession?.track === track &&
      state.lastSession.unfinished &&
      state.lastSession.questionIds?.length
        ? state.lastSession.questionIds
        : undefined;
    const resumeIndex = resumeIds ? state.lastSession?.index ?? 0 : 0;
    void fetchSessionQuestions({
      track,
      mode: "study",
      dueIds,
      resumeIds,
      fragile: state.profile.fragileMode,
      topic: resumeIds ? undefined : focusTopic,
    })
      .then((questions) => {
        if (cancelled) return;
        setQueue(questions);
        setIndex(Math.min(resumeIndex, Math.max(0, questions.length - 1)));
        startedAt.current = Date.now();
        setRemaining(SESSION_MS);
        setState((prev) =>
          rememberSession(prev, {
            track,
            mode: "study",
            questionIds: questions.map((item) => item.variantOf || item.id),
            index: Math.min(resumeIndex, Math.max(0, questions.length - 1)),
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
    return (
      <EmptyState
        title={dict.sessionDone}
        lead={dict.teacherSessionLead}
        actionHref={`/${track}`}
        actionLabel={dict.dashboard}
      />
    );
  }

  /** The teacher's framing belongs on the first card, not above all ten. */
  const sessionLead = index === 0 ? dict.teacherSessionLead : "";

  function advance() {
    const nextIndex = index + 1;
    const last = nextIndex >= queue!.length;
    setState((prev) =>
      rememberSession(prev, {
        track,
        mode: "study",
        questionIds: queue!.map((item) => item.variantOf || item.id),
        index: last ? index : nextIndex,
        topic: queue![last ? index : nextIndex]?.topic,
        unfinished: !last,
      }),
    );
    if (last) setDone(true);
    else {
      setIndex(nextIndex);
      setAnswered(false);
    }
  }

  return (
    <ProtectedView locale={state.profile.locale}>
      <SessionFrame
        locale={state.profile.locale}
        backHref={`/${track}`}
        index={index}
        total={queue.length}
        minutesLeft={minutes}
        lead={sessionLead}
        answered={answered}
        correct={lastCorrect}
        nextLabel={index + 1 >= queue.length ? dict.sessionDone : dict.next}
        onNext={advance}
      >
        <TeacherMissNudge track={track} />
        <QuestionCard
          key={current.id}
          question={current}
          locale={state.profile.locale}
          fragile={state.profile.fragileMode}
          supportLevel={state.profile.supportLevel}
          translationsOn={state.profile.showTranslations}
          variant="study"
          onAnswer={(_letter, correct) => {
            setAnswered(true);
            setLastCorrect(correct);
            setState((prev) => {
              let next = recordAttempt(prev, {
                questionId: current.variantOf || current.id,
                track,
                correct,
                conceptId: current.conceptId || current.variantOf || current.id,
                form: current.form,
                variantId: current.id,
              });
              if (!correct) {
                const label = missLabelFromText(
                  [current.stem_sv, current.trap, current.explanation_sv].join(" "),
                );
                next = rememberSession(next, {
                  track,
                  mode: "study",
                  questionIds: queue.map((item) => item.variantOf || item.id),
                  index,
                  topic: current.topic,
                  unfinished: true,
                  missLabel: label || undefined,
                  missTopic: current.topic,
                  note:
                    label && state.profile.locale === "fr"
                      ? `On reprend ${label}.`
                      : label
                        ? `Vi tar om ${label}.`
                        : undefined,
                });
              }
              return next;
            });
          }}
          onReviewSoon={() => {
            setState((prev) =>
              bumpReviewSoon(prev, {
                questionId: current.variantOf || current.id,
                track,
                conceptId: current.conceptId || current.variantOf || current.id,
                form: current.form,
              }),
            );
          }}
        />
      </SessionFrame>
    </ProtectedView>
  );
}
