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

/** Option rows ignore the tap that just opened a word/passage chip. */
let glossHoldArmed = false;
export function markGlossHold() {
  glossHoldArmed = true;
}
export function glossHoldConsumed() {
  return glossHoldArmed;
}
export function clearGlossHold() {
  glossHoldArmed = false;
}

export type GlossKind = "word" | "passage";

export type GlossSurface = {
  surface: string;
  lemma: string;
  fr: string | null;
  phonetic?: string;
  kind: GlossKind;
};

type OpenGloss = GlossSurface & {
  id: string;
  top: number;
  left: number;
  above: boolean;
  width: number;
  viaPhrase?: boolean;
};

export type GlossOpenExtra = {
  fr?: string | null;
  lemma?: string;
  kind?: GlossKind;
  viaPhrase?: boolean;
};

type GlossaryApi = {
  open: (token: string, anchor: HTMLElement | null, extra?: GlossOpenExtra) => void;
  close: () => void;
  activeToken: string | null;
  hint: string;
};

const GlossaryContext = createContext<GlossaryApi | null>(null);
const PhraseFrContext = createContext<string | null>(null);

function placeChip(rect: DOMRect, preferAbove = false, kind: GlossKind = "word") {
  const width =
    kind === "passage"
      ? Math.min(420, Math.max(240, window.innerWidth - 32))
      : Math.min(280, Math.max(188, window.innerWidth - 32));
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
    (token: string, anchor: HTMLElement | null, extra?: GlossOpenExtra) => {
      if (!anchor) return;
      const kind: GlossKind = extra?.kind ?? "word";
      if (kind === "word" && !shouldOfferGloss(token)) return;
      const hit: GlossHit | null = kind === "word" ? lookupGloss(token) : null;
      const rect = anchor.getBoundingClientRect();
      const preferAbove = Boolean(anchor.closest(".question-sv, .cloze-box, [data-gloss-passage]"));
      const pos = placeChip(rect, preferAbove, kind);
      const lemma = extra?.lemma || hit?.lemma || token;
      const fr = extra && "fr" in extra ? extra.fr ?? null : hit?.fr ?? null;
      const surface = kind === "passage" ? `passage:${lemma}` : token;
      const next: OpenGloss = {
        id: `${surface}-${Math.round(rect.left)}-${Math.round(rect.top)}`,
        surface,
        lemma,
        fr,
        phonetic: hit?.phonetic,
        kind,
        viaPhrase: extra?.viaPhrase,
        top: pos.top,
        left: pos.left,
        above: pos.above,
        width: pos.width,
      };
      const alreadyOpen = openState?.surface === surface;
      setOpenState(next);
      setLive(fr ? `${lemma}: ${fr}` : `${lemma}. ${dict.glossEmpty}`);
      if (!alreadyOpen) void tickGlossHaptic();
    },
    [dict.glossEmpty, openState?.surface],
  );

  useEffect(() => {
    if (!openState) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-gloss-root], [data-gloss-passage], [data-gloss-word]")
      ) {
        return;
      }
      close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
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
  const found = Boolean(gloss.fr?.trim());
  return (
    <div
      data-gloss-root
      role="tooltip"
      id={labelId}
      className="gloss-chip"
      data-kind={gloss.kind}
      data-placement={gloss.above ? "above" : "below"}
      style={{ top: gloss.top, left: gloss.left, width: gloss.width }}
    >
      <p className="gloss-chip-sv">{gloss.lemma}</p>
      {found ? (
        <>
          {gloss.viaPhrase ? (
            <p className="gloss-chip-ipa">{dict.glossInPhrase}</p>
          ) : null}
          <p className="gloss-chip-fr">{gloss.fr}</p>
        </>
      ) : (
        <p className="gloss-chip-empty">{dict.translationSoon}</p>
      )}
      {gloss.phonetic ? <p className="gloss-chip-ipa">{gloss.phonetic}</p> : null}
      <button type="button" className="sr-only" onClick={onClose}>
        {dict.glossClose}
      </button>
    </div>
  );
}

