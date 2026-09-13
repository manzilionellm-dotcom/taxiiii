"use client";

import { useParams } from "next/navigation";
import { CalculForm } from "@/components/calcul-form";
import { EmptyState } from "@/components/empty-state";
import { useAppState } from "@/components/app-state";
import { getExercise } from "@/lib/calcul/exercises";
import { t } from "@/lib/i18n";

export default function CalculExercisePage() {
  const params = useParams<{ slug: string }>();
  const { state } = useAppState();
  const dict = t(state.profile.locale);
  const exercise = getExercise(params.slug);
  if (!exercise) {
    return (
      <EmptyState
        title={dict.notFoundTitle}
        lead={dict.notFoundLead}
        actionHref="/taxi/calcul"
        actionLabel={dict.calcul}
      />
    );
  }
  return <CalculForm exercise={exercise} locale={state.profile.locale} />;
}
