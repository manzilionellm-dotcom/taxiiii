"use client";

import Link from "next/link";
import { useAppState } from "@/components/app-state";
import { CALCUL_EXERCISES } from "@/lib/calcul/exercises";
import { t } from "@/lib/i18n";

export default function CalculIndexPage() {
  const { state } = useAppState();
  const dict = t(state.profile.locale);
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl text-black">{dict.calcul}</h1>
        <p className="text-[#6b6560]">{dict.calculLead}</p>
      </header>
      <div className="grid gap-3">
        {CALCUL_EXERCISES.map((exercise) => (
          <Link key={exercise.slug} href={`/taxi/calcul/${exercise.slug}`} className="card block">
            <p className="font-serif text-xl text-black">{exercise.titleSv}</p>
            <p className="mt-1 text-[#1d4ed8]">{exercise.titleFr}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
