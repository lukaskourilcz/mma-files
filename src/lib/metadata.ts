import type { Metadata } from "next";
import { allowIndexing } from "@/config/site";
import type { Locale } from "@/lib/types";

/**
 * Locale-aware metadata for a static route: canonical, both hreflang
 * alternates, an x-default, and the indexing decision in one place.
 *
 * `path` is the route builder from `src/lib/paths.ts`, so the canonical and the
 * alternates can never drift from the actual URLs.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  indexable = true,
}: {
  locale: Locale;
  path: (locale: Locale) => string;
  title: string;
  description: string;
  /** Set false for pages that should stay out of search even once the site is live. */
  indexable?: boolean;
}): Metadata {
  const canIndex = allowIndexing && indexable;

  return {
    title,
    description,
    alternates: {
      canonical: path(locale),
      languages: {
        cs: path("cs"),
        "x-default": path("cs"),
      },
    },
    robots: canIndex
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: path(locale),
      locale: "cs_CZ",
    },
  };
}
