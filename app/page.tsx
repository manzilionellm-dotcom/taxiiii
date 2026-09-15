"use client";

import Link from "next/link";
import { useMemo } from "react";
import { HomeHero } from "@/components/home-hero";
import { Onboarding } from "@/components/onboarding";
import { StatTile, StatTiles } from "@/components/stat-tiles";
import { WeakTopicList } from "@/components/teacher-presence";
import { TrustStrip } from "@/components/trust-strip";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { computeReadiness } from "@/lib/progress/readiness";
import { isDue } from "@/lib/progress/srs";
import { computeTeacherPresence } from "@/lib/teacher/presence";
import { useQuestionCatalog } from "@/lib/questions/use-catalog";

export default function HomePage() {
  const { state, hydrated } = useAppState();
  const track = state.profile.activeTrack;
  const { catalog } = useQuestionCatalog(track);
  const readiness = useMemo(
    () => computeReadiness(track, catalog, state.attempts, state.exams),
    [track, catalog, state.attempts, state.exams],
  );
  const teacher = useMemo(
    () => computeTeacherPresence(state, catalog, track, state.profile.locale),
    [state, catalog, track],
  );

  if (!hydrated) return null;
  if (!state.profile.onboarded) return <Onboarding />;

  const dict = t(state.profile.locale);
  const attempts = state.attempts.filter((item) => item.track === track);
  const correct = attempts.filter((item) => item.correct).length;
  const due = state.srs.filter((card) => card.track === track && isDue(card)).length;

  return (
    <div className="space-y-5">
      <HomeHero
        locale={state.profile.locale}
        track={track}
        greeting={teacher.greeting}
        note={teacher.note}
        dueCount={due}
        resumeHref={teacher.resumeHref}
      />

      <StatTiles>
        <StatTile
          label={dict.readiness}
          value={String(readiness.score)}
          suffix="%"
          tone="accent"
          href={`/${track}`}
        />
        <StatTile label={dict.dueToday} value={String(due)} href={`/${track}/study`} />
        <StatTile
          label={dict.accuracy}
          value={attempts.length ? String(Math.round((correct / attempts.length) * 100)) : "—"}
          suffix={attempts.length ? "%" : undefined}
          href={`/${track}`}
        />
      </StatTiles>

      {/*
        No secondary action row here. Exam, teacher and Calcul are three of the
        six tabs already on screen; a home screen that repeats its own tab bar
        in bigger type is clutter, and it costs the hero its monopoly on the
        first tap. What belongs here is what the tab bar cannot say — which
        topics are weak right now.
      */}
      <WeakTopicList
        track={track}
        locale={state.profile.locale}
        weak={teacher.weak}
        className="card"
      />

      <TrustStrip locale={state.profile.locale} />
    </div>
  );
}
