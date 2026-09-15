"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { BrandGlyph, BrandMark } from "@/components/brand-mark";
import { useAppState } from "@/components/app-state";
import {
  CalculIcon,
  ChatIcon,
  ExamIcon,
  HomeIcon,
  SettingsIcon,
  StudyIcon,
} from "@/components/nav-icons";
import { useChrome } from "@/components/chrome";
import { SplashScreen } from "@/components/splash-screen";
import { brandLockup, trackLabel, trackShortLabel } from "@/lib/branding";
import { t } from "@/lib/i18n";
import { updateProfile } from "@/lib/progress/store";
import { TRACKS, type Locale, type Track } from "@/lib/types";

const NAV = [
  { href: "/", key: "home" as const, Icon: HomeIcon },
  { href: "/study", key: "study" as const, Icon: StudyIcon },
  { href: "/exam", key: "exam" as const, Icon: ExamIcon },
  { href: "/taxi/calcul", key: "calcul" as const, Icon: CalculIcon, taxiOnly: true },
  { href: "/chat", key: "chat" as const, Icon: ChatIcon },
  { href: "/settings", key: "settings" as const, Icon: SettingsIcon },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state, setState, hydrated } = useAppState();
  const { focus } = useChrome();
  const dict = t(state.profile.locale);
  const track = state.profile.activeTrack;
  const onboarded = hydrated && state.profile.onboarded;
  const showNav = onboarded && !focus;

  function setLocale(locale: Locale) {
    /**
     * Picking FR means "I want French", not "relabel the buttons". Turning the
     * per-question translation on here is what a user reads this control as
     * doing, and it removes the tap they otherwise had to repeat per question.
     */
    setState(
      updateProfile(state, locale === "fr" ? { locale, showTranslations: true } : { locale }),
    );
  }

  function setTrack(next: Track) {
    setState(
      updateProfile(state, {
        activeTrack: next,
        tracks: state.profile.tracks.includes(next)
          ? state.profile.tracks
          : [...state.profile.tracks, next],
      }),
    );
  }

  useEffect(() => {
    document.documentElement.lang = state.profile.locale;
  }, [state.profile.locale]);

  /** CSS-only concerns (scroll padding) read focus mode off the root element. */
  useEffect(() => {
    document.documentElement.dataset.focus = focus ? "true" : "false";
  }, [focus]);

  if (!hydrated) {
    return <SplashScreen />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/*
        The chrome stands down inside a session. A question screen that also
        carries a brand bar and a product switcher spends a third of a 640px
        phone on things the answer does not need; the session's own header
        already offers the way out.
      */}
      {/*
        Also absent during first run: onboarding carries its own lockup and
        language control, and a track switcher above a screen that is asking
        you to pick a track offers the same choice twice with two answers.
      */}
      {focus || !onboarded ? null : (
        <header className="sticky top-0 z-20 border-b border-[#ddd6c8] bg-[#f3eee4]/92 backdrop-blur-md">
          {/*
            One row at 360px: glyph (22px) + three short track labels (~186px)
            + language (68px) fits the 328px gutter budget, where the full
            "KörkortGO by MZ" lockup (145px) did not. The wordmark returns from
            `sm` up, and the launcher, splash and store carry it regardless.
          */}
          <div className="app-header mx-auto flex max-w-5xl items-center justify-between gap-2 pb-3">
            <Link
              href="/"
              aria-label={brandLockup()}
              className="shrink-0 text-[1.15rem] text-[#1f3d2b]"
            >
              <BrandGlyph size={26} />
              <span className="sr-only sm:not-sr-only sm:ml-2 sm:inline-flex sm:align-middle">
                <BrandMark compact />
              </span>
            </Link>
            <div className="flex min-w-0 flex-1 justify-center rounded-full border border-[#ddd6c8] bg-white p-0.5 text-[11px] sm:flex-none sm:text-xs">
              {TRACKS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTrack(item)}
                  aria-pressed={track === item}
                  className={`min-h-9 min-w-0 flex-1 truncate rounded-full px-1.5 font-medium sm:flex-none sm:px-3 ${
                    track === item ? "bg-[#1f3d2b] text-white" : "text-[#1f3d2b]"
                  }`}
                >
                  <span className="sm:hidden">{trackShortLabel(item)}</span>
                  <span className="hidden sm:inline">{trackLabel(item)}</span>
                </button>
              ))}
            </div>
            <div className="flex shrink-0 rounded-full border border-[#ddd6c8] bg-white text-[11px] sm:text-xs">
              {(["sv", "fr"] as const).map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() => setLocale(locale)}
                  aria-pressed={state.profile.locale === locale}
                  className={`min-h-9 px-2.5 font-medium sm:px-3 ${
                    state.profile.locale === locale
                      ? "bg-[#1f3d2b] text-white first:rounded-l-full last:rounded-r-full"
                      : "text-[#1f3d2b]"
                  }`}
                >
                  {locale.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>
      )}

      <main
        className={`app-main page-enter mx-auto w-full max-w-5xl flex-1 pt-6 ${
          showNav ? "pb-[calc(var(--nav-h)+1rem)]" : "pb-10"
        }`}
      >
        {children}
      </main>

      {showNav ? (
        <nav className="app-nav fixed inset-x-0 bottom-0 z-20 border-t border-[#ddd6c8] bg-[#fffdf8]/96 backdrop-blur-md">
          {/*
            The licence reminder used to live here, on every screen, in 9px
            type — the one detail that made a paid product look unfinished.
            It belongs where a user acts on it: onboarding and Settings.
          */}
          <div
            className={`mx-auto grid max-w-5xl pt-1.5 ${
              track === "taxi" ? "grid-cols-6" : "grid-cols-5"
            }`}
          >
            {NAV.filter((item) => !item.taxiOnly || track === "taxi").map((item) => {
              const href =
                item.href === "/study" || item.href === "/exam"
                  ? `/${track}${item.href}`
                  : item.href;
              const active = pathname === href || (item.href !== "/" && pathname.startsWith(href));
              const Icon = item.Icon;
              return (
                <Link
                  key={item.key}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 text-[9px] transition min-[400px]:text-[10px] sm:text-[11px] ${
                    active
                      ? "font-semibold text-[#1f3d2b]"
                      : "text-[#6b6560] hover:text-[#1f3d2b]"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      active ? "bg-[#1f3d2b]/10" : ""
                    }`}
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" />
                  </span>
                  <span className="app-nav-label">{dict.nav[item.key]}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
