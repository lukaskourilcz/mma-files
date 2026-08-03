import { cs } from "./cs";
import { type Dictionary } from "./en";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/types";

// en.ts stays as the Dictionary type anchor; it is no longer a dictionary the site serves.
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
