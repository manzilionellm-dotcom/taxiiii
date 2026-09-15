"use client";

import Link from "next/link";
import { trackLabel } from "@/lib/branding";
import { t } from "@/lib/i18n";
import type { Locale, Track } from "@/lib/types";

/**
 * The home screen's one action.
 *
 * A home screen that offers eight equal doors makes the user decide before
 * they can study; the app then feels like a menu, not a course. So: one
 * inverted card, the teacher's line of the day, one filled button, and the
 * resume link only when there is something to resume. Everything else on the
 * screen is status, not a choice.
 */
export function HomeHero({
  locale,
  track,
  greeting,
  note,
  dueCount,
  resumeHref,
}: {
  locale: Locale;
  track: Track;
  greeting: string;
  note: string;
  dueCount: number;
  resumeHref?: string;
}) {
  const dict = t(locale);
  return (
    <section className="home-hero">
      <p className="home-hero-eyebrow">
        {trackLabel(track)}
        {dueCount > 0 ? ` · ${dueCount} ${dict.dueToday.toLowerCase()}` : ""}
      </p>
      <h1 className="home-hero-title">{greeting}</h1>
      <p className="home-hero-note">{note}</p>
      <Link href={`/${track}/study`} className="home-hero-cta">
        {dict.startSession}
      </Link>
      {resumeHref ? (
        <Link href={resumeHref} className="home-hero-resume">
          {dict.teacherResume}
        </Link>
      ) : null}
    </section>
  );
}
