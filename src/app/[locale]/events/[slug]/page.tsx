import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/ArticleCard";
import { SourceList } from "@/components/article/ArticleFile";
import { BoutRow } from "@/components/event/EventCard";
import { DemoNotice } from "@/components/site/HomeModules";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import {
  Chip,
  Container,
  DataRow,
  Kicker,
  SectionHeading,
} from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { countryName, formatCountdown, formatDateTime } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getArticlesByEvent, getEventBySlug, getEvents } from "@/lib/repository";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getEvents().map((event) => ({ locale, slug: event.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const event = getEventBySlug(slug);
  if (!event) return {};

  return pageMetadata({
    locale,
    path: (l) => routes.event(l, slug),
    title: event.name,
    description: event.localizations[locale].summary,
    indexable: !event.isDemo,
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const event = getEventBySlug(slug);
  if (!event) notFound();

  const local = event.localizations[locale];
  const coverage = getArticlesByEvent(event.id);
  const isPast = new Date(event.startsAt).getTime() < Date.now();

  return (
    <>
      <header className="border-b border-rule-dark bg-ink text-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs
            tone="paper"
            items={[
              { href: routes.home(locale), label: dict.nav.home },
              { href: routes.events(locale), label: dict.events.title },
              { label: event.name },
            ]}
          />

          <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <Chip tone="ember">{dict.organizations[event.organization]}</Chip>
            <Chip tone="dark">{dict.eventStatus[event.status]}</Chip>
            <span className="label-mono-sm text-muted">
              {isPast
                ? dict.fightWeek.countdownPast
                : formatCountdown(event.startsAt, locale)}
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.06] tracking-[-0.04em] text-white sm:text-[2.5rem] lg:text-[3rem]">
            {event.name}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper-muted md:text-lg">
            {local.summary}
          </p>

          <dl className="mt-8 grid max-w-3xl gap-x-10 sm:grid-cols-2">
            <DataRow label={dict.events.when} tone="paper">
              <time dateTime={event.startsAt}>
                {formatDateTime(event.startsAt, locale, event.timeZone)}
              </time>
            </DataRow>
            <DataRow label={dict.events.where} tone="paper">
              {event.venue ? `${event.venue}, ` : ""}
              {event.city}, {countryName(event.country, dict)}
            </DataRow>
          </dl>
        </Container>
      </header>

      <Container className="py-10 md:py-14">
        {event.isDemo ? (
          <div className="mb-8">
            <DemoNotice locale={locale} variant="data" />
          </div>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 xl:col-span-8">
            <section aria-labelledby="card" className="sheet p-5 md:p-7">
              <h2 id="card" className="label-mono flex items-center gap-2 text-ink">
                <span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />
                {dict.events.card}
                <span className="text-muted">({event.bouts.length})</span>
              </h2>

              <div className="mt-5">
                {event.bouts.length > 0 ? (
                  event.bouts.map((bout) => (
                    <BoutRow key={bout.id} bout={bout} locale={locale} />
                  ))
                ) : (
                  <p className="text-sm text-ink-muted">{dict.events.noBouts}</p>
                )}
              </div>

              {local.note ? (
                <p className="mt-6 border-t border-rule pt-4 text-sm leading-relaxed text-ink-muted">
                  {local.note}
                </p>
              ) : null}
            </section>
          </div>

          <aside className="space-y-6 lg:col-span-5 xl:col-span-4">
            <SourceList sources={event.sources} locale={locale} />
            <div className="sheet p-5">
              <Kicker>{dict.events.coverage}</Kicker>
              {coverage.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {coverage.map((article) => (
                    <li key={article.id} className="border-t border-rule pt-3 first:border-t-0 first:pt-0">
                      <a
                        href={routes.article(locale, article.slug)}
                        className="text-sm font-medium leading-snug text-ink underline decoration-ember decoration-[1.5px] underline-offset-[3px]"
                      >
                        {article.localizations[locale].title}
                      </a>
                      <p className="label-mono-sm mt-1.5 text-muted">
                        {dict.formats[article.format]}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-muted">{dict.events.noCoverage}</p>
              )}
            </div>
          </aside>
        </div>
      </Container>

      {coverage.length > 0 ? (
        <section
          aria-labelledby="event-stories"
          className="border-t border-rule-strong bg-white py-14 md:py-20"
        >
          <Container>
            <SectionHeading title={dict.events.coverage} />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {coverage.map((article) => (
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
