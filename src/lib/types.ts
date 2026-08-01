/**
 * MMA Files content model.
 *
 * The `Article`, `Source` and `ArticleLocale` shapes below are the contract
 * agreed with the BoardlessAI editorial engine. Everything the engine sends is
 * required; everything this website adds on top is optional, so an untouched
 * engine payload still satisfies the type. Optional additions are marked
 * `[site]` — see README, "Content model".
 */

export const LOCALES = ["en", "cs"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const ORGANIZATIONS = ["ufc", "oktagon", "ksw"] as const;
export type Organization = (typeof ORGANIZATIONS)[number];

export function isOrganization(value: string): value is Organization {
  return (ORGANIZATIONS as readonly string[]).includes(value);
}

export const DIVISIONS = [
  "strawweight",
  "flyweight",
  "bantamweight",
  "featherweight",
  "lightweight",
  "welterweight",
  "middleweight",
  "light-heavyweight",
  "heavyweight",
  "womens-strawweight",
  "womens-flyweight",
  "womens-bantamweight",
  "catchweight",
] as const;
export type Division = (typeof DIVISIONS)[number];

export type Stance = "orthodox" | "southpaw" | "switch";

/**
 * How well evidenced a single field is, mirroring the FightAIQ review states.
 * `unavailable` is rendered as an explicit gap — never as a zero or a guess.
 */
export type FieldState = "verified" | "provisional" | "disputed" | "unavailable";

/* -------------------------------------------------------------------------- */
/* Sources                                                                    */
/* -------------------------------------------------------------------------- */

export interface Source {
  kind: "internal" | "external";
  /** Internal evidence reference, e.g. `fightaiq:fighter/ufc/reece-alderton@3`. */
  ref?: string;
  url?: string;
  title?: string;
  publisher?: string;
  /** ISO 8601. */
  retrievedAt?: string;
  classification?: "primary" | "secondary";
  /** Short claims this source is being cited for. */
  supports?: string[];
}

/* -------------------------------------------------------------------------- */
/* Articles                                                                   */
/* -------------------------------------------------------------------------- */

export interface ArticleLocale {
  title: string;
  dek: string;
  /** Restricted Markdown — see `src/lib/markdown.tsx` for the supported subset. */
  body: string;
}

export type ArticleStatus = "draft" | "blocked" | "published" | "killed";

export const ARTICLE_FORMATS = [
  "fight-week-preview",
  "post-event-recap",
  "fighter-profile",
  "data-story",
  "weigh-in-report",
  "desk-notes",
] as const;
export type ArticleFormat = (typeof ARTICLE_FORMATS)[number];

export type HeroTemplate =
  | "tale-of-the-tape"
  | "type-led-result"
  | "data-card"
  | "quote-led-preview";

export interface HeroSpec {
  template: HeroTemplate;
  bindings: Record<string, string | number | boolean>;
}

/** [site] A published amendment. Corrections stay visible; they are never silently applied. */
export interface Correction {
  at: string;
  kind: "correction" | "update";
  note: Record<Locale, string>;
}

/**
 * [site] Disclosure block required whenever a story leans on a deterministic
 * FightAIQ output. FightAIQ is in `data-only` mode: descriptive aggregates only,
 * never a forecast, a price or a recommendation.
 */
export interface ModelDisclosure {
  /** Exact, hash-coupled version string. */
  version: string;
  /** Evidence references the aggregate was computed from. */
  inputs: string[];
  /** Plain-language uncertainty statement, per locale. */
  uncertainty: Record<Locale, string>;
}

export interface Article {
  id: string;
  slug: string;
  status: ArticleStatus;
  format: ArticleFormat;
  localizations: Record<Locale, ArticleLocale>;
  organization?: Organization;
  fighterRefs: string[];
  eventRef?: string;
  sources: Source[];
  /** ISO 8601. */
  publishAt: string;
  updatedAt?: string;
  heroSpec: HeroSpec;
  modelVersion?: string;
  packageHash?: string;

  /** [site] Fictional seed content. Badged in the UI and excluded from indexing. */
  isDemo?: boolean;
  /** [site] Editorial file number shown as `FILE 024`. */
  fileNumber?: number;
  /** [site] Alt text for the generated hero, per locale. */
  heroAlt?: Record<Locale, string>;
  /**
   * [site] Editorial pull line for the `quote-led-preview` hero. It is the
   * desk's own line, never a quotation attributed to a person. Falls back to
   * the dek, though repeating the dek beside it reads as a duplicate.
   */
  heroLine?: Record<Locale, string>;
  /** [site] Bullets for "The file" panel. */
  confirmed?: Record<Locale, string[]>;
  unconfirmed?: Record<Locale, string[]>;
  corrections?: Correction[];
  modelDisclosure?: ModelDisclosure;
  /** [site] Slugs of related stories, in editorial priority order. */
  relatedSlugs?: string[];
}

/* -------------------------------------------------------------------------- */
/* Fighters                                                                   */
/* -------------------------------------------------------------------------- */

export interface FighterRecord {
  wins: number;
  losses: number;
  draws: number;
  noContests?: number;
}

export interface FighterLocale {
  /** One paragraph. What this fighter is, in plain language. */
  summary: string;
  /** How they actually win, when the evidence supports saying so. */
  styleNote: string;
}

export interface Fighter {
  id: string;
  slug: string;
  organization: Organization;
  name: string;
  nickname?: string;
  division: Division;
  /** ISO 3166-1 alpha-2. Localised for display. */
  country: string;
  team?: string;
  record?: FighterRecord;
  stance?: Stance;
  heightCm?: number;
  reachCm?: number;
  dateOfBirth?: string;
  localizations: Record<Locale, FighterLocale>;
  /**
   * Evidence state per field name. Any field absent from this map, or marked
   * `unavailable`, renders as an explicit gap rather than a value.
   */
  fieldStates: Partial<Record<FighterField, FieldState>>;
  sources: Source[];
  isDemo?: boolean;
}

export const FIGHTER_FIELDS = [
  "record",
  "stance",
  "heightCm",
  "reachCm",
  "dateOfBirth",
  "team",
  "division",
] as const;
export type FighterField = (typeof FIGHTER_FIELDS)[number];

/* -------------------------------------------------------------------------- */
/* Events                                                                     */
/* -------------------------------------------------------------------------- */

export type ResultMethod =
  | "ko"
  | "tko"
  | "submission"
  | "decision-unanimous"
  | "decision-split"
  | "decision-majority"
  | "draw"
  | "no-contest";

export interface BoutResult {
  /** Absent for a draw or a no contest. */
  winnerRef?: string;
  method: ResultMethod;
  /** e.g. `rear-naked-choke`, `punches`, `head-kick`. Localised for display. */
  finish?: string;
  round?: number;
  /** `M:SS`. */
  time?: string;
}

export interface BoutSide {
  /** Display name. Always present, even when no profile page exists. */
  name: string;
  /** Set when this fighter has a profile in the repository. */
  fighterRef?: string;
}

export interface Bout {
  id: string;
  division: Division;
  red: BoutSide;
  blue: BoutSide;
  scheduledRounds: number;
  titleFight?: boolean;
  /** `main`, `co-main` and the rest of the card in listed order. */
  billing: "main" | "co-main" | "main-card" | "prelim";
  result?: BoutResult;
}

export type EventStatus = "announced" | "card-forming" | "confirmed" | "completed";

export interface EventLocale {
  summary: string;
  /** Optional editorial note — what is still open on this card. */
  note?: string;
}

export interface FightEvent {
  id: string;
  slug: string;
  organization: Organization;
  name: string;
  /** ISO 8601 with offset. Displayed in the reader's locale, labelled with the venue's zone. */
  startsAt: string;
  timeZone: string;
  venue?: string;
  city: string;
  /** ISO 3166-1 alpha-2. */
  country: string;
  status: EventStatus;
  bouts: Bout[];
  localizations: Record<Locale, EventLocale>;
  sources: Source[];
  isDemo?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Social                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Stored, never posted. Two design variants per approved story, each in both
 * languages. Publishing is manual and requires a separate authorisation step.
 */
export interface SocialVariant {
  id: string;
  articleId: string;
  variant: "A" | "B";
  locale: Locale;
  family: HeroTemplate;
  caption: string;
  /** `draft` until the owner exports it. Nothing here is wired to a platform. */
  state: "draft" | "exported";
}
