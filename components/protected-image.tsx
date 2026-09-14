"use client";

import { useEffect, useRef, useState } from "react";

type Status = "loading" | "ready" | "error";

function isSvgSrc(src: string) {
  return /\.svg(\?|$)/i.test(src);
}

export function ProtectedImage({
  src,
  alt,
  watermark,
  unavailableLabel,
  omitOnError = false,
  onError,
  onReady,
}: {
  src: string;
  alt: string;
  watermark: string;
  unavailableLabel: string;
  omitOnError?: boolean;
  onError?: () => void;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const onErrorRef = useRef(onError);
  const onReadyRef = useRef(onReady);
  onErrorRef.current = onError;
  onReadyRef.current = onReady;

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setSvgMarkup(null);

    if (isSvgSrc(src)) {
      void fetch(src, { credentials: "same-origin", cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) throw new Error("media");
          const text = await response.text();
          if (!text.includes("<svg")) throw new Error("empty");
          return text;
        })
        .then((text) => {
          if (cancelled) return;
          setSvgMarkup(text);
          setStatus("ready");
          onReadyRef.current?.();
        })
        .catch(() => {
          if (!cancelled) {
            setStatus("error");
            onErrorRef.current?.();
          }
        });
      return () => {
        cancelled = true;
      };
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      setStatus("error");
      onErrorRef.current?.();
      return;
    }

    let revoked: string | null = null;
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      const width = image.naturalWidth || 640;
      const height = image.naturalHeight || 360;
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#1f3d2b";
      ctx.font = `${Math.max(14, Math.round(width / 28))}px sans-serif`;
      ctx.translate(width * 0.12, height * 0.55);
      ctx.rotate(-0.28);
      ctx.fillText(watermark, 0, 0);
      ctx.restore();
      setStatus("ready");
      onReadyRef.current?.();
    };
    image.onerror = () => {
      if (!cancelled) {
        setStatus("error");
        onErrorRef.current?.();
      }
    };

    void fetch(src, { credentials: "same-origin", cache: "no-store" })
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error("media"))))
      .then((blob) => {
        if (cancelled) return;
        revoked = URL.createObjectURL(blob);
        image.src = revoked;
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          onErrorRef.current?.();
        }
      });

    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [src, watermark]);

  if (status === "error") {
    if (omitOnError) return null;
    return (
      <div className="flex min-h-24 items-center justify-center px-4 py-6 text-center text-sm text-[#6b6560]">
        {unavailableLabel}
      </div>
    );
  }

  if (isSvgSrc(src)) {
    return (
      <div className="relative">
        {status === "loading" ? (
          <div className="h-40 animate-pulse rounded-xl bg-[#efe8d8]" aria-hidden />
        ) : null}
        {svgMarkup ? (
          <div
            role="img"
            aria-label={alt}
            className="mx-auto max-h-64 w-full overflow-hidden [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-h-64 [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        ) : null}
        {status === "ready" ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 bottom-8 rotate-[-12deg] text-center text-sm font-medium text-[#1f3d2b]/25"
          >
            {watermark}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative">
      {status === "loading" ? (
        <div className="h-40 animate-pulse rounded-xl bg-[#efe8d8]" aria-hidden />
      ) : null}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        aria-busy={status === "loading"}
        className={`mx-auto w-full object-contain ${
          status === "ready" ? "opacity-100" : "h-40 opacity-0"
        }`}
        style={status === "ready" ? { maxHeight: "min(70vh, 40rem)" } : undefined}
      />
    </div>
  );
}
