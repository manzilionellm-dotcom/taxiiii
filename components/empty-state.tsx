"use client";

import Link from "next/link";
import { BrandGlyph } from "@/components/brand-mark";

export function EmptyState({
  title,
  lead,
  actionHref,
  actionLabel,
  onAction,
}: {
  title: string;
  lead?: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="card page-enter mx-auto max-w-md space-y-4 px-6 py-10 text-center">
      <div className="mx-auto flex justify-center opacity-90">
        <BrandGlyph size={40} />
      </div>
      <h1 className="font-serif text-2xl text-black">{title}</h1>
      {lead ? <p className="text-sm leading-6 text-[#6b6560]">{lead}</p> : null}
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn-primary mx-auto min-w-40">
          {actionLabel}
        </Link>
      ) : null}
      {onAction && actionLabel && !actionHref ? (
        <button type="button" className="btn-primary mx-auto min-w-40" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
