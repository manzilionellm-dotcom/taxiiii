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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    let revoked: string | null = null;
    setStatus("loading");

    const image = new Image();
    image.crossOrigin = "anonymous";
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
      if (revoked) URL.revokeObjectURL(revoked);
    };
    image.onerror = () => {
      if (!cancelled) setStatus("error");
    };

    void fetch(src, { credentials: "same-origin", cache: "no-store" })
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error("media"))))
      .then((blob) => {
        if (cancelled) return;
        revoked = URL.createObjectURL(blob);
        image.src = revoked;
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
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
        <div
          className="absolute inset-0 animate-pulse rounded-xl bg-[#efe8d8]"
          aria-hidden
        />
      ) : null}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        aria-busy={status === "loading"}
        className={`mx-auto max-h-64 w-full object-contain ${
          status === "ready" ? "opacity-100" : "h-40 opacity-0"
        }`}
      />
    </div>
  );
}
