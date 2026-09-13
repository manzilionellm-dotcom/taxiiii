"use client";

import { useParams } from "next/navigation";
import { CalculForm } from "@/components/calcul-form";
import { useAppState } from "@/components/app-state";
import { getExercise } from "@/lib/calcul/exercises";

export default function CalculExercisePage() {
  const params = useParams<{ slug: string }>();
  const { state } = useAppState();
  const exercise = getExercise(params.slug);
  if (!exercise) {
    return <p className="text-[#6b6560]">Not found.</p>;
  }
  return <CalculForm exercise={exercise} locale={state.profile.locale} />;
}
