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
import { articleTitle, getArticlesByFighter, getEventsForFighter, getFighterById, getFighterBySlug, getFighters } from "@/lib/repository";
import { LOCALES, isLocale, isOrganization, type Locale } from "@/lib/types";

const resultLabels = {
  en: { win: "win", loss: "loss", draw: "draw", "no-contest": "no contest" },
  cs: { win: "výhra", loss: "prohra", draw: "remíza", "no-contest": "bez výsledku" },
} as const;

const statLabels: Record<string, { en: string; cs: string }> = {
  bouts: { en: "Fights", cs: "Zápasy" },
  wins: { en: "Wins", cs: "Výhry" },
  losses: { en: "Losses", cs: "Prohry" },
  draws: { en: "Draws", cs: "Remízy" },
  noContests: { en: "No contests", cs: "Bez výsledku" },
  finishRate: { en: "Wins before the final bell", cs: "Výhry před limitem" },
  koTkoWins: { en: "KO/TKO wins", cs: "Výhry KO/TKO" },
  submissionWins: { en: "Submission wins", cs: "Výhry na submisi" },
  decisionWins: { en: "Decision wins", cs: "Výhry na body" },
  koTkoWinShare: { en: "Share of wins by KO/TKO", cs: "Podíl výher KO/TKO" },
  submissionWinShare: { en: "Share of wins by submission", cs: "Podíl výher na submisi" },
  decisionWinShare: { en: "Share of wins by decision", cs: "Podíl výher na body" },
  averageElapsedSeconds: { en: "Average fight time", cs: "Průměrná délka zápasu" },
  recentThreeWinRate: { en: "Wins in the last 3", cs: "Úspěšnost v posledních 3" },
  recentFiveWinRate: { en: "Wins in the last 5", cs: "Úspěšnost v posledních 5" },
  fightsPerYear: { en: "Fights per year", cs: "Zápasů za rok" },
  layoffDays: { en: "Days since last fight", cs: "Dnů od posledního zápasu" },
};

const gapLabels: Record<string, { en: string; cs: string }> = {
  stance: { en: "Stance", cs: "Postoj" },
  division: { en: "Current division", cs: "Aktuální váha" },
  record: { en: "Overall record", cs: "Celková bilance" },
  "record-history-mismatch": { en: "Overall record differs from parsed history", cs: "Celková bilance se liší od zpracované historie" },
};

function statValue(key: string, value: number | null): string {
  if (value === null) return "—";
  if (key.toLowerCase().includes("rate") || key.endsWith("Share")) return `${Math.round(value * 100)}%`;
  if (key === "averageElapsedSeconds") return `${Math.floor(value / 60)}:${String(Math.round(value % 60)).padStart(2, "0")}`;
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function methodLabel(method: string): string {
  return method
    .replace(/^Technical Submission/iu, "technická submise")
    .replace(/^Submission/iu, "submise")
    .replace(/^Technical Decision/iu, "technické rozhodnutí")
    .replace(/^Decision/iu, "rozhodnutí")
    .replace(/unanimous/giu, "jednomyslně")
    .replace(/split/giu, "děleně")
    .replace(/majority/giu, "většinově");
}

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
  const file = fighter.fightFile;

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

            <section aria-labelledby="recorded-history" className="sheet p-5 md:p-6">
              <h2 id="recorded-history" className="label-mono flex items-center gap-2 text-ink"><span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />{locale === "cs" ? "Doložené zápasy" : "Recorded fight history"}</h2>
              {file?.history.length ? <ol className="mt-4 divide-y divide-rule">{[...file.history].reverse().slice(0, 10).map((bout) => {
                const opponent = getFighterById(`fighter:${bout.opponentRef.replace(":", "/")}`);
                return <li className="grid gap-2 py-3 first:pt-0 sm:grid-cols-[6rem_1fr_auto] sm:items-center" key={bout.boutRef}><time className="label-mono-sm text-ink-meta" dateTime={bout.happenedAt}>{new Intl.DateTimeFormat(locale === "cs" ? "cs-CZ" : "en-GB", { dateStyle: "medium" }).format(new Date(bout.happenedAt))}</time><span className="text-sm text-ink">{opponent ? <Link className="font-medium underline decoration-ember underline-offset-[3px]" href={routes.fighter(locale, opponent.organization, opponent.slug)}>{opponent.name}</Link> : bout.opponentRef}</span><span className="label-mono-sm text-ink-meta">{resultLabels[locale][bout.result]}{bout.method ? ` · ${methodLabel(bout.method)}` : ""}{bout.round ? ` · R${bout.round}` : ""}</span></li>;
              })}</ol> : <p className="mt-4 text-sm text-ink-muted">{locale === "cs" ? "V ověřených podkladech zatím není žádný zápas." : "No verified bout history is available yet."}</p>}
            </section>

            <section aria-labelledby="derived-stats" className="sheet p-5 md:p-6">
              <h2 id="derived-stats" className="label-mono flex items-center gap-2 text-ink"><span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />{locale === "cs" ? "Odvozené statistiky" : "Derived stats"}</h2>
              {file?.statsProfiles.length ? file.statsProfiles.map((profile) => <div className="mt-4" key={profile.id}><p className="text-sm text-ink-muted">{locale === "cs" ? "Souhrn vypočítaný z doložených zápasů" : "Career totals calculated from sourced fights"} · {profile.bouts} {locale === "cs" ? "zápasů" : "fights"}</p><dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3">{Object.entries(profile.values).map(([key, value]) => <div className="bg-card p-3" key={key}><dt className="label-mono-sm text-ink-meta">{statLabels[key]?.[locale] ?? key.replaceAll(/([A-Z])/g, " $1").toLowerCase()}</dt><dd className="mt-1 font-mono text-lg text-ink">{statValue(key, value)}</dd></div>)}</dl></div>) : <p className="mt-4 text-sm text-ink-muted">{locale === "cs" ? "Výpočty čekají na doloženou historii zápasů." : "The calculations need sourced fight history."}</p>}
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
            <div className="sheet p-5"><Kicker>{locale === "cs" ? "Glicko stav" : "Glicko state"}</Kicker>{file ? <dl className="mt-4 grid grid-cols-2 gap-3"><div><dt className="label-mono-sm text-ink-meta">{locale === "cs" ? "Hodnocení" : "Rating"}</dt><dd className="mt-1 font-mono text-2xl text-ink">{Math.round(file.rating.rating)}</dd></div><div><dt className="label-mono-sm text-ink-meta">{locale === "cs" ? "Nejistota" : "Deviation"}</dt><dd className="mt-1 font-mono text-2xl text-ink">±{Math.round(file.rating.deviation)}</dd></div></dl> : <p className="mt-3 text-sm text-ink-muted">{locale === "cs" ? "Nedostupné" : "Unavailable"}</p>}<p className="mt-4 text-xs leading-relaxed text-ink-muted">{locale === "cs" ? "Jde o interní stav modelu z doložených výsledků, ne o oficiální žebříček." : "This is an internal model state built from sourced results, not an official ranking."}</p></div>
            {file?.gaps.length ? <div className="sheet p-5"><Kicker>{locale === "cs" ? "Chybějící podklady" : "Evidence gaps"}</Kicker><ul className="mt-3 space-y-2 text-sm text-ink-muted">{file.gaps.map((gap) => <li key={gap}>• {gapLabels[gap]?.[locale] ?? gap.replaceAll("-", " ")}</li>)}</ul></div> : null}
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
                        {articleTitle(article, locale)}
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
