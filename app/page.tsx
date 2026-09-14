"use client";

import Link from "next/link";
import { Onboarding } from "@/components/onboarding";
import { ReadinessWidget } from "@/components/readiness-widget";
import { TeacherPresence } from "@/components/teacher-presence";
import { TrackCard } from "@/components/track-card";
import { TrustStrip } from "@/components/trust-strip";
import { useAppState } from "@/components/app-state";
import { trackLabel, trackProduct } from "@/lib/branding";
import { t } from "@/lib/i18n";
import { computeReadiness } from "@/lib/progress/readiness";
import { useQuestionCatalog } from "@/lib/questions/use-catalog";
import { TRACKS } from "@/lib/types";

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
      <TeacherPresence track={track} />
      <TrustStrip locale={state.profile.locale} />

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
        {TRACKS.map((item) => (
          <TrackCard
            key={item}
            href={`/${item}`}
            icon={item}
            title={trackLabel(item)}
            description={trackProduct(item)}
          />
        ))}
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
