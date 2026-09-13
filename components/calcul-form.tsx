"use client";

import { useMemo, useState } from "react";
import { ProtectedView } from "@/components/protected-view";
import { t } from "@/lib/i18n";
import type { CalculExercise } from "@/lib/calcul/exercises";
import type { Locale } from "@/lib/types";

export function CalculForm({
  exercise,
  locale,
}: {
  exercise: CalculExercise;
  locale: Locale;
}) {
  const dict = t(locale);
  const [values, setValues] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [cloze, setCloze] = useState("");
  const [revealed, setRevealed] = useState(false);

  const numeric = useMemo(() => {
    const parsed: Record<string, number> = {};
    for (const field of exercise.fields) {
      parsed[field.name] = Number(values[field.name] ?? "");
    }
    return parsed;
  }, [exercise.fields, values]);

  const result = useMemo(() => {
    if (!show) return null;
    if (exercise.fields.some((field) => Number.isNaN(numeric[field.name]))) return null;
    return exercise.compute(numeric);
  }, [exercise, numeric, show]);

  const wordOk =
    cloze.trim().toLowerCase() === exercise.cloze.sv.toLowerCase() || revealed;

  return (
    <ProtectedView locale={locale}>
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl text-black">
          {locale === "sv" ? exercise.titleSv : exercise.titleFr}
        </h1>
        <p className="text-[#1d4ed8]">
          {locale === "sv" ? exercise.titleFr : exercise.titleSv}
        </p>
      </header>

      <section className="card space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-[#6b6560]">{dict.formula}</p>
        <p className="text-black">{exercise.formulaSv}</p>
        <p className="text-[#1d4ed8]">{exercise.formulaFr}</p>
      </section>

      <section className="card space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-[#6b6560]">{dict.example}</p>
        <p className="text-black">{exercise.exampleSv}</p>
        <p className="text-[#1d4ed8]">{exercise.exampleFr}</p>
      </section>

      <section className="card space-y-3">
        <p className="text-sm text-black">
          {dict.typeWord}:{" "}
          {wordOk ? (
            <strong className="text-[#b91c1c]">{exercise.cloze.sv}</strong>
          ) : (
            <input
              value={cloze}
              onChange={(event) => setCloze(event.target.value)}
              className="ml-2 min-h-10 rounded-md border border-[#c41e3a]/40 px-2 py-1"
            />
          )}
        </p>
        {wordOk ? (
          <p className="text-sm text-[#b91c1c]">{exercise.cloze.fr}</p>
        ) : (
          <button type="button" className="text-sm text-[#b91c1c]" onClick={() => setRevealed(true)}>
            {dict.reveal}
          </button>
        )}
      </section>

      <form
        className="card space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          setShow(true);
        }}
      >
        {exercise.fields.map((field) => (
          <label key={field.name} className="block space-y-1">
            <span className="text-sm text-black">
              {locale === "sv" ? field.labelSv : field.labelFr}
              {field.unit ? ` (${field.unit})` : ""}
            </span>
            <span className="block text-xs text-[#1d4ed8]">
              {locale === "sv" ? field.labelFr : field.labelSv}
            </span>
            <input
              inputMode="decimal"
              value={values[field.name] ?? ""}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
              }
              className="field"
            />
          </label>
        ))}
        <button type="submit" className="btn-primary w-full">
          {dict.compute}
        </button>
      </form>

      {result ? (
        <section className="card space-y-2">
          <p className="font-serif text-3xl text-black">
            {result.result.toFixed(2)} {result.unit}
          </p>
          <p className="text-black">{result.workSv}</p>
          <p className="text-[#1d4ed8]">{result.workFr}</p>
        </section>
      ) : null}
    </article>
    </ProtectedView>
  );
}
