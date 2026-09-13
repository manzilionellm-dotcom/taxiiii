"use client";

import { t } from "@/lib/i18n";
import type { ReadinessBreakdown } from "@/lib/progress/readiness";
import type { Locale } from "@/lib/types";

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-[#6b6560]">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#ece6d8]">
        <div
          className="h-full rounded-full bg-[#1f3d2b]"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export function ReadinessWidget({
  locale,
  readiness,
}: {
  locale: Locale;
  readiness: ReadinessBreakdown;
}) {
  const dict = t(locale);
  return (
    <section className="card space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#6b6560]">{dict.readiness}</p>
          <p className="mt-1 font-serif text-4xl text-black">{readiness.score}%</p>
        </div>
        <p
          className={`max-w-[14rem] text-right text-sm leading-5 ${
            readiness.ready ? "font-semibold text-[#1f3d2b]" : "text-[#6b6560]"
          }`}
        >
          {readiness.ready ? dict.readyMessage : dict.notReadyYet}
        </p>
      </div>
      <div className="grid gap-3">
        <Bar label={dict.recentAccuracy} value={readiness.recentAccuracy} />
        <Bar label={dict.topicCoverage} value={readiness.topicCoverage} />
        <Bar label={dict.trend30} value={readiness.trend30} />
        <Bar label={dict.mockExams} value={readiness.mockExam} />
      </div>
    </section>
  );
}
