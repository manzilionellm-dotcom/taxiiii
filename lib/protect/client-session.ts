"use client";

let inflight: Promise<void> | null = null;
let lastKey = "";

export function ensureClientSession(profile?: { name?: string; email?: string }) {
  const key = `${profile?.name ?? ""}|${profile?.email ?? ""}`;
  if (inflight && lastKey === key) return inflight;
  lastKey = key;
  inflight = fetch("/api/session", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: profile?.name ?? "",
      email: profile?.email ?? "",
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("session");
    })
    .catch((error) => {
      inflight = null;
      throw error;
    });
  return inflight;
}
