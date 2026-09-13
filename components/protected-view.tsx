"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const CAPTURE_WINDOW_MS = 60_000;
const CAPTURE_WARN = 3;

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable
  );
}

export function ProtectedView({
  children,
  locale,
  exam,
}: {
  children: ReactNode;
  locale: Locale;
  exam?: boolean;
}) {
  const dict = t(locale);
  const [hidden, setHidden] = useState(false);
  const [warning, setWarning] = useState(false);
  const [canResume, setCanResume] = useState(true);
  const stamps = useRef<number[]>([]);

  useEffect(() => {
    const obscure = (reason: "blur" | "capture" = "blur") => {
      setHidden(true);
      if (exam) setCanResume(false);
      const now = Date.now();
      stamps.current = [...stamps.current.filter((at) => now - at < CAPTURE_WINDOW_MS), now];
      if (stamps.current.length >= CAPTURE_WARN) setWarning(true);
      void reason;
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") obscure();
    };
    const onBlur = () => obscure();
    const onPrint = (event: Event) => {
      event.preventDefault();
      obscure("capture");
    };
    const onContext = (event: MouseEvent) => {
      if (isEditable(event.target)) return;
      event.preventDefault();
    };
    const onCopy = (event: ClipboardEvent) => {
      if (isEditable(event.target)) return;
      event.preventDefault();
    };
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const combo = event.ctrlKey || event.metaKey;
      if (event.key === "PrintScreen") {
        event.preventDefault();
        obscure("capture");
        return;
      }
      if (isEditable(event.target) && key !== "p") return;
      if (event.key === "F12") {
        event.preventDefault();
        return;
      }
      if (combo && ["c", "a", "u", "s", "p", "x"].includes(key)) {
        event.preventDefault();
      }
      if (combo && event.shiftKey && ["i", "j", "c"].includes(key)) {
        event.preventDefault();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("beforeprint", onPrint);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCopy);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("beforeprint", onPrint);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCopy);
      document.removeEventListener("keydown", onKey);
    };
  }, [exam]);

  useEffect(() => {
    if (!hidden || !exam) return;
    const timer = window.setTimeout(() => setCanResume(true), 800);
    return () => window.clearTimeout(timer);
  }, [hidden, exam]);

  return (
    <div className="protected-content relative">
      {warning ? (
        <p className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {dict.captureWarning}
        </p>
      ) : null}
      <div className={hidden ? "pointer-events-none select-none blur-xl opacity-20" : undefined}>
        {children}
      </div>
      {hidden ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-[#141414]/92 p-6 text-center">
          <div className="max-w-sm space-y-3 text-[#fffdf8]">
            <p className="font-serif text-2xl">{dict.contentHidden}</p>
            <p className="text-sm text-[#d7d0c3]">{dict.protectionNote}</p>
            <button
              type="button"
              className="btn-primary disabled:opacity-50"
              disabled={exam && !canResume}
              onClick={() => {
                if (exam && !canResume) return;
                setHidden(false);
              }}
            >
              {exam ? dict.resumeExam : dict.continue}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
