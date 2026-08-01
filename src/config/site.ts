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

  /** Sourced fight data, captured market prices and versioned model layer. */
  dataLayer: {
    name: "FightAIQ",
    mode: "verified-data" as const,
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
 * The repository starts with fictional seed content. While that is the only
 * content, the site stays out of search indexes and the RSS feed carries no
 * stories. Flip `NEXT_PUBLIC_DEMO_MODE=false` after a real delivery lands.
 */
export const demoMode = envFlag(process.env.NEXT_PUBLIC_DEMO_MODE, true);

/**
 * Master indexing switch. Demo mode forces this off regardless of the env var,
 * so sample reporting can never be published to search engines by accident.
 */
export const allowIndexing =
  !demoMode && envFlag(process.env.NEXT_PUBLIC_ALLOW_INDEXING, false);

/**
 * Canonical production origin. Local development can opt back into localhost
 * with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mma-files.vercel.app"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
