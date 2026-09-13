"use client";

import Link from "next/link";
import { Onboarding } from "@/components/onboarding";
import { ReadinessWidget } from "@/components/readiness-widget";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { computeReadiness } from "@/lib/progress/readiness";
import { useQuestionCatalog } from "@/lib/questions/use-catalog";

export default function HomePage() {
  const { state, hydrated } = useAppState();
  const track = state.profile.activeTrack;
  const { catalog } = useQuestionCatalog(track);
  if (!hydrated) return <div className="h-40" />;
  if (!state.profile.onboarded) return <Onboarding />;

  const dict = t(state.profile.locale);
  const readiness = computeReadiness(
    track,
    catalog,
    state.attempts,
    state.exams,
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-[#6b6560]">
          {state.profile.name || dict.brand}
        </p>
        <h1 className="font-serif text-3xl text-black">
          {track === "b" ? dict.trackB : dict.trackTaxi}
        </h1>
        <p className="max-w-xl text-[#6b6560]">{dict.tagline}</p>
        <p className="text-sm text-[#6b6560]">{dict.demoNote}</p>
      </header>

      <ReadinessWidget locale={state.profile.locale} readiness={readiness} />

      <div className="grid gap-3 sm:grid-cols-2">
        {state.profile.tracks.map((item) => (
          <Link key={item} href={`/${item}`} className="card block">
            <p className="font-serif text-xl text-black">
              {item === "b" ? dict.trackB : dict.trackTaxi}
            </p>
            <p className="mt-1 text-sm text-[#6b6560]">
              {item === "b" ? dict.trackBDesc : dict.trackTaxiDesc}
            </p>
          </Link>
        ))}
        <Link href="/owner" className="card block opacity-70">
          <p className="font-serif text-xl text-black">{dict.trackOwner}</p>
          <p className="mt-1 text-sm text-[#6b6560]">
            {dict.comingSoon} — {dict.trackOwnerDesc}
          </p>
        </Link>
        <Link href="/chat" className="card block">
          <p className="font-serif text-xl text-black">{dict.chat}</p>
          <p className="mt-1 text-sm text-[#6b6560]">{dict.chatLead}</p>
        </Link>
      </div>
    </div>
  );
}
