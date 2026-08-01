import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/article/ArticleCard";
import { LeadStory } from "@/components/article/LeadStory";
import { EventCard } from "@/components/event/EventCard";
import { DataDeskModule, TransparencyBlock } from "@/components/site/HomeModules";
import { NewsletterModule } from "@/components/site/NewsletterModule";
import { ActionLink, Container, SectionHeading } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import {
  getArticles,
  getCompletedEvents,
  getLeadArticle,
  getUpcomingEvents,
} from "@/lib/repository";
import { isLocale, type Locale } from "@/lib/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const lead = getLeadArticle();
  const latest = getArticles().filter((a) => a.slug !== lead?.slug).slice(0, 6);

  // If no card is booked, show the most recent completed one rather than an
  // empty strip — the section is about what is real, not about being full.
  const upcoming = getUpcomingEvents();
  const events = upcoming.length > 0 ? upcoming.slice(0, 3) : getCompletedEvents().slice(0, 1);

  return (
    <>
      {lead ? (
        <LeadStory article={lead} locale={locale} />
      ) : (
        <Container className="py-20">
          <p className="text-lg text-ink-muted">{dict.home.noLead}</p>
        </Container>
      )}

      <section aria-labelledby="latest-files" className="py-14 md:py-20">
        <Container>
          <SectionHeading
            kicker={dict.labels.file}
            title={dict.home.latestTitle}
            dek={dict.home.latestDek}
            action={
              <ActionLink href={routes.latest(locale)}>
                {dict.actions.allStories}
              </ActionLink>
            }
          />
          <div className="mt-8">
            <ArticleGrid
              articles={latest}
              locale={locale}
              emptyLabel={dict.home.noStories}
            />
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="fight-week"
        className="border-y border-rule-strong bg-white py-14 md:py-20"
      >
        <Container>
          <SectionHeading
            kicker={dict.nav.fightWeek}
            title={dict.home.fightWeekTitle}
            dek={dict.home.fightWeekDek}
            action={
              <ActionLink href={routes.fightWeek(locale)}>
                {dict.nav.fightWeek}
              </ActionLink>
            }
          />

          {upcoming.length === 0 ? (
            <p className="mt-8 text-sm leading-relaxed text-ink-muted">
              {dict.fightWeek.noUpcoming}
            </p>
          ) : null}

          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <li key={event.id} className="relative">
                <EventCard event={event} locale={locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <DataDeskModule locale={locale} />
      <TransparencyBlock locale={locale} />
      <NewsletterModule copy={dict.newsletter} />
    </>
  );
}
