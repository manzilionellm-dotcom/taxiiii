"use client";

import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { emptyState, updateProfile } from "@/lib/progress/store";
import type { SupportLevel, Track } from "@/lib/types";

export default function SettingsPage() {
  const { state, setState } = useAppState();
  const dict = t(state.profile.locale);
  const tracks = state.profile.tracks;

  function toggleTrack(track: Track) {
    const next = tracks.includes(track)
      ? tracks.filter((item) => item !== track)
      : [...tracks, track];
    if (!next.length) return;
    setState(
      updateProfile(state, {
        tracks: next,
        activeTrack: next.includes(state.profile.activeTrack)
          ? state.profile.activeTrack
          : next[0],
      }),
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-black">{dict.settings}</h1>

      <section className="card space-y-3">
        <p className="text-sm font-medium text-black">{dict.switchTrack}</p>
        {(["b", "taxi"] as const).map((track) => (
          <label key={track} className="flex items-center gap-2 text-black">
            <input
              type="checkbox"
              checked={tracks.includes(track)}
              onChange={() => toggleTrack(track)}
            />
            {track === "b" ? dict.trackB : dict.trackTaxi}
          </label>
        ))}
        <p className="text-sm text-[#9a9388]">
          {dict.trackOwner} — {dict.comingSoon}
        </p>
      </section>

      <section className="card space-y-3">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={state.profile.fragileMode}
            onChange={(event) =>
              setState(updateProfile(state, { fragileMode: event.target.checked }))
            }
          />
          <span>
            <span className="block text-black">{dict.fragileMode}</span>
            <span className="text-sm text-[#6b6560]">{dict.fragileHint}</span>
          </span>
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-[#6b6560]">{dict.supportFade}</span>
          <input
            type="range"
            min={0}
            max={3}
            value={state.profile.supportLevel}
            onChange={(event) =>
              setState(
                updateProfile(state, {
                  supportLevel: Number(event.target.value) as SupportLevel,
                }),
              )
            }
            className="w-full"
          />
          <span className="text-xs text-[#6b6560]">
            {state.profile.supportLevel >= 2 ? dict.supportHigh : dict.supportLow}
          </span>
        </label>
      </section>

      <section className="card space-y-3">
        <p className="font-medium text-black">{dict.tosTitle}</p>
        <p className="text-sm text-[#6b6560]">{dict.tos}</p>
        <label className="block space-y-1">
          <span className="text-sm text-[#6b6560]">{dict.yourEmail}</span>
          <input
            type="email"
            value={state.profile.email ?? ""}
            onChange={(event) =>
              setState(updateProfile(state, { email: event.target.value }))
            }
            className="w-full rounded-xl border border-[#ddd6c8] bg-white px-3 py-2 text-black"
          />
        </label>
      </section>

      <p className="text-xs text-[#8a8276]">{dict.protectionNote}</p>

      <button type="button" className="btn-secondary" onClick={() => setState(emptyState())}>
        {dict.resetProgress}
      </button>
    </div>
  );
}
