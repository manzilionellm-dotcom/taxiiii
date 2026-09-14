import { TRACKS, type Profile, type Track } from "@/lib/types";

export function isTrack(value: unknown): value is Track {
  return (TRACKS as readonly string[]).includes(value as string);
}

/** Additive union: product tracks first, then any extra valid tracks. Never drops a valid active track. */
export function mergeProductTracks(tracks: unknown, activeTrack?: unknown): Track[] {
  const existing = Array.isArray(tracks) ? tracks.filter(isTrack) : [];
  const merged: Track[] = [];
  for (const track of TRACKS) {
    if (!merged.includes(track)) merged.push(track);
  }
  for (const track of existing) {
    if (!merged.includes(track)) merged.push(track);
  }
  if (isTrack(activeTrack) && !merged.includes(activeTrack)) {
    merged.push(activeTrack);
  }
  return merged;
}

export function ensureOnboardedTracks(profile: Profile): Profile {
  if (!profile.onboarded) return profile;
  const tracks = mergeProductTracks(profile.tracks, profile.activeTrack);
  const activeTrack = isTrack(profile.activeTrack) ? profile.activeTrack : tracks[0];
  return { ...profile, tracks, activeTrack };
}
