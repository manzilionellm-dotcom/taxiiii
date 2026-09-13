"use client";

import { useEffect, useRef } from "react";

export function ProtectedImage({
  src,
  alt,
  watermark,
}: {
  src: string;
  alt: string;
  watermark: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let revoked: string | null = null;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const width = image.naturalWidth || 640;
      const height = image.naturalHeight || 360;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#1f3d2b";
      ctx.font = `${Math.max(14, Math.round(width / 28))}px sans-serif`;
      ctx.translate(width * 0.12, height * 0.55);
      ctx.rotate(-0.28);
      ctx.fillText(watermark, 0, 0);
      ctx.restore();
      if (revoked) URL.revokeObjectURL(revoked);
    };
    void fetch(src, { credentials: "same-origin", cache: "no-store" })
      .then((response) => (response.ok ? response.blob() : Promise.reject()))
      .then((blob) => {
        revoked = URL.createObjectURL(blob);
        image.src = revoked;
      })
      .catch(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [src, watermark]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className="mx-auto max-h-64 w-full object-contain"
    />
  );
}
