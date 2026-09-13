import type { ReactNode } from "react";

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className ?? "h-5 w-5"}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </Svg>
  );
}

export function StudyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h5" />
    </Svg>
  );
}

export function ExamIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </Svg>
  );
}

export function CalculIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0" />
    </Svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 17.5 4 21l3.8-1.4A8.5 8.5 0 1 0 5 17.5z" />
    </Svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.8 7.2l1.9 1.1M17.3 15.7l1.9 1.1M4.8 16.8l1.9-1.1M17.3 8.3l1.9-1.1" />
    </Svg>
  );
}

export function SteeringIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 5.6v4.2M6.2 14.6 9.7 13M17.8 14.6 14.3 13" />
    </Svg>
  );
}

export function TaxiIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 14h16l-1.2-5.2A2 2 0 0 0 16.9 7H7.1a2 2 0 0 0-1.9 1.8z" />
      <path d="M7 7 8.1 4.8A1 1 0 0 1 9 4.2h6a1 1 0 0 1 .9.6L17 7" />
      <circle cx="7.5" cy="16.5" r="1.4" />
      <circle cx="16.5" cy="16.5" r="1.4" />
    </Svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6M9 10h.01M12 10h.01M15 10h.01M9 14h.01M15 14h.01" />
    </Svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 3 8 4.5-8 4.5-8-4.5z" />
      <path d="m4 12.5 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />
    </Svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  );
}
