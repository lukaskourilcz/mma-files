import { demoMode } from "@/config/site";
import { articles as seedArticles } from "@/content/articles";
import { socialVariants as seedSocial } from "@/content/social";
import { getDeliveredArticles, getDeliveredEvents, getDeliveredFighters, getFightAiQDelivery } from "@/lib/boardless";
import {
  FIGHTER_FIELDS,
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
 * An article renders publicly only when it is published, carries at least one
 * source, and is complete in Czech — a title, a dek and a body.
 * A story that fails this is not a rendering bug — it is content that is not
 * ready, and it stays invisible rather than half-rendered.
 *
 * The rule used to demand every locale in LOCALES. That made English mandatory,
 * so the day the desk stopped writing it the site would have built green and
 * published nothing at all: zero article pages and a 110-byte sitemap.
 */
export function isRenderable(article: Article): boolean {
  if (article.status !== "published") return false;
  if (article.sources.length === 0) return false;
  return isRenderableIn(article, "cs");
}

/** Whether an article is complete in one specific locale. */
export function isRenderableIn(article: Article, locale: Locale): boolean {
  const l = article.localizations[locale];
  return Boolean(l?.title?.trim() && l?.dek?.trim() && l?.body?.trim());
}

const byNewest = (a: Article, b: Article) =>
  new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime();

const deliveredArticles = getDeliveredArticles();
// Falling back on an empty array republished fiction. Any change that made a real delivered
// package unreadable — a locale shape the reader did not expect, say — emptied this list and
// the seven fictional demo stories silently took the magazine back over.
//
// A real delivery still always wins, so a live site cannot lose its articles to this. What
// changed is the empty case: with demo mode off, no readable delivery renders an empty
// magazine rather than fiction. Note demoMode defaults to TRUE when the env var is unset, so
// production has to set NEXT_PUBLIC_DEMO_MODE=false for that to hold.
const publishedArticles: Article[] = (deliveredArticles.length > 0 ? deliveredArticles : demoMode ? seedArticles : [])
  .filter(isRenderable)
  .sort(byNewest);

const deliveredFighters = getDeliveredFighters();
const availableFighters: Fighter[] = deliveredFighters;
const deliveredEvents = getDeliveredEvents();
const availableEvents: FightEvent[] = deliveredEvents;

/* -------------------------------------------------------------------------- */
/* Articles                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The copy for one locale, or null when the article was never written in it.
 *
 * Czech is always there; English is optional and on its way out. Callers that render a page
 * must treat null as "this article does not exist in this language" — never as a reason to
 * show the Czech text under an English heading.
 */
export function articleCopy(article: Article, locale: Locale) {
  return article.localizations[locale] ?? null;
}

/** Articles complete in one locale. A list in English must not link pages that have none. */
export function getArticlesIn(locale: Locale, options?: { limit?: number }): Article[] {
  const inLocale = publishedArticles.filter((article) => isRenderableIn(article, locale));
  return options?.limit ? inLocale.slice(0, options.limit) : inLocale;
}

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

/**
 * A label for an article in one locale, falling back to Czech.
 *
 * Czech is the locale every article has, so these never fail. The fallback is for labels
 * only — a cross-reference showing a Czech headline is honest, a whole article body served
 * under the wrong lang attribute is not. Pages resolve their own copy and 404 instead.
 */
export function articleTitle(article: Article, locale: Locale): string {
  return (article.localizations[locale] ?? article.localizations.cs)!.title;
}

export function articleDek(article: Article, locale: Locale): string {
  return (article.localizations[locale] ?? article.localizations.cs)!.dek;
}
