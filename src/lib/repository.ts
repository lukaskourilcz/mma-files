import { articles as seedArticles } from "@/content/articles";
import { socialVariants as seedSocial } from "@/content/social";
import { getDeliveredArticles, getDeliveredEvents, getDeliveredFighters, getFightAiQDelivery } from "@/lib/boardless";
import {
  FIGHTER_FIELDS,
  LOCALES,
  type Article,
  type ArticleFormat,
  type Correction,
  type FieldState,
  type FightEvent,
  type Fighter,
  type Locale,
  type Organization,
  type SocialVariant,
} from "@/lib/types";

/**
 * The only sanctioned read path for content.
 *
 * Route and component code must go through this module rather than importing
 * `src/content/` directly, so that swapping the seed arrays for a CMS or the
 * BoardlessAI delivery API is a change in one file. Every function here is
 * synchronous today; if a remote source is introduced, widen the return types
 * to promises and the call sites follow.
 */

/* -------------------------------------------------------------------------- */
/* Publication gate                                                           */
/* -------------------------------------------------------------------------- */

/**
 * An article renders publicly only when it is published, exists in *both*
 * locales with a title, a dek and a body, and carries at least one source.
 * A story that fails this is not a rendering bug — it is content that is not
 * ready, and it stays invisible rather than half-rendered.
 */
export function isRenderable(article: Article): boolean {
  if (article.status !== "published") return false;
  if (article.sources.length === 0) return false;
  return LOCALES.every((locale) => {
    const l = article.localizations[locale];
    return Boolean(l?.title?.trim() && l?.dek?.trim() && l?.body?.trim());
  });
}

const byNewest = (a: Article, b: Article) =>
  new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime();

const deliveredArticles = getDeliveredArticles();
const publishedArticles: Article[] = (deliveredArticles.length ? deliveredArticles : seedArticles)
  .filter(isRenderable)
  .sort(byNewest);

const deliveredFighters = getDeliveredFighters();
const availableFighters: Fighter[] = deliveredFighters;
const deliveredEvents = getDeliveredEvents();
const availableEvents: FightEvent[] = deliveredEvents;

/* -------------------------------------------------------------------------- */
/* Articles                                                                   */
/* -------------------------------------------------------------------------- */

export function getArticles(options?: { limit?: number }): Article[] {
  return options?.limit ? publishedArticles.slice(0, options.limit) : publishedArticles;
}

export function getLeadArticle(): Article | undefined {
  return publishedArticles[0];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return publishedArticles.find((a) => a.slug === slug);
}

export function getArticlesByOrganization(organization: Organization): Article[] {
  return publishedArticles.filter((a) => a.organization === organization);
}

export function getArticlesByFormat(format: ArticleFormat): Article[] {
  return publishedArticles.filter((a) => a.format === format);
}

export function getArticlesByFighter(fighterId: string): Article[] {
  return publishedArticles.filter((a) => a.fighterRefs.includes(fighterId));
}

export function getArticlesByEvent(eventId: string): Article[] {
  return publishedArticles.filter((a) => a.eventRef === eventId);
}

/**
 * Editorially chosen related stories first, then same-organization fallbacks,
 * so a story is never left without onward links.
 */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const chosen = (article.relatedSlugs ?? [])
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is Article => Boolean(a) && a?.slug !== article.slug);

  if (chosen.length >= limit) return chosen.slice(0, limit);

  const seen = new Set([article.slug, ...chosen.map((a) => a.slug)]);
  const fallback = publishedArticles.filter((a) => {
    if (seen.has(a.slug)) return false;
    return a.organization === article.organization || a.format === article.format;
  });

  return [...chosen, ...fallback].slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Corrections                                                                */
/* -------------------------------------------------------------------------- */

export interface CorrectionEntry {
  correction: Correction;
  article: Article;
}

/** Flattened correction log across every published story, newest first. */
export function getCorrectionLog(): CorrectionEntry[] {
  return publishedArticles
    .flatMap((article) =>
      (article.corrections ?? []).map((correction) => ({ correction, article })),
    )
    .sort(
      (a, b) =>
        new Date(b.correction.at).getTime() - new Date(a.correction.at).getTime(),
    );
}

/* -------------------------------------------------------------------------- */
/* Fighters                                                                   */
/* -------------------------------------------------------------------------- */

