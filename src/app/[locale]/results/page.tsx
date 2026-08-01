import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoutRow } from "@/components/event/EventCard";
import { DemoNotice } from "@/components/site/HomeModules";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionLink, Chip, Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { countryName, formatDateTime } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getCompletedEvents } from "@/lib/repository";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: routes.results,
    title: dict.results.title,
    description: dict.results.dek,
  });
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const events = getCompletedEvents();
  const hasDemo = events.some((e) => e.isDemo);

  return (
    <>
      <PageHeader
        crumbs={[
          { href: routes.home(locale), label: dict.nav.home },
          { label: dict.results.title },
        ]}
        kicker={dict.nav.events}
        title={dict.results.title}
        dek={dict.results.dek}
      />

      <Container className="py-10 md:py-14">
        {hasDemo ? (
          <div className="mb-8">
            <DemoNotice locale={locale} variant="data" />
          </div>
        ) : null}

        {events.length === 0 ? (
          <p className="sheet px-5 py-10 text-center text-sm text-ink-muted">
            {dict.results.empty}
          </p>
        ) : (
          <div className="space-y-8">
            {events.map((event) => (
              <section
                key={event.id}
                aria-labelledby={`event-${event.slug}`}
                className="sheet p-5 md:p-7"
              >
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                  <Chip tone="dark">{dict.organizationsShort[event.organization]}</Chip>
                  <Chip tone="muted">{dict.eventStatus[event.status]}</Chip>
                </div>

                <h2
                  id={`event-${event.slug}`}
                  className="mt-4 text-xl tracking-[-0.03em] text-ink md:text-2xl"
                >
                  <Link
                    href={routes.event(locale, event.slug)}
                    className="headline-link"
                  >
                    {event.name}
                  </Link>
                </h2>

                <p className="label-mono-sm mt-3 text-ink-muted">
                  {formatDateTime(event.startsAt, locale, event.timeZone)}
                </p>
                <p className="mt-1.5 text-sm text-ink-muted">
                  {event.venue ? `${event.venue}, ` : ""}
                  {event.city}, {countryName(event.country, dict)}
                </p>

                <div className="mt-6 border-t border-rule-strong pt-4">
                  {event.bouts.map((bout) => (
                    <BoutRow key={bout.id} bout={bout} locale={locale} />
                  ))}
                </div>

                <div className="mt-6">
                  <ActionLink href={routes.event(locale, event.slug)}>
                    {dict.actions.viewEvent}
                  </ActionLink>
                </div>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
