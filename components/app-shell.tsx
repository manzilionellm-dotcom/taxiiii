"use client";

import type { ReactNode } from "react";
import Link from "next/link";
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
import type { Locale, Track } from "@/lib/types";

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
    setState(updateProfile(state, { activeTrack: next }));
  }

  if (!hydrated) {
    return <SplashScreen />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-[#ddd6c8] bg-[#f3eee4]/92 backdrop-blur-md">
        <div className="app-header mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 pb-3">
          <Link href="/" className="text-[1.15rem] text-[#1f3d2b]">
            <BrandMark compact glyph />
          </Link>
          <div className="flex items-center gap-2">
            {state.profile.tracks.length > 1 ? (
              <div className="flex rounded-full border border-[#ddd6c8] bg-white p-0.5 text-[10px] sm:text-xs">
                {state.profile.tracks.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTrack(item)}
                    className={`rounded-full px-2.5 py-1 font-medium sm:px-3 ${
                      track === item ? "bg-[#1f3d2b] text-white" : "text-[#1f3d2b]"
                    }`}
                  >
                    {trackLabel(item)}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="flex rounded-full border border-[#ddd6c8] bg-white text-[10px] sm:text-xs">
              {(["sv", "fr"] as const).map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() => setLocale(locale)}
                  className={`px-2.5 py-1 font-medium ${
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
        </div>
      </header>

      <main
        className={`page-enter mx-auto w-full max-w-5xl flex-1 px-4 pt-6 ${
          onboarded ? "pb-[calc(6.25rem+var(--safe-bottom))]" : "pb-10"
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
            className={`mx-auto grid max-w-5xl px-1 pt-1 ${
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
                  className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] leading-3 transition ${
                    active
                      ? "font-semibold text-[#1f3d2b]"
                      : "text-[#6b6560] hover:text-[#1f3d2b]"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      active ? "bg-[#1f3d2b]/10" : ""
                    }`}
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" />
                  </span>
                  {dict[item.key]}
                </Link>
              );
            })}
            <Link
              href="/owner"
              className="hidden min-h-12 flex-col items-center justify-center gap-0.5 px-1 py-1 text-[10px] text-[#9a9388] sm:flex"
            >
              {trackLabel("owner")}
            </Link>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
