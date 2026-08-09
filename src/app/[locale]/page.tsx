import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { LeadStory } from "@/components/article/LeadStory";
import { WeeklyArticleFeed } from "@/components/article/WeeklyArticleFeed";
import { ResultsBoard } from "@/components/event/ResultsBoard";
import { PredictionBoardList } from "@/components/fightaiq/PredictionBoards";
import { FighterRail } from "@/components/fighter/FighterRail";
import { DidYouKnow } from "@/components/site/DidYouKnow";
import { NewsletterModule } from "@/components/site/NewsletterModule";
import { ActionLink, ButtonLink, Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import { getArticles, getLeadArticle } from "@/lib/repository";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function HomeHeading({
  id,
  title,
  note,
  action,
  tone = "paper",
}: {
  id: string;
  title: string;
  note?: string;
  action?: React.ReactNode;
  tone?: "paper" | "chrome";
}) {
  const chrome = tone === "chrome";
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2
          id={id}
          className={`display inline-block border-b-[3px] border-accent pb-2 text-[length:var(--text-d4)] ${chrome ? "text-text-inverse" : "text-text"}`}
        >
          {title}
        </h2>
        {note ? (
          <p className={`mt-3 font-mono text-[11px] ${chrome ? "text-text-inverse-meta" : "text-text-meta"}`}>
            {note}
          </p>
        ) : null}
      </div>
      {action}
    </header>
  );
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

  return (
    <>
      {lead?.packageHash ? <meta name="boardless-content-hash" content={lead.packageHash} /> : null}
      <AdSlot name="masthead-billboard" locale={locale} />

      {lead ? (
        <LeadStory article={lead} locale={locale} secondary={articles.slice(1, 3)} />
      ) : (
        <Container className="py-20">
          <p className="text-lg text-text-muted">{dict.home.noLead}</p>
        </Container>
      )}

      <section aria-labelledby="latest-home" className="border-b border-rule-strong py-12 md:py-16">
        <Container>
          <HomeHeading
            id="latest-home"
            title={dict.home.latestTitle}
            note={dict.home.latestDek}
            action={<ActionLink href={routes.latest(locale)}>{dict.actions.allStories}</ActionLink>}
          />
          <div className="mt-6">
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

      <section aria-labelledby="predictions-home" className="bg-chrome py-12 text-text-inverse md:py-16">
        <Container>
          <HomeHeading
            id="predictions-home"
            title={dict.home.predictionsTitle}
            note={dict.predictions.disclaimer}
            tone="chrome"
          />
          <div className="mt-9">
            <PredictionBoardList locale={locale} limit={4} />
          </div>
          <div className="mt-10">
            <ButtonLink href={routes.predictions(locale)} variant="secondary" tone="chrome">
              {dict.actions.openPredictions}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-labelledby="results-home" className="border-b border-rule-strong bg-paper py-12 md:py-16">
        <Container>
          <HomeHeading
            id="results-home"
            title={dict.home.resultsTitle}
            note={dict.home.resultsDek}
            action={<ActionLink href={routes.results(locale)}>{dict.actions.allResults}</ActionLink>}
          />
          <ResultsBoard locale={locale} />
        </Container>
      </section>

      <DidYouKnow dateKey={lead?.publishAt.slice(0, 10)} locale={locale} />

      <section aria-labelledby="fighters-home" className="border-b border-rule-strong py-12 md:py-16">
        <Container>
          <HomeHeading
            id="fighters-home"
            title={dict.home.fightersTitle}
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
