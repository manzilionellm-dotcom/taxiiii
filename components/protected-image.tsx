"use client";

import { useEffect, useRef, useState } from "react";

type Status = "loading" | "ready" | "error";

export function ProtectedImage({
  src,
  alt,
  watermark,
  unavailableLabel,
}: {
  src: string;
  alt: string;
  watermark: string;
  unavailableLabel: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let revoked: string | null = null;
    let keepBlob = false;
    setStatus("loading");
    setFallbackSrc(null);

    const showFallback = (url: string) => {
      if (cancelled) return;
      keepBlob = true;
      setFallbackSrc(url);
      setStatus("ready");
    };

    const paint = (image: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      const width = image.naturalWidth || 640;
      const height = image.naturalHeight || 360;
      if (!width || !height) return false;
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
      return true;
    };

    void fetch(src, { credentials: "same-origin", cache: "no-store" })
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error("media"))))
      .then((blob) => {
        if (cancelled) return;
        revoked = URL.createObjectURL(blob);
        const image = new Image();
        image.onload = () => {
          if (cancelled) return;
          if (paint(image)) {
            setStatus("ready");
            return;
          }
          showFallback(revoked as string);
        };
        image.onerror = () => showFallback(revoked as string);
        image.src = revoked;
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      if (revoked && !keepBlob) URL.revokeObjectURL(revoked);
    };
  }, [src, watermark]);

  if (status === "error") {
    return (
      <div className="flex min-h-24 items-center justify-center px-4 py-6 text-center text-sm text-[#6b6560]">
        {unavailableLabel}
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
        className={`mx-auto max-h-64 w-full object-contain ${
          fallbackSrc || status !== "ready" ? "hidden" : "block"
        }`}
      />
      {fallbackSrc ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fallbackSrc} alt={alt} className="mx-auto max-h-64 w-full object-contain" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 bottom-8 rotate-[-12deg] text-center text-sm font-medium text-[#1f3d2b]/25"
          >
            {watermark}
          </span>
        </div>
      ) : null}
    </div>
  );
}
