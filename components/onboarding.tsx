"use client";

import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { TrackCard } from "@/components/track-card";
import { TrustStrip } from "@/components/trust-strip";
import { useAppState } from "@/components/app-state";
import { trackLabel } from "@/lib/branding";
import { t } from "@/lib/i18n";
import { updateProfile } from "@/lib/progress/store";
import { TRACKS, type Track } from "@/lib/types";

const STEPS = 3;

/**
 * First run, three steps, one decision each.
 *
 * It used to be a single scroll holding the language switch, four track cards,
 * two text fields and two checkboxes, with the enabled/disabled Start button
 * far below the consent that unlocks it. A new user had to parse the whole
 * product before they could enter it, and the one required action was the one
 * off screen. Now each screen asks one thing, the button is always the last
 * element, and nothing is disabled without the reason sitting next to it.
 */
export function Onboarding() {
  const { state, setState } = useAppState();
  const [step, setStep] = useState(0);
  const [locale, setLocale] = useState(state.profile.locale);
  const dict = t(locale);
  const [choice, setChoice] = useState<"b" | "taxi" | "owner" | "both">("taxi");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tos, setTos] = useState(false);
  const [fragile, setFragile] = useState(false);

  function submit() {
    if (!tos) return;
    const tracks: Track[] = choice === "both" ? [...TRACKS] : [choice];
    setState(
      updateProfile(state, {
        name,
        email,
        tracks,
        activeTrack: tracks.includes("taxi")
          ? "taxi"
          : tracks.includes("owner")
            ? "owner"
            : "b",
        locale,
        fragileMode: fragile,
        supportLevel: fragile ? 3 : 2,
        /** A Swedish-reading user starts clean; the FR switch is in Settings. */
        showTranslations: locale === "fr",
        onboarded: true,
        tosAccepted: true,
      }),
    );
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col gap-7 py-2">
      <header className="space-y-3">
        <p className="text-[#1f3d2b]">
          <BrandMark compact glyph />
        </p>
        <div className="onboard-dots" aria-hidden>
          {Array.from({ length: STEPS }, (_, index) => (
            <span key={index} data-on={index <= step ? "true" : "false"} />
          ))}
        </div>
      </header>

      {step === 0 ? (
        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <h1 className="font-serif text-[2rem] leading-[1.15] text-black sm:text-4xl">
              {dict.tagline}
            </h1>
            <p className="text-lg leading-7 text-[#6b6560]">{dict.keyMessage}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-black">{dict.language}</p>
            <div className="flex rounded-full border border-[#ddd6c8] bg-white p-1">
              {(["sv", "fr"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLocale(item)}
                  aria-pressed={locale === item}
                  className={`min-h-12 flex-1 rounded-full text-sm font-medium ${
                    locale === item ? "bg-[#1f3d2b] text-white" : "text-[#1f3d2b]"
                  }`}
                >
                  {item === "sv" ? dict.swedish : dict.french}
                </button>
              ))}
            </div>
          </div>
          <TrustStrip locale={locale} />
        </div>
      ) : null}

      {step === 1 ? (
        <div className="flex-1 space-y-5">
          <div className="space-y-2">
            <h1 className="font-serif text-[1.7rem] leading-tight text-black">
              {dict.onboardingTitle}
            </h1>
            <p className="text-[#6b6560]">{dict.onboardingLead}</p>
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
              icon="owner"
              title={trackLabel("owner")}
              description={dict.trackOwnerDesc}
              selected={choice === "owner"}
              onClick={() => setChoice("owner")}
            />
            <TrackCard
              icon="both"
              title={dict.bothTracks}
              description={dict.bothTracksDesc}
              selected={choice === "both"}
              onClick={() => setChoice("both")}
            />
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex-1 space-y-5">
          <h1 className="font-serif text-[1.7rem] leading-tight text-black">{dict.start}</h1>

          <label className="block space-y-2">
            <span className="text-sm text-[#6b6560]">{dict.yourName}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field"
              autoComplete="given-name"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-[#6b6560]">{dict.yourEmail}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field"
              autoComplete="email"
              inputMode="email"
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
        </div>
      ) : null}

      <footer className="space-y-2">
        {step < STEPS - 1 ? (
          <button type="button" className="btn-primary w-full" onClick={() => setStep(step + 1)}>
            {dict.continue}
          </button>
        ) : (
          <>
            <button type="button" className="btn-primary w-full" disabled={!tos} onClick={submit}>
              {dict.start}
            </button>
            {!tos ? (
              <p className="text-center text-xs text-[#6b6560]">{dict.tosRequired}</p>
            ) : null}
          </>
        )}
        {step > 0 ? (
          <button
            type="button"
            className="min-h-11 w-full text-sm font-medium text-[#6b6560]"
            onClick={() => setStep(step - 1)}
          >
            {dict.back}
          </button>
        ) : null}
      </footer>
    </div>
  );
}
