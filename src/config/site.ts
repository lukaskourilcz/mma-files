import type { Locale } from "@/lib/types";

/**
 * Single place to change brand wording, the engine attribution and the
 * indexing switches. The BoardlessAI name stays configurable because the final
 * name and domain are not cleared yet.
 */

function envFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

export const siteConfig = {
  /** Reader-facing editorial brand. */
  name: "MMA Files",
  wordmark: "MMA FILES",
  utilityLine: {
    en: "Fight reporting / Data / Czech + English",
    cs: "Zápasová žurnalistika / Data / Česky + anglicky",
  } satisfies Record<Locale, string>,

  tagline: {
    en: "The fight is the headline. The file is the proof.",
    cs: "Zápas je zpráva. Složka je důkaz.",
  } satisfies Record<Locale, string>,

  description: {
    en: "Reporting on UFC and Oktagon with sources attached — in English and Czech.",
    cs: "Zpravodajství o UFC a Oktagonu se zdroji u každého tvrzení — česky a anglicky.",
  } satisfies Record<Locale, string>,

  /**
   * Infrastructure and editorial engine behind the magazine. Name pending final
   * clearance — change it here and every surface follows.
   */
  engine: {
    name: "BoardlessAI",
    descriptor: {
      en: "an evidence-governed editorial engine",
      cs: "redakční systém řízený důkazy",
    } satisfies Record<Locale, string>,
    /** Set once a public BoardlessAI page exists. `null` renders plain text. */
    url: null as string | null,
  },

  /** Sourced fight data and analysis layer. Currently `data-only`. */
  dataLayer: {
    name: "FightAIQ",
    mode: "data-only" as const,
    coverage: ["ufc", "oktagon"] as const,
  },

  byline: {
    en: "MMA Files Editorial Desk",
    cs: "Redakce MMA Files",
  } satisfies Record<Locale, string>,

  /** Prague newsroom clock, shown on the methodology page. */
  newsroomTimeZone: "Europe/Prague",

  social: {
    instagram: null as string | null,
    threads: null as string | null,
  },

  contact: {
    corrections: "corrections@example.invalid",
  },
} as const;

/**
 * Everything currently on the site is fictional seed content. While this is
 * true the site stays out of search indexes and the RSS feed carries no
 * stories. Flip `NEXT_PUBLIC_DEMO_MODE=false` only once real sourced articles
 * have replaced `src/content/`.
 */
export const demoMode = envFlag(process.env.NEXT_PUBLIC_DEMO_MODE, true);

/**
 * Master indexing switch. Demo mode forces this off regardless of the env var,
 * so sample reporting can never be published to search engines by accident.
 */
export const allowIndexing =
  !demoMode && envFlag(process.env.NEXT_PUBLIC_ALLOW_INDEXING, false);

/** Set `NEXT_PUBLIC_SITE_URL` before deploying so canonicals and hreflang resolve. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
