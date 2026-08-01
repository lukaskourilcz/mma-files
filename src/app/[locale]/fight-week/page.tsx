import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/event/EventCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionLink, Container, SectionHeading } from "@/components/ui/primitives";
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
    path: routes.fightWeek,
    title: dict.fightWeek.title,
    description: dict.fightWeek.dek,
  });
}

export default async function FightWeekPage({
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
          { label: dict.fightWeek.title },
        ]}
        kicker={dict.nav.events}
        title={dict.fightWeek.title}
        dek={dict.fightWeek.dek}
      />

      <Container className="py-10 md:py-14">
        {upcoming.length > 0 ? (
          <section aria-labelledby="booked">
            <SectionHeading
              title={dict.fightWeek.upcoming}
              action={
                <ActionLink href={routes.events(locale)}>{dict.nav.events}</ActionLink>
              }
            />
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <li key={event.id} className="relative">
                  <EventCard event={event} locale={locale} showBouts={3} />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="sheet px-5 py-8 text-sm leading-relaxed text-ink-muted">
            {dict.fightWeek.noUpcoming}
          </p>
        )}

        {completed.length > 0 ? (
          <section aria-labelledby="recent" className="mt-16">
            <SectionHeading
              title={dict.fightWeek.recent}
              action={
                <ActionLink href={routes.results(locale)}>
                  {dict.actions.viewResults}
                </ActionLink>
              }
            />
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {completed.slice(0, 3).map((event) => (
                <li key={event.id} className="relative">
                  <EventCard event={event} locale={locale} showBouts={2} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
