import type { SocialVariant } from "@/lib/types";

/**
 * DEMO DATA — prepared, never posted.
 *
 * Each approved story gets two design variants, A and B, each written in both
 * languages: four localised treatments per story. They are stored here so the
 * workflow is real, but nothing on this site is wired to Instagram, Threads or
 * any other platform. Publishing is manual and requires a separate
 * authorisation step with platform credentials that this repository does not
 * hold.
 *
 * Captions are not rendered on the public site. The Data Desk and the
 * methodology page read counts from this file so the numbers they show are the
 * real ones rather than a claim.
 */
export const socialVariants: SocialVariant[] = [
  {
    id: "social:2026-08-01-alderton-rahal/A/en",
    articleId: "article:2026-08-01-alderton-rahal",
    variant: "A",
    locale: "en",
    family: "quote-led-preview",
    caption:
      "Reece Alderton headlines for the first time on 8 August. Five rounds, and none of his seventeen fights has gone past three. The file has what is confirmed and what is not.",
    state: "draft",
  },
  {
    id: "social:2026-08-01-alderton-rahal/A/cs",
    articleId: "article:2026-08-01-alderton-rahal",
    variant: "A",
    locale: "cs",
    family: "quote-led-preview",
    caption:
      "Reece Alderton povede 8. srpna poprvé kartu. Pět kol — a ani jeden z jeho sedmnácti zápasů nešel za třetí. Ve složce je, co je potvrzené a co ne.",
    state: "draft",
  },
  {
    id: "social:2026-08-01-alderton-rahal/B/en",
    articleId: "article:2026-08-01-alderton-rahal",
    variant: "B",
    locale: "en",
    family: "tale-of-the-tape",
    caption:
      "Alderton vs. Rahal, five rounds in Las Vegas. Four bouts on the card, a fifth referred to and never named.",
    state: "draft",
  },
  {
    id: "social:2026-08-01-alderton-rahal/B/cs",
    articleId: "article:2026-08-01-alderton-rahal",
    variant: "B",
    locale: "cs",
    family: "tale-of-the-tape",
    caption:
      "Alderton vs. Rahal, pět kol v Las Vegas. Na kartě čtyři zápasy, pátý zmíněný a nepojmenovaný.",
    state: "draft",
  },

  {
    id: "social:2026-07-19-ksw-107-recap/A/en",
    articleId: "article:2026-07-19-ksw-107-recap",
    variant: "A",
    locale: "en",
    family: "type-led-result",
    caption:
      "Łempicki stops Brandt at 2:14 of round three. Ten of his eleven wins have come in round two or later.",
    state: "draft",
  },
  {
    id: "social:2026-07-19-ksw-107-recap/A/cs",
    articleId: "article:2026-07-19-ksw-107-recap",
    variant: "A",
    locale: "cs",
    family: "type-led-result",
    caption:
      "Łempicki ukončil Brandta ve 2:14 třetího kola. Deset z jedenácti výher má z druhého kola nebo později.",
    state: "draft",
  },
  {
    id: "social:2026-07-19-ksw-107-recap/B/en",
    articleId: "article:2026-07-19-ksw-107-recap",
    variant: "B",
    locale: "en",
    family: "data-card",
    caption:
      "KSW 107, Gdańsk: one technical knockout, one submission, one unanimous decision, one draw.",
    state: "draft",
  },
  {
    id: "social:2026-07-19-ksw-107-recap/B/cs",
    articleId: "article:2026-07-19-ksw-107-recap",
    variant: "B",
    locale: "cs",
    family: "data-card",
    caption:
      "KSW 107, Gdaňsk: jeden technický knockout, jedna submise, jedno jednomyslné rozhodnutí, jedna remíza.",
    state: "draft",
  },
];
