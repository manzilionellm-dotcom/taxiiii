"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Status at a glance: three numbers on one row, big enough to read at arm's
 * length, small enough that they never push the hero's action off screen.
 * A tile with an href becomes the tap target for the thing it measures.
 */
export function StatTiles({ children }: { children: ReactNode }) {
  return <section className="stat-tiles">{children}</section>;
}

export function StatTile({
  label,
  value,
  suffix,
  href,
  tone = "plain",
}: {
  label: string;
  value: string;
  suffix?: string;
  href?: string;
  tone?: "plain" | "accent";
}) {
  const body = (
    <>
      <span className="stat-tile-value">
        {value}
        {suffix ? <span className="stat-tile-suffix">{suffix}</span> : null}
      </span>
      <span className="stat-tile-label">{label}</span>
    </>
  );
  const className = `stat-tile${tone === "accent" ? " stat-tile-accent" : ""}`;
  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}
