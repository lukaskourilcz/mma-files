import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { LeadStory } from "@/components/article/LeadStory";
import { WeeklyArticleFeed } from "@/components/article/WeeklyArticleFeed";
import { ActionLink, ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import { getPredictionCopy } from "@/lib/prediction-copy";
import { getArticles, getFighters, getLeadArticle, getUpcomingEvents } from "@/lib/repository";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

const HomepagePredictions = dynamic(() =>
  import("@/components/fightaiq/HomepagePredictions").then((module) => module.HomepagePredictions));
const ResultsBoard = dynamic(() =>
  import("@/components/event/ResultsBoard").then((module) => module.ResultsBoard));
const FighterRail = dynamic(() =>
  import("@/components/fighter/FighterRail").then((module) => module.FighterRail));
const DidYouKnow = dynamic(() =>
  import("@/components/site/DidYouKnow").then((module) => module.DidYouKnow));
const NewsletterModule = dynamic(() =>
  import("@/components/site/DeferredNewsletter").then((module) => module.DeferredNewsletter));
const EventBelt = dynamic(() =>
  import("@/components/event/EventBelt").then((module) => module.EventBelt));

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const articles = getArticles();
  const lead = getLeadArticle();
  const latest = articles.filter((article) => article.slug !== lead?.slug);
  const upcoming = getUpcomingEvents(new Date()).slice(0, 6);
  const fighterFiles = getFighters().length;

  return (
    <>
      {lead?.packageHash ? <meta name="boardless-content-hash" content={lead.packageHash} /> : null}

      {lead ? (
        <LeadStory article={lead} locale={locale} secondary={articles.slice(1, 3)} />
      ) : (
        <Container className="py-20">
          <p className="text-lg text-text-muted">{dict.home.noLead}</p>
        </Container>
      )}

      {/* The billboard sits under the cover story, not over it: the front page
        * opens on the magazine rather than on an empty ad frame. */}
      <AdSlot name="masthead-billboard" locale={locale} />

      <EventBelt events={upcoming} locale={locale} />

      <section aria-labelledby="latest-home" className="border-b border-rule-strong bg-paper py-12 md:py-16">
        <Container>
          <SectionHeading
            id="latest-home"
            title={dict.home.latestTitle}
            dek={dict.home.latestDek}
            action={<ActionLink href={routes.latest(locale)}>{dict.actions.allStories}</ActionLink>}
          />
          <div className="mt-8">
            <WeeklyArticleFeed
              articles={latest}
              locale={locale}
              emptyLabel={dict.home.noStories}
              anchor={lead?.publishAt}
              blockLimit={7}
            />
          </div>
        </Container>
      </section>

      <section aria-labelledby="predictions-home" className="bg-chrome py-14 text-text-inverse md:py-20">
        <Container>
          <SectionHeading
            id="predictions-home"
            kicker={dict.home.dataTitle}
            title={dict.home.predictionsTitle}
            note={dict.predictions.disclaimer}
            tone="paper"
          />
          <div className="mt-9">
            <HomepagePredictions
              limit={4}
              copy={getPredictionCopy(locale)}
              loadingLabel={dict.states.loading}
            />
          </div>
          <div className="mt-10">
            <ButtonLink href={routes.predictions(locale)} variant="secondary" tone="chrome">
              {dict.actions.openPredictions}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-labelledby="results-home" className="border-b border-rule-strong bg-card py-10 md:py-14">
        <Container>
          <SectionHeading
            id="results-home"
            title={dict.home.resultsTitle}
            dek={dict.home.resultsDek}
            action={<ActionLink href={routes.results(locale)}>{dict.actions.allResults}</ActionLink>}
          />
          <ResultsBoard locale={locale} />
        </Container>
      </section>

      <DidYouKnow dateKey={lead?.publishAt.slice(0, 10)} locale={locale} />

      <section aria-labelledby="fighters-home" className="border-b border-rule-strong bg-well py-10 md:py-12">
        <Container>
          <SectionHeading
            id="fighters-home"
            title={dict.home.fightersTitle}
            dek={dict.home.rosterDek(fighterFiles)}
            action={<ActionLink href={routes.fighters(locale)}>{dict.actions.allFighters}</ActionLink>}
          />
          <FighterRail locale={locale} />
        </Container>
      </section>

      <NewsletterModule copy={dict.newsletter} />
      <AdSlot name="footer-billboard" locale={locale} />
    </>
  );
}
