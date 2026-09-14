#!/usr/bin/env node
/**
 * Contract for lib/progress/tracks.ts — onboarded profiles always get
 * Körkort + Taxi + Taxi Företag without dropping activeTrack or progress.
 */
const TRACKS = ["b", "taxi", "owner"];

function isTrack(value) {
  return TRACKS.includes(value);
}

function mergeProductTracks(tracks, activeTrack) {
  const existing = Array.isArray(tracks) ? tracks.filter(isTrack) : [];
  const merged = [];
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

function ensureOnboardedTracks(profile) {
  if (!profile.onboarded) return profile;
  const tracks = mergeProductTracks(profile.tracks, profile.activeTrack);
  const activeTrack = isTrack(profile.activeTrack) ? profile.activeTrack : tracks[0];
  return { ...profile, tracks, activeTrack };
}

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const lionel = ensureOnboardedTracks({
  name: "Lionel Manzi",
  onboarded: true,
  tracks: ["taxi", "owner"],
  activeTrack: "taxi",
});
assert(lionel.tracks.join(",") === "b,taxi,owner", "Lionel profile must gain Körkort B");
assert(lionel.activeTrack === "taxi", "must keep activeTrack");

const taxiOnly = ensureOnboardedTracks({
  onboarded: true,
  tracks: ["taxi"],
  activeTrack: "taxi",
});
assert(taxiOnly.tracks.join(",") === "b,taxi,owner", "taxi-only onboarded must gain all product tracks");

const guest = ensureOnboardedTracks({
  onboarded: false,
  tracks: ["taxi"],
  activeTrack: "taxi",
});
assert(guest.tracks.join(",") === "taxi", "must not rewrite guests still in onboarding");

const bothLegacy = ensureOnboardedTracks({
  onboarded: true,
  tracks: ["b", "taxi"],
  activeTrack: "b",
});
assert(bothLegacy.tracks.join(",") === "b,taxi,owner", "legacy both must gain owner");
assert(bothLegacy.activeTrack === "b", "must keep Körkort as activeTrack");

console.log("tracks-migration.test.mjs ok");
