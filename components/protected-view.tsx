"use client";

import { useEffect, type ReactNode } from "react";
import type { Locale } from "@/lib/types";

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
}: {
  children: ReactNode;
  locale: Locale;
  exam?: boolean;
}) {
  useEffect(() => {
    const onPrint = (event: Event) => {
      event.preventDefault();
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

    window.addEventListener("beforeprint", onPrint);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCopy);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("beforeprint", onPrint);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCopy);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return <div className="protected-content relative">{children}</div>;
}