export function getFighters(): Fighter[] {
  return [...availableFighters].sort((a, b) => a.name.localeCompare(b.name, "cs"));
}

export function getFightersByOrganization(organization: Organization): Fighter[] {
  return getFighters().filter((f) => f.organization === organization);
}

export function getFighterById(id: string): Fighter | undefined {
  return availableFighters.find((f) => f.id === id);
}

export function getFighterBySlug(
  organization: Organization,
  slug: string,
): Fighter | undefined {
  return availableFighters.find(
    (f) => f.organization === organization && f.slug === slug,
  );
}

export function resolveFighters(ids: readonly string[]): Fighter[] {
  return ids
    .map((id) => getFighterById(id))
    .filter((f): f is Fighter => Boolean(f));
}

/* -------------------------------------------------------------------------- */
/* Events                                                                     */
/* -------------------------------------------------------------------------- */

const byStartAsc = (a: FightEvent, b: FightEvent) =>
  new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

export function getEvents(): FightEvent[] {
  return [...availableEvents].sort(byStartAsc);
}

export function getEventById(id: string): FightEvent | undefined {
  return availableEvents.find((e) => e.id === id);
}

export function getEventBySlug(slug: string): FightEvent | undefined {
  return availableEvents.find((e) => e.slug === slug);
}

export function getEventsByOrganization(organization: Organization): FightEvent[] {
  return getEvents().filter((e) => e.organization === organization);
}

/** Booked cards, soonest first. */
export function getUpcomingEvents(now = new Date()): FightEvent[] {
  return getEvents().filter(
    (e) => e.status !== "completed" && new Date(e.startsAt).getTime() >= now.getTime(),
  );
}

/** Completed cards, most recent first. */
export function getCompletedEvents(): FightEvent[] {
  return getEvents()
    .filter((e) => e.status === "completed")
    .reverse();
}

/** Cards a fighter is booked on or has fought on, soonest first. */
export function getEventsForFighter(fighterId: string): FightEvent[] {
  return getEvents().filter((e) =>
    e.bouts.some(
      (b) => b.red.fighterRef === fighterId || b.blue.fighterRef === fighterId,
    ),
  );
}

/* -------------------------------------------------------------------------- */
/* Social                                                                     */
/* -------------------------------------------------------------------------- */

export function getSocialVariants(articleId?: string): SocialVariant[] {
  return articleId
    ? seedSocial.filter((v) => v.articleId === articleId)
    : [...seedSocial];
}

/* -------------------------------------------------------------------------- */
/* Coverage                                                                   */
/* -------------------------------------------------------------------------- */

export interface CoverageStats {
  fighterFiles: number;
  eventFiles: number;
  articleFiles: number;
  sourceRefs: number;
  fieldsTracked: number;
  byState: Record<FieldState, number>;
  storiesWithSocialTreatments: number;
  socialTreatments: number;
}

/**
 * Computed from what the repository actually holds, so the Data Desk shows a
 * real count rather than a claim. A field with no recorded state counts as
 * `unavailable` — absence is a state, not a blank.
 */
export function getCoverageStats(): CoverageStats {
  const byState: Record<FieldState, number> = {
    verified: 0,
    provisional: 0,
    disputed: 0,
    unavailable: 0,
  };

  for (const fighter of availableFighters) {
    for (const field of FIGHTER_FIELDS) {
      byState[fighter.fieldStates[field] ?? "unavailable"] += 1;
    }
  }

  const sourceRefs =
    availableFighters.reduce((n, f) => n + f.sources.length, 0) +
    availableEvents.reduce((n, e) => n + e.sources.length, 0) +
    publishedArticles.reduce((n, a) => n + a.sources.length, 0);

  return {
    fighterFiles: availableFighters.length,
    eventFiles: availableEvents.length,
    articleFiles: publishedArticles.length,
    sourceRefs,
    fieldsTracked: availableFighters.length * FIGHTER_FIELDS.length,
    byState,
    storiesWithSocialTreatments: new Set(seedSocial.map((v) => v.articleId)).size,
    socialTreatments: seedSocial.length,
  };
}

export { getFightAiQDelivery };

/* -------------------------------------------------------------------------- */
/* Locale helpers                                                             */
/* -------------------------------------------------------------------------- */

export function articleTitle(article: Article, locale: Locale): string {
  return article.localizations[locale].title;
}

export function articleDek(article: Article, locale: Locale): string {
  return article.localizations[locale].dek;
}
