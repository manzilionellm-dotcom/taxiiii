"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/components/app-state";
import { t } from "@/lib/i18n";
import { updateProfile } from "@/lib/progress/store";
import type { Locale, Track } from "@/lib/types";

const NAV = [
  { href: "/", key: "home" as const },
  { href: "/study", key: "study" as const },
  { href: "/exam", key: "exam" as const },
  { href: "/taxi/calcul", key: "calcul" as const, taxiOnly: true },
  { href: "/chat", key: "chat" as const },
  { href: "/settings", key: "settings" as const },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, setState, hydrated } = useAppState();
  const dict = t(state.profile.locale);
  const track = state.profile.activeTrack;

  function setLocale(locale: Locale) {
    setState(updateProfile(state, { locale }));
  }

  function setTrack(next: Track) {
    setState(updateProfile(state, { activeTrack: next }));
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-[#ddd6c8] bg-[#f4efe4]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="font-serif text-xl tracking-tight text-[#1f3d2b]">
            {dict.brand}
          </Link>
          <div className="flex items-center gap-2">
            {hydrated && state.profile.tracks.length > 1 ? (
              <div className="hidden rounded-full border border-[#ddd6c8] bg-white p-0.5 text-xs sm:flex">
                {state.profile.tracks.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTrack(item)}
                    className={`rounded-full px-3 py-1 ${
                      track === item ? "bg-[#1f3d2b] text-white" : "text-[#1f3d2b]"
                    }`}
                  >
                    {item === "b" ? dict.trackB : dict.trackTaxi}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="flex rounded-full border border-[#ddd6c8] bg-white text-xs">
              {(["sv", "fr"] as const).map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() => setLocale(locale)}
                  className={`px-2.5 py-1 ${
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#ddd6c8] bg-[#fffdf8]/95 backdrop-blur">
        <p className="mx-auto max-w-5xl px-3 pt-1 text-center text-[10px] leading-3 text-[#8a8276]">
          {dict.tosAccept}
        </p>
        <div className="mx-auto grid max-w-5xl grid-cols-5 px-1 py-2 text-[11px] sm:grid-cols-6">
          {NAV.filter((item) => !item.taxiOnly || track === "taxi").map((item) => {
            const href =
              item.href === "/study" || item.href === "/exam"
                ? `/${track}${item.href}`
                : item.href;
            const active = pathname === href || (item.href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={item.key}
                href={href}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-1 py-1 ${
                  active ? "text-[#1f3d2b] font-semibold" : "text-[#6b6560]"
                }`}
              >
                {dict[item.key]}
              </Link>
            );
          })}
          <Link
            href="/owner"
            className="hidden flex-col items-center gap-0.5 px-1 py-1 text-[#9a9388] sm:flex"
          >
            {dict.trackOwner}
          </Link>
        </div>
      </nav>
    </div>
  );
}
