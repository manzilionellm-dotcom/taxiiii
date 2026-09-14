#!/usr/bin/env node
import {
  continuityGreeting,
  continuityNote,
  dailyTeacherNote,
  missLabelFromText,
  sameCalendarDay,
  topicSv,
} from "../lib/teacher/copy.mjs";

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

assert(topicSv("sakerhet") === "Säkerhet", "topic stays exam-Swedish");
assert(missLabelFromText("Hur lång dygnsvila / vilotid?") === "vilotid", "vilotid from stem");
assert(
  missLabelFromText("Du ska köra 1-3 personer på en söndag. Vilken tariff ska du använda?") ===
    "tariff 31",
  "Sunday tariff pattern",
);
assert(missLabelFromText("En vanlig fråga utan fälla") === "", "no invented miss label");

const greeting = continuityGreeting({
  locale: "fr",
  trackName: "Taxi",
  yesterday: true,
  lastTopic: "sakerhet",
  weakLabel: "vilotid",
  weakAccuracy: 42,
});
assert(
  greeting === "Hier tu étais sur Säkerhet… Aujourd'hui on corrige vilotid (42%).",
  `continuity greeting, got: ${greeting}`,
);

const first = continuityGreeting({
  locale: "fr",
  trackName: "Taxi",
  firstDay: true,
});
assert(first.includes("On commence tranquillement Taxi"), `first day, got: ${first}`);
assert(!first.toLowerCase().includes("bienvenue"), "never generic welcome");

const sameDay = continuityGreeting({
  locale: "sv",
  trackName: "Taxi",
  yesterday: false,
  lastTopic: "lagstiftning",
  weakLabel: "vilotid",
  weakAccuracy: 50,
});
assert(sameDay.startsWith("Vi fortsätter med Lagstiftning"), `same day, got: ${sameDay}`);

assert(sameCalendarDay(new Date().toISOString()), "today is same calendar day");
assert(!sameCalendarDay("2020-01-01T12:00:00.000Z", new Date("2026-09-14T08:00:00.000Z")), "old day");

const note = continuityNote({ locale: "fr", due: 3 });
assert(note.includes("3 cartes"), `due note, got: ${note}`);

const daily = dailyTeacherNote(greeting, note);
assert(daily.startsWith("Hier tu étais"), "daily note keeps continuity");

console.log("teacher-presence.test.mjs ok");
