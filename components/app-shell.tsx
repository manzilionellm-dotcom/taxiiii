"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { useAppState } from "@/components/app-state";
import {
  CalculIcon,
  ChatIcon,
  ExamIcon,
  HomeIcon,
  SettingsIcon,
  StudyIcon,
} from "@/components/nav-icons";
import { SplashScreen } from "@/components/splash-screen";
import { trackLabel } from "@/lib/branding";
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
  const dict = t(state.profile.locale);
  const track = state.profile.activeTrack;
  const onboarded = hydrated && state.profile.onboarded;

  function setLocale(locale: Locale) {
    setState(updateProfile(state, { locale }));
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

  if (!hydrated) {
    return <SplashScreen />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-[#ddd6c8] bg-[#f3eee4]/92 backdrop-blur-md">
        {/*
          360px budget: brand lockup (145px) + language toggle (68px) fit one
          row, the three track labels do not. So the track switcher takes its
          own full-width row on phones and rejoins the top row from `sm` up.
        */}
        <div className="app-header mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-2 gap-y-2 pb-3">
          <Link href="/" className="order-1 min-w-0 text-[1.15rem] text-[#1f3d2b]">
            <BrandMark compact glyph />
          </Link>
          <div className="order-3 flex w-full rounded-full border border-[#ddd6c8] bg-white p-0.5 text-[11px] sm:order-2 sm:w-auto sm:text-xs">
            {TRACKS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTrack(item)}
                aria-pressed={track === item}
                className={`min-h-9 min-w-0 flex-1 truncate rounded-full px-2 font-medium sm:flex-none sm:px-3 ${
                  track === item ? "bg-[#1f3d2b] text-white" : "text-[#1f3d2b]"
                }`}
              >
                {trackLabel(item)}
              </button>
            ))}
          </div>
          <div className="order-2 flex shrink-0 rounded-full border border-[#ddd6c8] bg-white text-[11px] sm:order-3 sm:text-xs">
            {(["sv", "fr"] as const).map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => setLocale(locale)}
                aria-pressed={state.profile.locale === locale}
                className={`min-h-9 px-3 font-medium ${
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

      <main
        className={`app-main page-enter mx-auto w-full max-w-5xl flex-1 pt-6 ${
          onboarded ? "pb-[calc(7.5rem+var(--safe-bottom))]" : "pb-10"
        }`}
      >
        {children}
      </main>

      {onboarded ? (
        <nav className="app-nav fixed inset-x-0 bottom-0 z-20 border-t border-[#ddd6c8] bg-[#fffdf8]/96 backdrop-blur-md">
          <p className="mx-auto max-w-5xl px-3 pt-1.5 text-center text-[9px] leading-3 tracking-wide text-[#8a8276]">
            {dict.tosAccept}
          </p>
          <div
            className={`mx-auto grid max-w-5xl pt-1 ${
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
                  <span className="app-nav-label">{dict[item.key]}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
