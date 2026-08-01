import { cs } from "./cs";
import { en, type Dictionary } from "./en";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/types";

const dictionaries: Record<Locale, Dictionary> = { en, cs };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Narrow an unknown route segment, falling back to the default locale. */
export function resolveLocale(segment: string): Locale {
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "cs" : "en";
}

export type { Dictionary };
