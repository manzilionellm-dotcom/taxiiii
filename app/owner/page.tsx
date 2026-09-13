"use client";

import { useAppState } from "@/components/app-state";
import { trackLabel } from "@/lib/branding";
import { t } from "@/lib/i18n";

export default function OwnerPage() {
  const { state } = useAppState();
  const dict = t(state.profile.locale);
  return (
    <div className="card space-y-3">
      <p className="text-xs uppercase tracking-[0.16em] text-[#6b6560]">{dict.comingSoon}</p>
      <h1 className="font-serif text-3xl text-black">{trackLabel("owner")}</h1>
      <p className="text-[#6b6560]">{dict.ownerSoon}</p>
    </div>
  );
}
