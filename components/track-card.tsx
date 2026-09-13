"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  BuildingIcon,
  ChatIcon,
  ChevronIcon,
  LayersIcon,
  SteeringIcon,
  TaxiIcon,
} from "@/components/nav-icons";

const ICONS = {
  b: SteeringIcon,
  taxi: TaxiIcon,
  owner: BuildingIcon,
  both: LayersIcon,
  chat: ChatIcon,
} as const;

export function TrackCard({
  title,
  description,
  icon,
  href,
  selected,
  muted,
  badge,
  onClick,
}: {
  title: string;
  description: string;
  icon: keyof typeof ICONS;
  href?: string;
  selected?: boolean;
  muted?: boolean;
  badge?: string;
  onClick?: () => void;
}) {
  const Icon = ICONS[icon];
  const body = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1f3d2b]/8 text-[#1f3d2b]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-serif text-xl text-black">{title}</span>
          {badge ? (
            <span className="rounded-full bg-[#ece6d8] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6b6560]">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-sm leading-5 text-[#6b6560]">{description}</span>
      </span>
      <ChevronIcon className="h-4 w-4 shrink-0 text-[#c4b8a4]" />
    </>
  );

  const className = `card flex items-center gap-3 text-left transition duration-200 ${
    selected ? "ring-2 ring-[#1f3d2b] ring-offset-2 ring-offset-[#f3eee4]" : ""
  } ${muted ? "opacity-70" : "hover:border-[#1f3d2b]/30 hover:shadow-[var(--shadow)]"}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {body as ReactNode}
      </button>
    );
  }

  return <div className={className}>{body}</div>;
}
