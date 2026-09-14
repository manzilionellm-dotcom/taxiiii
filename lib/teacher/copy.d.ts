import type { Locale, Topic } from "@/lib/types";

export const TOPIC_SV: Record<Topic, string>;
export const EXAM_TERMS: { re: RegExp; label: string }[];

export function topicSv(topic?: Topic | string | null): string;
export function missLabelFromText(text?: string | null): string;
export function sameCalendarDay(iso?: string | null, now?: Date): boolean;

export function continuityGreeting(input: {
  locale: Locale | string;
  name?: string;
  trackName: string;
  firstDay?: boolean;
  yesterday?: boolean;
  lastTopic?: string;
  weakLabel?: string;
  weakAccuracy?: number;
}): string;

export function continuityNote(input: { locale: Locale | string; due?: number }): string;
export function dailyTeacherNote(greeting: string, note: string): string;
