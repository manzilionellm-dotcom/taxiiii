/**
 * Single source of truth for user-facing brand copy.
 * Change names, slogans, and category labels here — not in UI screens.
 */
export const BRAND = {
  appName: "KörkortGO",
  signature: "by MZ",
  slogan: "Förstå teorin. Klara provet.",
  keyMessage: "Lär dig på svenska. Förstå på ditt språk.",
  native: {
    appId: "se.mz.korkortgo",
    /** Play Store / Android launcher label. Web UI keeps `appName` + `signature`. */
    displayName: "KörkortGO by MZ",
    /** Public production host. Override with CAPACITOR_SERVER_URL when building the APK. */
    serverUrl: "https://taxiiii.vercel.app",
  },
  tracks: {
    b: {
      id: "b" as const,
      label: "Körkort",
      /** Header switcher label — must clear three labels inside 360px. */
      short: "Körkort",
      product: "permis B / teoriprov B",
    },
    taxi: {
      id: "taxi" as const,
      label: "Taxi",
      short: "Taxi",
      product: "taxiförarlegitimation",
    },
    owner: {
      id: "owner" as const,
      label: "Taxi Företag",
      short: "Företag",
      product: "taxitrafiktillstånd / taxiägare",
    },
  },
} as const;

export type BrandTrackKey = keyof typeof BRAND.tracks;

export function trackLabel(track: BrandTrackKey) {
  return BRAND.tracks[track].label;
}

export function trackShortLabel(track: BrandTrackKey) {
  return BRAND.tracks[track].short;
}

export function trackProduct(track: BrandTrackKey) {
  return BRAND.tracks[track].product;
}

export function brandLockup() {
  return `${BRAND.appName} ${BRAND.signature}`;
}

export function documentTitle() {
  return `${BRAND.appName} — ${BRAND.slogan}`;
}

export function documentDescription() {
  return `${BRAND.keyMessage} ${BRAND.slogan}`;
}