function useHoldTimer(fire: () => void) {
  const timer = useRef<number>(0);
  const start = useRef({ x: 0, y: 0 });
  const fired = useRef(false);
  const moved = useRef(false);

  const clearHold = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = 0;
  };

  const arm = (x: number, y: number) => {
    fired.current = false;
    moved.current = false;
    start.current = { x, y };
    clearHold();
    timer.current = window.setTimeout(() => {
      if (fired.current) return;
      fired.current = true;
      clearHold();
      markGlossHold();
      fire();
    }, GLOSS_HOLD_MS);
  };

  const onMove = (x: number, y: number) => {
    if (!timer.current && !fired.current) return;
    if (Math.hypot(x - start.current.x, y - start.current.y) > MOVE_CANCEL_PX) {
      moved.current = true;
      clearHold();
    }
  };

  return { timer, fired, moved, clearHold, arm, onMove };
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
  const phraseFr = useContext(PhraseFrContext);
  const ref = useRef<HTMLSpanElement>(null);
  const hold = useHoldTimer(() => {
    const hit = lookupGloss(text);
    if (hit?.fr) {
      open(text, ref.current);
      return;
    }
    if (phraseFr?.trim()) {
      open(text, ref.current, { fr: phraseFr, lemma: text, viaPhrase: true });
      return;
    }
    open(text, ref.current);
  });

  if (!shouldOfferGloss(text)) {
    return <span>{text}</span>;
  }
  if (variant === "option") {
    return <span className={`gloss-word gloss-word-${variant}`}>{text}</span>;
  }

  const isOpen = activeToken === text;

  return (
    <span
      ref={ref}
      data-gloss-word
      data-gloss-variant={variant}
      data-open={isOpen ? "true" : "false"}
      className={`gloss-word gloss-word-${variant}`}
      aria-label={`${text}. ${hint}`}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        hold.arm(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => hold.onMove(event.clientX, event.clientY)}
      onPointerUp={(event) => {
        const wasHold = hold.fired.current;
        hold.clearHold();
        if (wasHold) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onPointerCancel={hold.clearHold}
      onClick={(event) => {
        if (hold.fired.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      {text}
    </span>
  );
}

/** Tap the block → full FR stays. Long-press a word → that word. */
export function GlossablePassage({
  label,
  fr,
  hint,
  children,
  className,
  activate = "tap",
  defaultOpen = false,
}: {
  label: string;
  fr?: string | null;
  hint: string;
  children: ReactNode;
  className?: string;
  activate?: "tap" | "hold";
  defaultOpen?: boolean;
}) {
  const { open } = useGlossary();
  const ref = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(defaultOpen);
  const french = (fr ?? "").trim();

  const reveal = () => {
    setPinned(true);
    open(label, ref.current, { fr: french || null, lemma: label, kind: "passage" });
  };

  const hold = useHoldTimer(reveal);

  return (
    <PhraseFrContext.Provider value={french || null}>
      <div
        ref={ref}
        data-gloss-passage
        data-open={pinned ? "true" : "false"}
        className={`gloss-passage ${className ?? ""}`}
        aria-label={hint}
        onContextMenu={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          if (activate === "hold") hold.arm(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => hold.onMove(event.clientX, event.clientY)}
        onPointerUp={(event) => {
          const wasHold = hold.fired.current;
          hold.clearHold();
          if (wasHold) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onPointerCancel={hold.clearHold}
        onClick={(event) => {
          if (hold.fired.current || glossHoldConsumed()) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          const target = event.target;
          if (
            target instanceof Element &&
            target.closest("button, input, select, textarea, label")
          ) {
            return;
          }
          if (activate === "tap") {
            event.preventDefault();
            setPinned(true);
          }
        }}
      >
        {children}
        <button
          type="button"
          className="mt-1 min-h-11 w-full text-left text-sm font-semibold text-[#b91c1c]"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setPinned((value) => !value);
          }}
        >
          {pinned ? "Masquer la traduction" : hint}
        </button>
        {pinned ? (
          french ? (
            <p className="question-fr-premium mt-1 whitespace-pre-wrap text-[1.02rem] leading-7">
              {french}
            </p>
          ) : (
            <p className="gloss-chip-empty mt-1">Pas encore de traduction pour ce paragraphe.</p>
          )
        ) : null}
      </div>
    </PhraseFrContext.Provider>
  );
}

export { GLOSS_HOLD_MS };
