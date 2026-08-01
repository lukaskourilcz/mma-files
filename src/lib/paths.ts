import type { Locale, Organization } from "@/lib/types";

/** Every reader-facing route is locale-prefixed; these are the only builders used. */
export const routes = {
  home: (l: Locale) => `/${l}`,
  latest: (l: Locale) => `/${l}/latest`,
  organization: (l: Locale, org: Organization) => `/${l}/${org}`,
  fightWeek: (l: Locale) => `/${l}/fight-week`,
  results: (l: Locale) => `/${l}/results`,
  fighters: (l: Locale) => `/${l}/fighters`,
  fighter: (l: Locale, org: Organization, slug: string) =>
    `/${l}/fighters/${org}/${slug}`,
  events: (l: Locale) => `/${l}/events`,
  event: (l: Locale, slug: string) => `/${l}/events/${slug}`,
  dataDesk: (l: Locale) => `/${l}/data-desk`,
  article: (l: Locale, slug: string) => `/${l}/articles/${slug}`,
  howItWorks: (l: Locale) => `/${l}/how-it-works`,
  about: (l: Locale) => `/${l}/about`,
  standards: (l: Locale) => `/${l}/editorial-standards`,
  corrections: (l: Locale) => `/${l}/corrections`,
  privacy: (l: Locale) => `/${l}/privacy`,
  newsletter: (l: Locale) => `/${l}/newsletter`,
  rss: (l: Locale) => `/${l}/rss.xml`,
} as const;

/**
 * Swap the locale segment of the current path, keeping the reader where they
 * are. Every route on this site exists in both locales, so the target is always
 * valid.
 */
export function withLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${locale}`;
  segments[0] = locale;
  return `/${segments.join("/")}`;
}
