"use client";

import Link from "next/link";
import { CalculIcon } from "@/components/nav-icons";
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
          <Link key={exercise.slug} href={`/taxi/calcul/${exercise.slug}`} className="card flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1f3d2b]/8 text-[#1f3d2b]">
              <CalculIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-xl text-black">{exercise.titleSv}</span>
              <span className="mt-1 block text-[#1d4ed8]">{exercise.titleFr}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
