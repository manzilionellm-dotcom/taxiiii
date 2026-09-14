"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  GLOSS_HOLD_MS,
  lookupGloss,
  shouldOfferGloss,
  splitGlossPieces,
  type GlossHit,
} from "@/lib/glossary";
import { tickGlossHaptic } from "@/lib/haptics";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const MOVE_CANCEL_PX = 10;

export type GlossSurface = {
  surface: string;
  lemma: string;
  fr: string | null;
  phonetic?: string;
};

type OpenGloss = GlossSurface & {
  id: string;
  top: number;
  left: number;
  above: boolean;
};

type GlossaryApi = {
  open: (token: string, anchor: HTMLElement | null) => void;
  close: () => void;
  activeToken: string | null;
  hint: string;
};

const GlossaryContext = createContext<GlossaryApi | null>(null);

function placeChip(rect: DOMRect, preferAbove = false) {
  const width = Math.min(280, Math.max(188, window.innerWidth - 32));
  const left = Math.min(
    Math.max(16, rect.left + rect.width / 2 - width / 2),
    window.innerWidth - width - 16,
  );
  const spaceBelow = window.innerHeight - rect.bottom;
  const above = preferAbove
    ? rect.top > 132
    : spaceBelow < 132 && rect.top > 140;
  const top = above ? rect.top - 14 : rect.bottom + 14;
  return { top, left, width, above };
}

export function GlossaryProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const dict = t(locale);
  const [openState, setOpenState] = useState<OpenGloss | null>(null);
  const [live, setLive] = useState("");

  const close = useCallback(() => {
    setOpenState(null);
    setLive("");
  }, []);

  const open = useCallback(
    (token: string, anchor: HTMLElement | null) => {
      if (!shouldOfferGloss(token) || !anchor) return;
      const hit: GlossHit | null = lookupGloss(token);
      const rect = anchor.getBoundingClientRect();
      const preferAbove = Boolean(anchor.closest(".question-sv, .cloze-box"));
      const pos = placeChip(rect, preferAbove);
      const next: OpenGloss = {
        id: `${token}-${Math.round(rect.left)}-${Math.round(rect.top)}`,
        surface: token,
        lemma: hit?.lemma || token,
        fr: hit?.fr ?? null,
        phonetic: hit?.phonetic,
        top: pos.top,
        left: pos.left,
        above: pos.above,
      };
      const alreadyOpen = openState?.surface === token;
      setOpenState(next);
      setLive(hit?.fr ? `${next.lemma}: ${hit.fr}` : `${next.lemma}. ${dict.glossEmpty}`);
      if (!alreadyOpen) void tickGlossHaptic();
    },
    [dict.glossEmpty, openState?.surface],
  );

  useEffect(() => {
    if (!openState) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onScroll = () => close();
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-gloss-root]")) return;
      close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [close, openState]);

  return (
    <GlossaryContext.Provider
      value={{ open, close, activeToken: openState?.surface ?? null, hint: dict.glossHint }}
    >
      {children}
      <span className="sr-only" aria-live="polite">
        {live}
      </span>
      {openState && typeof document !== "undefined"
        ? createPortal(
            <GlossChip
              locale={locale}
              gloss={openState}
              onClose={close}
            />,
            document.body,
          )
        : null}
    </GlossaryContext.Provider>
  );
}

function useGlossary() {
  const ctx = useContext(GlossaryContext);
  if (!ctx) throw new Error("GlossaryProvider missing");
  return ctx;
}

function GlossChip({
  locale,
  gloss,
  onClose,
}: {
  locale: Locale;
  gloss: OpenGloss;
  onClose: () => void;
}) {
  const dict = t(locale);
  const labelId = useId();
  const found = Boolean(gloss.fr);
  return (
    <div
      data-gloss-root
      role="tooltip"
      id={labelId}
      className="gloss-chip"
      data-placement={gloss.above ? "above" : "below"}
      style={{ top: gloss.top, left: gloss.left, width: "max-content" }}
    >
      <p className="gloss-chip-sv">{gloss.lemma}</p>
      {found ? (
        <p className="gloss-chip-fr">{gloss.fr}</p>
      ) : (
        <p className="gloss-chip-empty">{dict.glossEmpty}</p>
      )}
      {gloss.phonetic ? <p className="gloss-chip-ipa">{gloss.phonetic}</p> : null}
      <button type="button" className="sr-only" onClick={onClose}>
        {dict.glossClose}
      </button>
    </div>
  );
}

export function GlossableText({
  text,
  variant = "stem",
  className,
}: {
  text: string;
  variant?: "stem" | "option" | "cloze";
  className?: string;
}) {
  const pieces = splitGlossPieces(text);
  return (
    <span className={className}>
      {pieces.map((piece, index) =>
        piece.word ? (
          <GlossableWord key={`${piece.text}-${index}`} text={piece.text} variant={variant} />
        ) : (
          <span key={`${piece.text}-${index}`}>{piece.text}</span>
        ),
      )}
    </span>
  );
}

export function GlossableWord({
  text,
  variant = "stem",
}: {
  text: string;
  variant?: "stem" | "option" | "cloze";
}) {
  const { open, activeToken, hint } = useGlossary();
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<number>(0);
  const start = useRef({ x: 0, y: 0 });
  const fired = useRef(false);
  const moved = useRef(false);
  const allowMouseClick = variant !== "option";

  const clearHold = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = 0;
  };

  const fire = () => {
    if (fired.current) return;
    fired.current = true;
    clearHold();
    open(text, ref.current);
  };

  if (!shouldOfferGloss(text)) {
    return <span>{text}</span>;
  }

  const isOpen = activeToken === text;

  return (
    <span
      ref={ref}
      data-gloss-word
      data-gloss-variant={variant}
      data-open={isOpen ? "true" : "false"}
      role="button"
      tabIndex={0}
      className={`gloss-word gloss-word-${variant}`}
      aria-label={`${text}. ${hint}`}
      aria-haspopup="true"
      aria-expanded={isOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          fire();
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        fired.current = false;
        moved.current = false;
        start.current = { x: event.clientX, y: event.clientY };
        clearHold();
        timer.current = window.setTimeout(() => {
          fire();
        }, GLOSS_HOLD_MS);
      }}
      onPointerMove={(event) => {
        if (!timer.current && !fired.current) return;
        const dx = event.clientX - start.current.x;
        const dy = event.clientY - start.current.y;
        if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) {
          moved.current = true;
          clearHold();
        }
      }}
      onPointerUp={(event) => {
        const wasHold = fired.current;
        clearHold();
        if (wasHold) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (
          allowMouseClick &&
          !moved.current &&
          event.button === 0 &&
          event.pointerType !== "touch"
        ) {
          event.preventDefault();
          event.stopPropagation();
          fire();
        }
      }}
      onPointerCancel={clearHold}
      onClick={(event) => {
        if (variant === "option") {
          if (fired.current) {
            event.preventDefault();
            event.stopPropagation();
          }
          return;
        }
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {text}
    </span>
  );
}
