import { ArticleGrid } from "@/components/article/ArticleCard";
import { EventCard } from "@/components/event/EventCard";
import { FighterCard } from "@/components/fighter/FighterCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionLink, Container, SectionHeading } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import {
  getArticlesByOrganization,
  getEventsByOrganization,
  getFightersByOrganization,
} from "@/lib/repository";
import type { Locale, Organization } from "@/lib/types";

/** One layout for UFC, Oktagon and KSW — the three routes are thin wrappers. */
export function OrganizationPage({
  locale,
  organization,
}: {
  locale: Locale;
  organization: Organization;
}) {
  const dict = getDictionary(locale);
  const articles = getArticlesByOrganization(organization);
  const events = getEventsByOrganization(organization);
  const fighters = getFightersByOrganization(organization);
  const now = Date.now();
  const upcoming = events.filter(
    (e) => e.status !== "completed" && new Date(e.startsAt).getTime() >= now,
  );

  return (
    <>
      <PageHeader
        crumbs={[
          { href: routes.home(locale), label: dict.nav.home },
          { label: dict.organizationsShort[organization] },
        ]}
        kicker={dict.labels.promotion}
        title={dict.organizations[organization]}
        dek={dict.organizationPage.dek}
      />

      {upcoming.length > 0 ? (
        <section
          aria-labelledby="org-upcoming"
          className="border-b border-rule-strong bg-white py-12 md:py-16"
        >
          <Container>
            <SectionHeading
              title={dict.organizationPage.upcoming}
              action={
                <ActionLink href={routes.fightWeek(locale)}>
                  {dict.nav.fightWeek}
                </ActionLink>
              }
            />
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <li key={event.id} className="relative">
                  <EventCard event={event} locale={locale} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section aria-labelledby="org-stories" className="py-12 md:py-16">
        <Container>
          <SectionHeading
            title={dict.organizationPage.stories}
            action={
              <ActionLink href={routes.latest(locale)}>
                {dict.actions.allStories}
              </ActionLink>
            }
          />
          <div className="mt-8">
            <ArticleGrid
              articles={articles}
              locale={locale}
              emptyLabel={dict.organizationPage.empty}
            />
          </div>
        </Container>
      </section>

      {fighters.length > 0 ? (
        <section
          aria-labelledby="org-fighters"
          className="border-t border-rule-strong bg-white py-12 md:py-16"
        >
          <Container>
            <SectionHeading
              title={dict.fighters.title}
              dek={dict.fighters.dek}
              action={
                <ActionLink href={routes.fighters(locale)}>
                  {dict.actions.exploreFighters}
                </ActionLink>
              }
            />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {fighters.map((fighter) => (
                <li key={fighter.id} className="relative">
                  <FighterCard fighter={fighter} locale={locale} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
