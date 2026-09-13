"use client";

import { EmptyState } from "@/components/empty-state";
import { t } from "@/lib/i18n";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const dict = t("sv");
  return (
    <EmptyState
      title={dict.errorTitle}
      lead={dict.errorLead}
      actionLabel={dict.errorRetry}
      onAction={reset}
    />
  );
}
