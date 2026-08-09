import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/event/EventCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getCompletedEvents, getUpcomingEvents } from "@/lib/repository";
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
    path: routes.events,
    title: dict.events.title,
    description: dict.events.dek,
  });
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const upcoming = getUpcomingEvents();
  const completed = getCompletedEvents();

  return (
    <>
      <PageHeader
        crumbs={[
          { href: routes.home(locale), label: dict.nav.home },
          { label: dict.events.title },
        ]}
        kicker={`${dict.nav.events} · ${upcoming.length + completed.length}`}
        title={dict.events.title}
        dek={dict.events.dek}
      />

      <Container className="py-10 md:py-14">
        {upcoming.length + completed.length === 0 ? (
          <p className="sheet px-5 py-10 text-center text-sm text-ink-muted">
            {dict.events.empty}
          </p>
        ) : null}

        {upcoming.length > 0 ? (
          <section aria-labelledby="events-upcoming">
            <SectionHeading title={dict.fightWeek.upcoming} />
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <li key={event.id} className="content-auto relative">
                  <EventCard event={event} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {completed.length > 0 ? (
          <section aria-labelledby="events-completed" className="mt-16">
            <SectionHeading title={dict.eventStatus.completed} />
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {completed.map((event) => (
                <li key={event.id} className="content-auto relative">
                  <EventCard event={event} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
