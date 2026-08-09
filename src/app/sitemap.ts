import type { MetadataRoute } from "next";
import { absoluteUrl, allowIndexing } from "@/config/site";
import { routes } from "@/lib/paths";
import {
  getArticles,
  getEvents,
  getFighters,
} from "@/lib/repository";
import { LOCALES, ORGANIZATIONS, type Locale } from "@/lib/types";

type Entry = MetadataRoute.Sitemap[number];

/** Both locales of one route, cross-linked with `alternates.languages`. */
function localised(
  path: (locale: Locale) => string,
  options: { lastModified?: string | Date; priority?: number } = {},
): Entry[] {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, absoluteUrl(path(locale))]),
  );

  return LOCALES.map((locale) => ({
    url: absoluteUrl(path(locale)),
    lastModified: options.lastModified,
    priority: options.priority,
    alternates: { languages },
  }));
}

/**
 * Empty while the site is in demo mode. A sitemap is a request to index, and
 * there is nothing here that should be indexed yet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!allowIndexing) return [];

  const staticRoutes: Entry[] = [
    ...localised(routes.home, { priority: 1 }),
    ...localised(routes.latest, { priority: 0.9 }),
    ...localised(routes.fightWeek, { priority: 0.8 }),
    ...localised(routes.predictions, { priority: 0.8 }),
    ...localised(routes.results, { priority: 0.8 }),
    ...localised(routes.fighters, { priority: 0.7 }),
    ...localised(routes.events, { priority: 0.7 }),
    ...localised(routes.dataDesk, { priority: 0.6 }),
    ...localised(routes.howItWorks, { priority: 0.6 }),
    ...localised(routes.about, { priority: 0.5 }),
    ...localised(routes.standards, { priority: 0.5 }),
    ...localised(routes.corrections, { priority: 0.5 }),
    ...localised(routes.privacy, { priority: 0.3 }),
    ...ORGANIZATIONS.flatMap((org) =>
      localised((l) => routes.organization(l, org), { priority: 0.8 }),
    ),
  ];

  const articleRoutes = getArticles()
    .filter((article) => !article.isDemo)
    .flatMap((article) =>
      localised((l) => routes.article(l, article.slug), {
        lastModified: article.updatedAt ?? article.publishAt,
        priority: 0.9,
      }),
    );

  const eventRoutes = getEvents()
    .filter((event) => !event.isDemo)
    .flatMap((event) => localised((l) => routes.event(l, event.slug), { priority: 0.6 }));

  const fighterRoutes = getFighters()
    .filter((fighter) => !fighter.isDemo)
    .flatMap((fighter) =>
      localised((l) => routes.fighter(l, fighter.organization, fighter.slug), {
        priority: 0.6,
      }),
    );

  return [...staticRoutes, ...articleRoutes, ...eventRoutes, ...fighterRoutes];
}
