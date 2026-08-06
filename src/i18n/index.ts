import { cs, type Dictionary } from "./cs";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/types";

const dictionaries: Record<Locale, Dictionary> = { cs };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Narrow an unknown route segment, falling back to the default locale. */
export function resolveLocale(segment: string): Locale {
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

/** One published locale, so there is no other one to switch to. */
export function otherLocale(): Locale {
  return "cs";
}

export type { Dictionary };
