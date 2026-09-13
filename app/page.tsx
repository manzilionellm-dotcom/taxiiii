"use client";

import Link from "next/link";
import { Onboarding } from "@/components/onboarding";
import { ReadinessWidget } from "@/components/readiness-widget";
import { useAppState } from "@/components/app-state";
import { BrandMark } from "@/components/brand-mark";
import { trackLabel, trackProduct } from "@/lib/branding";
import { t } from "@/lib/i18n";
import { computeReadiness } from "@/lib/progress/readiness";
import { useQuestionCatalog } from "@/lib/questions/use-catalog";

export default function HomePage() {
  const { state, hydrated } = useAppState();
  const track = state.profile.activeTrack;
  const { catalog } = useQuestionCatalog(track);
  if (!hydrated) {
    return <p className="text-sm text-[#6b6560]">{t(state.profile.locale).loadingSession}</p>;
  }
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
          {state.profile.name || <BrandMark compact />}
        </p>
        <h1 className="font-serif text-3xl text-black">{trackLabel(track)}</h1>
        <p className="max-w-xl text-[#6b6560]">{dict.tagline}</p>
        <p className="max-w-xl text-sm text-[#6b6560]">{dict.keyMessage}</p>
        <p className="text-sm text-[#6b6560]">{dict.demoNote}</p>
      </header>

      <ReadinessWidget locale={state.profile.locale} readiness={readiness} />

      <div className="grid gap-3 sm:grid-cols-2">
        {state.profile.tracks.map((item) => (
          <Link key={item} href={`/${item}`} className="card block">
            <p className="font-serif text-xl text-black">{trackLabel(item)}</p>
            <p className="mt-1 text-sm text-[#6b6560]">{trackProduct(item)}</p>
          </Link>
        ))}
        <Link href="/owner" className="card block opacity-70">
          <p className="font-serif text-xl text-black">{trackLabel("owner")}</p>
          <p className="mt-1 text-sm text-[#6b6560]">
            {dict.comingSoon} — {trackProduct("owner")}
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
