import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/ArticleCard";
import { SourceList } from "@/components/article/ArticleFile";
import { BoutRow } from "@/components/event/EventCard";
import { FighterPortrait } from "@/components/fighter/FighterCard";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { Chip, Container, Kicker, SectionHeading } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { ageFrom, countryName, formatHeight } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import {
  getArticlesByFighter,
  getEventsForFighter,
  getFighterById,
  getFighterBySlug,
  getFighters,
} from "@/lib/repository";
import { LOCALES, isLocale, isOrganization, type Fighter, type Locale } from "@/lib/types";

/** Values in [0,1] read as a proportion and get a bar; the rest are figures. */
const SHARE_KEYS = new Set([
  "finishRate",
  "koTkoWinShare",
  "submissionWinShare",
  "decisionWinShare",
  "recentThreeWinRate",
  "recentFiveWinRate",
]);

function statValue(key: string, value: number): string {
  if (SHARE_KEYS.has(key)) return `${Math.round(value * 100)} %`;
  if (key === "averageElapsedSeconds") {
    return `${Math.floor(value / 60)}:${String(Math.round(value % 60)).padStart(2, "0")}`;
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
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

/** WINS / LOSSES / DRAWS — only the cells the delivered record actually has. */
function RecordStrip({ fighter, locale }: { fighter: Fighter; locale: Locale }) {
  const dict = getDictionary(locale);
  const record = fighter.record;
  if (!record) {
    return (
      <p className="label-mono mt-8 text-text-inverse-meta">{dict.fighters.recordUnavailable}</p>
    );
  }
  const cells = [
    { label: dict.fighterRecord.wins, value: record.wins },
    { label: dict.fighterRecord.losses, value: record.losses },
    { label: dict.fighterRecord.draws, value: record.draws },
    ...(record.noContests ? [{ label: dict.fighterRecord.noContests, value: record.noContests }] : []),
  ];

  return (
    <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-rule-dark pt-5">
      {cells.map((cell) => (
        <div key={cell.label}>
          <dd className="font-mono text-[length:var(--text-d4)] leading-none tabular-nums text-text-inverse">
            {cell.value}
          </dd>
          <dt className="label-mono-sm mt-2 text-text-inverse-meta">{cell.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/**
 * Stance, age, height, reach, team.
 *
 * A field with no delivered value is absent. A field the delivery grades
 * `disputed` or `provisional` still appears — it is sourced — but carries that
 * grade beside it, because "25,4 cm" set as plain fact is worse than no height
 * at all.
 */
function TapeRow({ fighter, locale }: { fighter: Fighter; locale: Locale }) {
  const dict = getDictionary(locale);
  const rows = ([
    ["stance", dict.fighterFields.stance, fighter.stance ? dict.stances[fighter.stance] : null],
    ["dateOfBirth", dict.fighterFields.dateOfBirth, fighter.dateOfBirth ? String(ageFrom(fighter.dateOfBirth)) : null],
    ["heightCm", dict.fighterFields.heightCm, fighter.heightCm ? formatHeight(fighter.heightCm, locale) : null],
    ["reachCm", dict.fighterFields.reachCm, fighter.reachCm ? `${fighter.reachCm} cm` : null],
    ["team", dict.fighterFields.team, fighter.team ?? null],
  ] as const)
    .map(([field, label, value]) => ({ field, label, value, state: fighter.fieldStates[field] }))
    .filter((row): row is typeof row & { value: string } => Boolean(row.value));
  if (rows.length === 0) return null;

  return (
    <dl
      aria-label={dict.fighters.tape}
      className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-rule-dark pt-5"
    >
      {rows.map((row) => (
        <div key={row.label} className="max-w-full">
          <dt className="label-mono-sm text-text-inverse-meta">{row.label}</dt>
          <dd className="mt-1.5 font-mono text-[length:var(--text-mono-md)] text-text-inverse">
            {row.value}
            {row.state === "disputed" || row.state === "provisional" ? (
              <span className="label-mono-sm ml-2 border border-rule-dark px-1.5 py-0.5 align-middle text-accent-on-dark">
                {dict.fieldStates[row.state]}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A labelled bar for proportions, a figure for everything else. */
function StatBar({ label, share, display }: { label: string; share?: number; display: string }) {
  return (
    <div className="border-t border-rule pt-3">
      <div className="flex items-baseline justify-between gap-4">
        <span className="label-mono-sm text-text-meta">{label}</span>
        <span className="font-mono text-[length:var(--text-mono-md)] tabular-nums text-text">
          {display}
        </span>
      </div>
      {share === undefined ? null : (
        <span aria-hidden="true" className="mt-2 block h-1.5 w-full bg-rule">
          <span className="block h-full bg-accent" style={{ width: `${Math.round(share * 100)}%` }} />
        </span>
      )}
    </div>
  );
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
  const profile = file?.statsProfiles[0];

  return (
    <>
      {/* Fight-night graphic: portrait on chrome, weight-class kicker, the
        * name at poster size, then the record and the tape. */}
      <header className="border-b border-rule-dark bg-chrome text-text-inverse">
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

          <div className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)] sm:gap-10 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-14">
            <FighterPortrait fighter={fighter} locale={locale} />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Kicker tone="paper">{dict.divisions[fighter.division]}</Kicker>
                <span aria-hidden="true" className="h-3 w-px bg-rule-dark" />
                <span className="label-mono text-text-inverse-meta">
                  {dict.organizations[fighter.organization]}
                </span>
                {fighter.country ? (
                  <>
                    <span aria-hidden="true" className="h-3 w-px bg-rule-dark" />
                    <span className="label-mono text-text-inverse-meta">
                      {countryName(fighter.country, dict)}
                    </span>
                  </>
                ) : null}
                {fighter.isDemo ? <Chip tone="signal">{dict.demo.articleBadge}</Chip> : null}
              </div>

              <h1 className="display mt-4 text-[length:var(--text-d1)] text-text-inverse">
                {fighter.name}
              </h1>
              {fighter.nickname ? (
                <p className="label-mono mt-3 text-accent-on-dark">“{fighter.nickname}”</p>
              ) : null}

              <RecordStrip fighter={fighter} locale={locale} />
              <TapeRow fighter={fighter} locale={locale} />
            </div>
          </div>

          <p className="mt-10 max-w-[68ch] text-[length:var(--text-base)] leading-relaxed text-text-inverse-muted">
            {local.summary}
          </p>
        </Container>
      </header>

      <Container className="py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-8 lg:col-span-7 xl:col-span-8">
            <section aria-labelledby="style" className="sheet p-5 md:p-6">
              <h2 id="style" className="label-mono flex items-center gap-2 text-text">
                <span aria-hidden="true" className="block h-[2px] w-4 bg-accent" />
                {dict.fighters.style}
              </h2>
              <p className="mt-4 text-[length:var(--text-base)] leading-relaxed text-text-muted">
                {local.styleNote}
              </p>
            </section>

            <section aria-labelledby="derived-stats" className="sheet p-5 md:p-6">
              <h2 id="derived-stats" className="label-mono flex items-center gap-2 text-text">
                <span aria-hidden="true" className="block h-[2px] w-4 bg-accent" />
                {dict.fighters.derivedStats}
              </h2>
              {profile ? (
                <>
                  <p className="mt-3 text-sm text-text-muted">
                    {dict.fighters.derivedFrom(profile.bouts)}
                  </p>
                  <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {Object.entries(profile.values).map(([key, value]) => {
                      if (value === null) return null;
                      const label = dict.fighterStats[key as keyof typeof dict.fighterStats]
                        ?? key.replaceAll(/([A-Z])/gu, " $1").toLowerCase();
                      return (
                        <StatBar
                          key={key}
                          label={label}
                          {...(SHARE_KEYS.has(key) ? { share: value } : {})}
                          display={statValue(key, value)}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm text-text-muted">{dict.fighters.noDerivedStats}</p>
              )}
            </section>

            <section aria-labelledby="recorded-history" className="sheet p-5 md:p-6">
              <h2 id="recorded-history" className="label-mono flex items-center gap-2 text-text">
                <span aria-hidden="true" className="block h-[2px] w-4 bg-accent" />
                {dict.fighters.recordedHistory}
              </h2>
              {file?.history.length ? (
                <ol className="mt-4 divide-y divide-rule">
                  {[...file.history].reverse().slice(0, 10).map((bout) => {
                    const opponent = getFighterById(`fighter:${bout.opponentRef.replace(":", "/")}`);
                    return (
                      <li
                        key={bout.boutRef}
                        className="grid gap-2 py-3 first:pt-0 sm:grid-cols-[6rem_1fr_auto] sm:items-center"
                      >
                        <time className="label-mono-sm text-text-meta" dateTime={bout.happenedAt}>
                          {new Intl.DateTimeFormat(dict.meta.dateLocale, { dateStyle: "medium" })
                            .format(new Date(bout.happenedAt))}
                        </time>
                        <span className="text-sm text-text">
                          {opponent ? (
                            <Link
                              className="font-medium underline decoration-accent underline-offset-[3px]"
                              href={routes.fighter(locale, opponent.organization, opponent.slug)}
                            >
                              {opponent.name}
                            </Link>
                          ) : (
                            bout.opponentRef
                          )}
                        </span>
                        <span className="label-mono-sm text-text-meta">
                          {dict.fighterResults[bout.result]}
                          {bout.method ? ` · ${dict.methodText(bout.method)}` : ""}
                          {bout.round ? ` · R${bout.round}` : ""}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="mt-4 text-sm text-text-muted">{dict.fighters.noRecordedHistory}</p>
              )}
            </section>

            {booked.length > 0 ? (
              <section aria-labelledby="booked" className="sheet p-5 md:p-6">
                <h2 id="booked" className="label-mono flex items-center gap-2 text-text">
                  <span aria-hidden="true" className="block h-[2px] w-4 bg-accent" />
                  {dict.fighters.upcomingBout}
                </h2>
                <div className="mt-4">
                  {booked.map((event) => (
                    <div key={event.id} className="border-t border-rule pt-4 first:border-t-0 first:pt-0">
                      <Link
                        href={routes.event(locale, event.slug)}
                        className="text-base font-medium text-text underline decoration-accent decoration-[1.5px] underline-offset-[3px]"
                      >
                        {event.name}
                      </Link>
                      <div className="mt-2">
                        {event.bouts
                          .filter((b) =>
                            b.red.fighterRef === fighter.id || b.blue.fighterRef === fighter.id)
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
            <div className="sheet p-5">
              <Kicker>{dict.fighters.ratingTitle}</Kicker>
              {file ? (
                <dl className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <dt className="label-mono-sm text-text-meta">{dict.fighters.rating}</dt>
                    <dd className="mt-1 font-mono text-2xl tabular-nums text-text">
                      {Math.round(file.rating.rating)}
                    </dd>
                  </div>
                  <div>
                    <dt className="label-mono-sm text-text-meta">{dict.fighters.deviation}</dt>
                    <dd className="mt-1 font-mono text-2xl tabular-nums text-text">
                      ±{Math.round(file.rating.deviation)}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-3 text-sm text-text-muted">{dict.fighters.ratingUnavailable}</p>
              )}
              <p className="mt-4 text-xs leading-relaxed text-text-muted">{dict.fighters.ratingNote}</p>
            </div>

            {file?.gaps.length ? (
              <div className="sheet p-5">
                <Kicker>{dict.fighters.gapsTitle}</Kicker>
                <ul className="mt-3 space-y-2 text-sm text-text-muted">
                  {file.gaps.map((gap) => (
                    <li key={gap}>
                      • {dict.fighterGaps[gap as keyof typeof dict.fighterGaps] ?? gap.replaceAll("-", " ")}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <SourceList sources={fighter.sources} locale={locale} />
          </aside>
        </div>
      </Container>

      {stories.length > 0 ? (
        <section
          aria-labelledby="fighter-stories"
          className="border-t border-rule-strong bg-card py-14 md:py-20"
        >
          <Container>
            <SectionHeading id="fighter-stories" title={dict.fighters.relatedStories} />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((article) => (
                <li key={article.id} className="relative">
                  <ArticleCard article={article} locale={locale} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : (
        <Container className="pb-14">
          <p className="sheet px-5 py-8 text-sm leading-relaxed text-text-muted">
            {dict.fighters.noRelated}
          </p>
        </Container>
      )}
    </>
  );
}
