"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { lawWatchDateLabel, lawWatchFresh, lawWatchMeta } from "@/lib/law-watch";
import { computeTeacherPresence, persistableWeakTopics } from "@/lib/teacher/presence";
import { topicSv } from "@/lib/teacher/copy.mjs";
import { useQuestionCatalog } from "@/lib/questions/use-catalog";
import type { Track } from "@/lib/types";

export function TeacherPresence({
  track,
  compact = false,
}: {
  track: Track;
  compact?: boolean;
}) {
  const { state, setState } = useAppState();
  const dict = t(state.profile.locale);
  const { catalog } = useQuestionCatalog(track);
  const model = useMemo(
    () => computeTeacherPresence(state, catalog, track, state.profile.locale),
    [state, catalog, track],
  );

  useEffect(() => {
    const weak = persistableWeakTopics(state, catalog, track);
    const lastNote = (state.teacherNotes ?? []).at(-1);
    const sameWeak = JSON.stringify(weak) === JSON.stringify(state.weakTopics ?? []);
    if (sameWeak && lastNote === model.dailyNote) return;
    setState((prev) => ({
      ...prev,
      weakTopics: weak,
      teacherNotes:
        lastNote === model.dailyNote
          ? prev.teacherNotes
          : [...(prev.teacherNotes ?? []).slice(-11), model.dailyNote],
    }));
  }, [catalog, model.dailyNote, setState, state.teacherNotes, state.weakTopics, state.attempts, track]);

  if (compact) {
    return (
      <section className="rounded-2xl border border-[#ddd6c8] bg-[#fffdf8] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8276]">
          {dict.tutor}
        </p>
        <p className="mt-1 font-serif text-lg leading-snug text-black">{model.greeting}</p>
        <p className="mt-1 text-sm leading-6 text-[#1f3d2b]">{model.note}</p>
      </section>
    );
  }

  return (
    <section className="solution-panel">
      <header className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8276]">
          {dict.tutor}
        </p>
        <h2 className="font-serif text-2xl leading-tight text-black">{model.greeting}</h2>
        <p className="text-[1.02rem] leading-7 text-[#1f3d2b]">{model.note}</p>
      </header>

      {model.weak.length ? (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8276]">
            {dict.teacherWeakMap}
          </p>
          <ul className="space-y-1.5">
            {model.weak.map((row) => (
              <li key={row.topic}>
                <Link
                  href={`/${track}/study?focus=${row.topic}`}
                  className="flex items-baseline justify-between gap-3 text-sm text-black hover:text-[#1f3d2b]"
                >
                  <span>{dict.topic[row.topic]}</span>
                  <span className="tabular-nums text-[#6b6560]">{row.accuracy}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-2">
        <Link href={model.correctHref} className="btn-primary">
          {dict.teacherCorrectThis}
        </Link>
        {model.resumeHref ? (
          <Link href={model.resumeHref} className="btn-secondary">
            {dict.teacherResume}
          </Link>
        ) : null}
      </div>

      <LawWatchBadge locale={state.profile.locale} />
    </section>
  );
}

export function TeacherMissNudge({ track }: { track: Track }) {
  const { state } = useAppState();
  const dict = t(state.profile.locale);
  const model = computeTeacherPresence(state, [], track, state.profile.locale);
  if (model.missStreak < 3) return null;
  const label = model.missLabel || (state.lastSession?.topic ? topicSv(state.lastSession.topic) : "");
  return (
    <p className="rounded-2xl border border-[#ddd6c8] bg-[#fffdf8] px-3.5 py-2.5 text-sm leading-6 text-[#1f3d2b]">
      {dict.tutor} · {dict.teacherMissNudge}
      {label ? ` ${label}.` : ""}
    </p>
  );
}

export function LawWatchBadge({ locale }: { locale: "fr" | "sv" }) {
  const dict = t(locale);
  const date = lawWatchDateLabel(locale);
  const fresh = lawWatchFresh();
  const status = lawWatchMeta().status;
  const label = `${dict.lawWatchFresh}${date ? ` · ${date}` : ""}`;
  const hint = !fresh || status !== "merged" ? dict.lawWatchPending : null;
  return (
    <p className="text-[11px] leading-5 text-[#8a8276]" title={hint || undefined}>
      {label}
    </p>
  );
}
