"use client";

import Link from "next/link";
import { Onboarding } from "@/components/onboarding";
import { ReadinessWidget } from "@/components/readiness-widget";
import { TrackCard } from "@/components/track-card";
import { TrustStrip } from "@/components/trust-strip";
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
  if (!hydrated) return null;
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
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-[#6b6560]">
          {state.profile.name || <BrandMark compact />}
        </p>
        <h1 className="font-serif text-3xl leading-tight text-black">{trackLabel(track)}</h1>
        <p className="max-w-xl text-lg leading-7 text-[#6b6560]">{dict.tagline}</p>
        <p className="max-w-xl text-sm text-[#6b6560]">{dict.keyMessage}</p>
        <TrustStrip locale={state.profile.locale} />
      </header>

      <div className="grid gap-3">
        <Link href={`/${track}/study`} className="btn-primary">
          {dict.startSession}
        </Link>
        <Link href={`/${track}/exam`} className="btn-secondary">
          {dict.startExam}
        </Link>
      </div>

      <ReadinessWidget locale={state.profile.locale} readiness={readiness} />

      <div className="grid gap-3 sm:grid-cols-2">
        {state.profile.tracks.map((item) => (
          <TrackCard
            key={item}
            href={`/${item}`}
            icon={item}
            title={trackLabel(item)}
            description={trackProduct(item)}
          />
        ))}
        {!state.profile.tracks.includes("owner") ? (
          <TrackCard
            href="/owner"
            icon="owner"
            title={trackLabel("owner")}
            description={trackProduct("owner")}
          />
        ) : null}
        <TrackCard
          href="/chat"
          icon="chat"
          title={dict.chat}
          description={dict.chatLead}
        />
      </div>

      <p className="text-xs leading-5 text-[#8a8276]">{dict.demoNote}</p>
    </div>
  );
}
