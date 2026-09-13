import { EmptyState } from "@/components/empty-state";
import { t } from "@/lib/i18n";

export default function NotFoundPage() {
  const dict = t("sv");
  return (
    <EmptyState
      title={dict.notFoundTitle}
      lead={dict.notFoundLead}
      actionHref="/"
      actionLabel={dict.goHome}
    />
  );
}
