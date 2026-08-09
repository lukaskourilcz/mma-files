import type { Dictionary } from "@/i18n";
import type { Locale } from "@/lib/types";

const BCP47: Record<Locale, string> = { cs: "cs-CZ" };

export function formatDate(
  iso: string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(
    BCP47[locale],
    options ?? { day: "numeric", month: "long", year: "numeric" },
  ).format(new Date(iso));
}

export function formatDateTime(
  iso: string,
  locale: Locale,
  timeZone?: string,
): string {
  return new Intl.DateTimeFormat(BCP47[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  }).format(new Date(iso));
}

/** Compact machine-ish stamp for mono metadata lines: `2026-08-01 08:00`. */
export function formatStamp(iso: string, timeZone?: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...(timeZone ? { timeZone } : {}),
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

/**
 * `Intl.RelativeTimeFormat` already knows Czech numeral agreement
 * ("před 5 dny" vs "za 5 dní"), so relative times are never hand-assembled.
 */
export function formatRelative(iso: string, locale: Locale, now = new Date()): string {
  const diff = new Date(iso).getTime() - now.getTime();
  const rtf = new Intl.RelativeTimeFormat(BCP47[locale], { numeric: "auto" });
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) {
      return rtf.format(Math.round(diff / ms), unit);
    }
  }
  return rtf.format(0, "minute");
}

/** 200 wpm, floored at one minute. Counts the rendered body, not the markup. */
export function readingTimeMinutes(body: string): number {
  const words = body
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, "$1")
    .replace(/[#>*_`\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Countdown to a card. Inside two months, fight scheduling is read in days —
 * "in 35 days" is useful where `Intl`'s coarser "next month" is not.
 */
export function formatCountdown(iso: string, locale: Locale, now = new Date()): string {
  const diffMs = new Date(iso).getTime() - now.getTime();
  const days = Math.round(diffMs / (24 * 60 * 60 * 1000));
  if (Math.abs(days) < 60 && Math.abs(diffMs) >= 24 * 60 * 60 * 1000) {
    return new Intl.RelativeTimeFormat(BCP47[locale], { numeric: "auto" }).format(
      days,
      "day",
    );
  }
  return formatRelative(iso, locale, now);
}

export function formatRecord(record: {
  wins: number;
  losses: number;
  draws: number;
  noContests?: number;
}): string {
  const base = `${record.wins}–${record.losses}–${record.draws}`;
  return record.noContests ? `${base} (${record.noContests} NC)` : base;
}

export function formatHeight(cm: number, locale: Locale): string {
  if (locale === "cs") return `${cm} cm`;
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return `${cm} cm (${feet}′${inches}″)`;
}

export function ageFrom(dateOfBirth: string, now = new Date()): number {
  const dob = new Date(dateOfBirth);
  let age = now.getFullYear() - dob.getFullYear();
  const monthDelta = now.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

export function countryName(code: string, dict: Dictionary): string {
  const known = dict.countries as Record<string, string | undefined>;
  return known[code] ?? code;
}
