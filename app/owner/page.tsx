"use client";

import { EmptyState } from "@/components/empty-state";
import { useAppState } from "@/components/app-state";
import { trackLabel } from "@/lib/branding";
import { t } from "@/lib/i18n";

export default function OwnerPage() {
  const { state } = useAppState();
  const dict = t(state.profile.locale);
  return (
    <EmptyState
      title={trackLabel("owner")}
      lead={`${dict.comingSoon}. ${dict.ownerSoon}`}
      actionHref="/"
      actionLabel={dict.goHome}
    />
  );
}
