"use client";

import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { TrackCard } from "@/components/track-card";
import { TrustStrip } from "@/components/trust-strip";
import { useAppState } from "@/components/app-state";
import { trackLabel, trackProduct } from "@/lib/branding";
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
    <div className="mx-auto max-w-xl space-y-8 py-2">
      <header className="space-y-4">
        <p className="text-[#1f3d2b]">
          <BrandMark compact glyph />
        </p>
        <h1 className="font-serif text-[2.15rem] leading-[1.15] text-black sm:text-4xl">
          {dict.tagline}
        </h1>
        <p className="text-lg leading-7 text-[#6b6560]">{dict.keyMessage}</p>
        <p className="text-[#6b6560]">{dict.onboardingLead}</p>
        <TrustStrip locale={locale} />
      </header>

      <div className="flex rounded-full border border-[#ddd6c8] bg-white p-1">
        {(["sv", "fr"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item)}
            className={`min-h-11 flex-1 rounded-full text-sm font-medium ${
              locale === item ? "bg-[#1f3d2b] text-white" : "text-[#1f3d2b]"
            }`}
          >
            {item === "sv" ? dict.swedish : dict.french}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        <TrackCard
          icon="b"
          title={trackLabel("b")}
          description={dict.trackBDesc}
          selected={choice === "b"}
          onClick={() => setChoice("b")}
        />
        <TrackCard
          icon="taxi"
          title={trackLabel("taxi")}
          description={dict.trackTaxiDesc}
          selected={choice === "taxi"}
          onClick={() => setChoice("taxi")}
        />
        <TrackCard
          icon="both"
          title={dict.bothTracks}
          description={dict.onboardingLead}
          selected={choice === "both"}
          onClick={() => setChoice("both")}
        />
        <TrackCard
          icon="owner"
          title={trackLabel("owner")}
          description={`${trackProduct("owner")} · ${dict.comingSoon}`}
          muted
          badge={dict.comingSoon}
        />
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-[#6b6560]">{dict.yourName}</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="field"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-[#6b6560]">{dict.yourEmail}</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field"
        />
      </label>

      <label className="card flex items-start gap-3">
        <input
          type="checkbox"
          checked={fragile}
          onChange={(event) => setFragile(event.target.checked)}
          className="checkbox"
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
          className="checkbox"
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
