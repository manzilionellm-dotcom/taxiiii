"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { ReadinessWidget } from "@/components/readiness-widget";
import { useAppState } from "@/components/app-state";
import { trackLabel, trackProduct } from "@/lib/branding";
import { t } from "@/lib/i18n";
import { computeReadiness } from "@/lib/progress/readiness";
import { isDue } from "@/lib/progress/srs";
import { updateProfile } from "@/lib/progress/store";
import { useQuestionCatalog } from "@/lib/questions/use-catalog";
import { topicsForTrack, type Track } from "@/lib/types";

export function TrackDashboard({ track }: { track: Track }) {
  const { state, setState } = useAppState();
  const dict = t(state.profile.locale);

  useEffect(() => {
    const alreadyTracked = state.profile.tracks.includes(track);
    if (alreadyTracked && state.profile.activeTrack === track) return;
    setState(
      updateProfile(state, {
        tracks: alreadyTracked ? state.profile.tracks : [...state.profile.tracks, track],
        activeTrack: track,
      }),
    );
  }, [setState, state, track]);
  const { catalog } = useQuestionCatalog(track);
  const readiness = useMemo(
    () => computeReadiness(track, catalog, state.attempts, state.exams),
    [track, catalog, state.attempts, state.exams],
  );
  const attempts = state.attempts.filter((item) => item.track === track);
  const correct = attempts.filter((item) => item.correct).length;
  const due = state.srs.filter((card) => card.track === track && isDue(card)).length;
  const byTopic = topicsForTrack(track).map((topic) => {
    const ids = catalog.filter((q) => q.topic === topic);
    const seen = new Set(
      attempts.filter((item) => ids.some((q) => q.id === item.questionId)).map((a) => a.questionId),
    );
    return {
      topic,
      seen: seen.size,
      total: ids.length,
      acc:
        attempts.filter((item) => ids.some((q) => q.id === item.questionId)).length === 0
          ? 0
          : Math.round(
              (attempts.filter(
                (item) => item.correct && ids.some((q) => q.id === item.questionId),
              ).length /
                Math.max(
                  1,
                  attempts.filter((item) => ids.some((q) => q.id === item.questionId)).length,
                )) *
                100,
            ),
    };
  });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-[#6b6560]">{dict.dashboard}</p>
        <h1 className="font-serif text-3xl text-black">{trackLabel(track)}</h1>
        <p className="max-w-xl text-[#6b6560]">{trackProduct(track)}</p>
        <p className="max-w-xl text-sm text-[#6b6560]">
          {track === "owner" ? dict.studyOrderOwner : dict.studyOrder}
        </p>
        <p className="text-xs leading-5 text-[#8a8276]">{dict.demoNote}</p>
      </header>

      <ReadinessWidget locale={state.profile.locale} readiness={readiness} />

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label={dict.attempts} value={String(attempts.length)} />
        <Stat
          label={dict.accuracy}
          value={attempts.length ? `${Math.round((correct / attempts.length) * 100)}%` : "—"}
        />
        <Stat label={dict.dueToday} value={String(due)} />
      </section>

      <section className="card overflow-x-auto">
        <h2 className="font-serif text-lg text-black">{dict.stats}</h2>
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-[#6b6560]">
            <tr>
              <th className="pb-2 font-medium">{dict.topicCoverage}</th>
              <th className="pb-2 font-medium">n</th>
              <th className="pb-2 font-medium">{dict.accuracy}</th>
            </tr>
          </thead>
          <tbody>
            {byTopic.map((row) => (
              <tr key={row.topic} className="border-t border-[#eee6d6]">
                <td className="py-2.5 text-black">{dict.topic[row.topic]}</td>
                <td className="py-2.5 tabular-nums">
                  {row.seen}/{row.total}
                </td>
                <td className="py-2.5 tabular-nums">{row.acc}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href={`/${track}/study`} className="btn-primary">
          {dict.startSession}
        </Link>
        <Link href={`/${track}/exam`} className="btn-secondary">
          {dict.startExam}
        </Link>
        {track === "taxi" ? (
          <Link href="/taxi/calcul" className="btn-secondary sm:col-span-2">
            {dict.calcul}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-[0.14em] text-[#6b6560]">{label}</p>
      <p className="mt-1 font-serif text-3xl tabular-nums text-black">{value}</p>
    </div>
  );
}
