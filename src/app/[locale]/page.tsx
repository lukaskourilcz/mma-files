import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleCard } from "@/components/article/ArticleCard";
import { LeadStory } from "@/components/article/LeadStory";
import { EventCard } from "@/components/event/EventCard";
import { ResultsBoard } from "@/components/event/ResultsBoard";
import { DidYouKnow } from "@/components/site/DidYouKnow";
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
  const files = getArticles().filter((a) => a.slug !== lead?.slug).slice(0, 6);

  // If no card is booked, show the most recent completed one rather than an
  // empty strip — the section is about what is real, not about being full.
  const upcoming = getUpcomingEvents();
  const cards = upcoming.length > 0 ? upcoming.slice(0, 2) : getCompletedEvents().slice(0, 1);

  return (
    <>
      {lead?.packageHash ? <meta name="boardless-content-hash" content={lead.packageHash} /> : null}
      <AdSlot name="masthead-billboard" locale={locale} />
      {/* Above the hero: on a phone the lead fills the first screen, so a belt
          underneath it would never be seen. The date comes from the lead
          article, mirroring how every other section is handed its data. */}
      <DidYouKnow dateKey={lead?.publishAt.slice(0, 10)} locale={locale} />
      {lead ? (
        <LeadStory article={lead} locale={locale} />
      ) : (
        <Container className="py-20">
          <p className="text-lg text-ink-muted">{dict.home.noLead}</p>
        </Container>
      )}

      <section
        aria-labelledby="results"
        className="border-b border-rule-strong bg-card"
      >
        <Container className="py-10 md:py-12">
          <SectionHeading
            id="results"
            title={dict.home.resultsTitle}
            note={dict.home.resultsDek}
            action={
              <ActionLink href={routes.results(locale)}>
                {dict.actions.allResults}
              </ActionLink>
            }
          />
          <ResultsBoard locale={locale} />
        </Container>
      </section>

      <section aria-labelledby="next-up" className="border-b border-rule-strong">
        <Container className="py-11 md:py-13">
          <SectionHeading
            id="next-up"
            title={dict.home.fightWeekTitle}
            note={dict.home.fightWeekDek}
            action={
              <ActionLink href={routes.fightWeek(locale)}>
                {dict.nav.fightWeek}
              </ActionLink>
            }
          />

          {upcoming.length === 0 ? (
            <p className="mt-6 text-sm leading-relaxed text-ink-muted">
              {dict.fightWeek.noUpcoming}
            </p>
          ) : null}

          <ul className="mt-5 grid gap-5 lg:grid-cols-2">
            {cards.map((event) => (
              <li key={event.id} className="relative">
                <EventCard event={event} locale={locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="files"
        className="border-b border-rule-strong bg-card"
      >
        <Container className="py-11 md:py-13">
          <SectionHeading
            id="files"
            title={dict.home.latestTitle}
            note={dict.home.latestDek}
            action={
              <ActionLink href={routes.latest(locale)}>
                {dict.actions.allStories}
              </ActionLink>
            }
          />

          {files.length === 0 ? (
            <p className="mt-6 text-sm leading-relaxed text-ink-muted">
              {dict.home.noStories}
            </p>
          ) : (
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((article) => (
                <li key={article.id} className="relative">
                  <ArticleCard article={article} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <NewsletterModule copy={dict.newsletter} />
      <AdSlot name="footer-billboard" locale={locale} />
    </>
  );
}
