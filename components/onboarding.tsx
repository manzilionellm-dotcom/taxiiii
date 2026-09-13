"use client";

import { useState } from "react";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { updateProfile } from "@/lib/progress/store";
import type { Track } from "@/lib/types";

export function Onboarding() {
  const { state, setState } = useAppState();
  const [locale, setLocale] = useState(state.profile.locale);
  const dict = t(locale);
  const [choice, setChoice] = useState<"b" | "taxi" | "both">("taxi");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tos, setTos] = useState(false);
  const [fragile, setFragile] = useState(false);

  function submit() {
    if (!tos) return;
    const tracks: Track[] = choice === "both" ? ["b", "taxi"] : [choice];
    setState(
      updateProfile(state, {
        name,
        email,
        tracks,
        activeTrack: tracks.includes("taxi") ? "taxi" : "b",
        locale,
        fragileMode: fragile,
        supportLevel: fragile ? 3 : 2,
        onboarded: true,
        tosAccepted: true,
      }),
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-8 py-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6b6560]">{dict.brand}</p>
        <h1 className="font-serif text-4xl leading-tight text-black">{dict.onboardingTitle}</h1>
        <p className="text-lg text-[#6b6560]">{dict.onboardingLead}</p>
      </header>

      <div className="flex rounded-full border border-[#ddd6c8] bg-white p-1">
        {(["sv", "fr"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item)}
            className={`flex-1 rounded-full py-2 text-sm ${
              locale === item ? "bg-[#1f3d2b] text-white" : "text-[#1f3d2b]"
            }`}
          >
            {item === "sv" ? dict.swedish : dict.french}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {(
          [
            ["b", dict.trackB, dict.trackBDesc],
            ["taxi", dict.trackTaxi, dict.trackTaxiDesc],
            ["both", dict.bothTracks, dict.onboardingLead],
          ] as const
        ).map(([id, title, desc]) => (
          <button
            key={id}
            type="button"
            onClick={() => setChoice(id)}
            className={`card text-left ${choice === id ? "ring-2 ring-[#1f3d2b]" : ""}`}
          >
            <p className="font-serif text-xl text-black">{title}</p>
            <p className="mt-1 text-sm text-[#6b6560]">{desc}</p>
          </button>
        ))}
        <div className="card opacity-70">
          <p className="font-serif text-xl text-black">{dict.trackOwner}</p>
          <p className="mt-1 text-sm text-[#6b6560]">
            {dict.trackOwnerDesc} · {dict.comingSoon}
          </p>
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-[#6b6560]">{dict.yourName}</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-[#ddd6c8] bg-white px-3 py-3 text-black"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-[#6b6560]">{dict.yourEmail}</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-[#ddd6c8] bg-white px-3 py-3 text-black"
        />
      </label>

      <label className="card flex items-start gap-3">
        <input
          type="checkbox"
          checked={fragile}
          onChange={(event) => setFragile(event.target.checked)}
          className="mt-1"
        />
        <span>
          <span className="block font-medium text-black">{dict.fragileMode}</span>
          <span className="text-sm text-[#6b6560]">{dict.fragileHint}</span>
        </span>
      </label>

      <label className="card flex items-start gap-3">
        <input
          type="checkbox"
          checked={tos}
          onChange={(event) => setTos(event.target.checked)}
          className="mt-1"
        />
        <span>
          <span className="block font-medium text-black">{dict.tosTitle}</span>
          <span className="text-sm text-[#6b6560]">{dict.tos}</span>
          <span className="mt-1 block text-sm font-medium text-black">{dict.tosAccept}</span>
        </span>
      </label>

      <button type="button" className="btn-primary w-full" disabled={!tos} onClick={submit}>
        {dict.start}
      </button>
      {!tos ? <p className="text-center text-xs text-[#6b6560]">{dict.tosRequired}</p> : null}
    </div>
  );
}
