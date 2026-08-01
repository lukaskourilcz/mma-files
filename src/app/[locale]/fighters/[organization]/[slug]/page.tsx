import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/ArticleCard";
import { SourceList } from "@/components/article/ArticleFile";
import { BoutRow } from "@/components/event/EventCard";
import {
  EvidenceCoverage,
  TaleOfTheTape,
} from "@/components/fighter/FighterCard";
import { DemoNotice } from "@/components/site/HomeModules";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { Chip, Container, Kicker, SectionHeading } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { countryName } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import {
  getArticlesByFighter,
  getEventsForFighter,
  getFighterBySlug,
  getFighters,
} from "@/lib/repository";
import { LOCALES, isLocale, isOrganization, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getFighters().map((fighter) => ({
      locale,
      organization: fighter.organization,
      slug: fighter.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; organization: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, organization, slug } = await params;
  if (!isLocale(locale) || !isOrganization(organization)) return {};
  const fighter = getFighterBySlug(organization, slug);
  if (!fighter) return {};

  return pageMetadata({
    locale,
    path: (l) => routes.fighter(l, organization, slug),
    title: fighter.name,
    description: fighter.localizations[locale].summary,
    indexable: !fighter.isDemo,
  });
}

export default async function FighterPage({
  params,
}: {
  params: Promise<{ locale: string; organization: string; slug: string }>;
}) {
  const { locale: raw, organization, slug } = await params;
  if (!isLocale(raw) || !isOrganization(organization)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const fighter = getFighterBySlug(organization, slug);
  if (!fighter) notFound();

  const local = fighter.localizations[locale];
  const stories = getArticlesByFighter(fighter.id);
  const events = getEventsForFighter(fighter.id);
  const now = Date.now();
  const booked = events.filter((e) => new Date(e.startsAt).getTime() >= now);

  return (
    <>
      <header className="border-b border-rule-dark bg-ink text-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs
            tone="paper"
            items={[
              { href: routes.home(locale), label: dict.nav.home },
              { href: routes.fighters(locale), label: dict.fighters.title },
              {
                href: routes.organization(locale, fighter.organization),
                label: dict.organizationsShort[fighter.organization],
              },
              { label: fighter.name },
            ]}
          />

          <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <Chip tone="ember">{dict.organizations[fighter.organization]}</Chip>
            <Chip tone="dark">{dict.divisions[fighter.division]}</Chip>
            {fighter.country ? <span className="label-mono-sm text-muted">{countryName(fighter.country, dict)}</span> : null}
          </div>

          <h1 className="mt-5 text-[2rem] leading-[1.06] tracking-[-0.04em] text-white sm:text-[2.5rem] lg:text-[3rem]">
            {fighter.name}
          </h1>
          {fighter.nickname ? (
            <p className="label-mono mt-3 text-ember">“{fighter.nickname}”</p>
          ) : null}

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper-muted md:text-lg">
            {local.summary}
          </p>
        </Container>
      </header>

      <Container className="py-10 md:py-14">
        {fighter.isDemo ? (
          <div className="mb-8">
            <DemoNotice locale={locale} variant="data" />
          </div>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-8 lg:col-span-7 xl:col-span-8">
            <TaleOfTheTape fighter={fighter} locale={locale} />

            <section aria-labelledby="style" className="sheet p-5 md:p-6">
              <h2 id="style" className="label-mono flex items-center gap-2 text-ink">
                <span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />
                {dict.fighters.style}
              </h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-graphite">
                {local.styleNote}
              </p>
            </section>

            {booked.length > 0 ? (
              <section aria-labelledby="booked" className="sheet p-5 md:p-6">
                <h2 id="booked" className="label-mono flex items-center gap-2 text-ink">
                  <span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />
                  {dict.fighters.upcomingBout}
                </h2>
                <div className="mt-4">
                  {booked.map((event) => (
                    <div key={event.id} className="border-t border-rule pt-4 first:border-t-0 first:pt-0">
                      <Link
                        href={routes.event(locale, event.slug)}
                        className="text-base font-medium text-ink underline decoration-ember decoration-[1.5px] underline-offset-[3px]"
                      >
                        {event.name}
                      </Link>
                      <div className="mt-2">
                        {event.bouts
                          .filter(
                            (b) =>
                              b.red.fighterRef === fighter.id ||
                              b.blue.fighterRef === fighter.id,
                          )
                          .map((bout) => (
                            <BoutRow key={bout.id} bout={bout} locale={locale} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:col-span-5 xl:col-span-4">
            <EvidenceCoverage fighter={fighter} locale={locale} />
            <SourceList sources={fighter.sources} locale={locale} />
            <div className="sheet p-5">
              <Kicker>{dict.fighters.relatedStories}</Kicker>
              {stories.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {stories.map((article) => (
                    <li
                      key={article.id}
                      className="border-t border-rule pt-3 first:border-t-0 first:pt-0"
                    >
                      <Link
                        href={routes.article(locale, article.slug)}
                        className="text-sm font-medium leading-snug text-ink underline decoration-ember decoration-[1.5px] underline-offset-[3px]"
                      >
                        {article.localizations[locale].title}
                      </Link>
                      <p className="label-mono-sm mt-1.5 text-muted">
                        {dict.formats[article.format]}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-muted">{dict.fighters.noRelated}</p>
              )}
            </div>
          </aside>
        </div>
      </Container>

      {stories.length > 0 ? (
        <section
          aria-labelledby="fighter-stories"
          className="border-t border-rule-strong bg-white py-14 md:py-20"
        >
          <Container>
            <SectionHeading title={dict.fighters.relatedStories} />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((article) => (
                <li key={article.id} className="relative">
                  <ArticleCard article={article} locale={locale} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
