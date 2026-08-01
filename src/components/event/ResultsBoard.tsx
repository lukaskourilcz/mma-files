import Link from "next/link";
import { FighterName } from "@/components/event/EventCard";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/paths";
import { PROMOTION_ACCENT } from "@/lib/promotion";
import { getCompletedEvents, getUpcomingEvents } from "@/lib/repository";
import {
  ORGANIZATIONS,
  type Bout,
  type FightEvent,
  type Locale,
  type Organization,
} from "@/lib/types";

/** A card is dated in its own venue's zone, never in the reader's or the server's. */
function stamp(event: FightEvent, locale: Locale): string {
  return formatDate(event.startsAt, locale, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: event.timeZone,
  });
}

/** A draw or a no contest is nobody's win, so it never takes a promotion colour. */
function methodAccent(bout: Bout, accent: string): string {
  return bout.result?.winnerRef ? accent : "var(--color-gap)";
}

function ResultRow({
  bout,
  locale,
  accent,
}: {
  bout: Bout;
  locale: Locale;
  accent: string;
}) {
  const dict = getDictionary(locale);
  const result = bout.result;
  if (!result) return null;

  // A bout with no `winnerRef` — a draw, a no contest, or a result whose
  // winner has no file here — has no winner. Comparing the two undefined
  // values would silently crown the red corner.
  const winner = result.winnerRef
    ? result.winnerRef === bout.red.fighterRef
      ? bout.red.name
      : result.winnerRef === bout.blue.fighterRef
        ? bout.blue.name
        : undefined
    : undefined;
  const winnerSide = winner === bout.red.name ? bout.red : winner === bout.blue.name ? bout.blue : null;
  const loserSide = winnerSide === bout.red ? bout.blue : bout.red;

  const timing = result.round
    ? `R${result.round}${result.time ? ` · ${result.time}` : ""}`
    : `${bout.scheduledRounds} × 5:00`;

  return (
    <li className="flex items-center gap-4 border-b border-rule py-[15px]">
      <span className="label-mono-sm w-14 shrink-0 font-semibold tracking-[0.12em] text-ink-meta">
        {dict.billingShort[bout.billing]}
      </span>

      <div className="min-w-0 flex-1">
        {winner ? (
          <>
            <p className="text-base font-extrabold leading-tight text-ink">
              {winnerSide ? <FighterName name={winnerSide.name} fighterRef={winnerSide.fighterRef} locale={locale} strong /> : winner}
            </p>
            <p className="mt-[3px] text-sm font-medium leading-tight text-ink-muted">
              <span className="label-mono-sm text-ink-meta">
                {dict.results.defeated}
              </span>{" "}
              <FighterName name={loserSide.name} fighterRef={loserSide.fighterRef} locale={locale} />
            </p>
          </>
        ) : (
          /* Neither name goes first or bold: nobody won this one. */
          <p className="text-[15px] font-bold leading-tight text-ink">
            <FighterName name={bout.red.name} fighterRef={bout.red.fighterRef} locale={locale} strong />{" "}
            <span className="label-mono-sm font-normal text-ink-meta">
              {dict.results.versus}
            </span>{" "}
            <FighterName name={bout.blue.name} fighterRef={bout.blue.fighterRef} locale={locale} strong />
          </p>
        )}
      </div>

      <div className="min-w-[96px] shrink-0 text-right">
        <p
          className="display text-[28px] leading-none"
          style={{ color: methodAccent(bout, accent) }}
        >
          {dict.methodsShort[result.method]}
        </p>
        <p className="mt-1.5 font-mono text-[11px] tracking-[0.08em] text-ink-muted">
          {timing}
        </p>
      </div>
    </li>
  );
}

function UpcomingRow({ bout, locale }: { bout: Bout; locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <li className="flex items-center gap-3.5 border-b border-rule py-3.5">
      <span className="label-mono-sm w-14 shrink-0 font-semibold tracking-[0.12em] text-ink-meta">
        {dict.billingShort[bout.billing]}
      </span>
      <p className="min-w-0 flex-1 text-[15px] font-bold leading-tight text-ink">
        <FighterName name={bout.red.name} fighterRef={bout.red.fighterRef} locale={locale} strong />{" "}
        <span className="label-mono-sm font-normal text-ink-meta">
          {dict.results.versus}
        </span>{" "}
        <FighterName name={bout.blue.name} fighterRef={bout.blue.fighterRef} locale={locale} strong />
      </p>
      <span className="label-mono-sm shrink-0 text-ink-muted">
        {dict.divisions[bout.division]} · {bout.scheduledRounds} × 5:00
      </span>
    </li>
  );
}

function PromotionColumn({
  organization,
  completed,
  next,
  locale,
}: {
  organization: Organization;
  completed?: FightEvent;
  next?: FightEvent;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const accent = PROMOTION_ACCENT[organization];
  const heading = dict.organizationsShort[organization];
  const note = completed?.localizations[locale].note ?? completed?.localizations[locale].summary;

  return (
    <div>
      <div
        className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pb-2.5"
        style={{ borderBottom: `3px solid ${accent}` }}
      >
        <h3 className="display text-[24px] leading-none" style={{ color: accent }}>
          {heading}
        </h3>
        <span className="label-mono-sm font-semibold tracking-[0.14em] text-ink">
          {completed ? completed.name : dict.home.noCardCompleted}
        </span>
        <span className="label-mono-sm ml-auto tracking-[0.14em] text-ink-meta">
          {completed
            ? `${completed.city} · ${stamp(completed, locale)}`
            : next
              ? `${dict.home.nextCard}: ${stamp(next, locale)}`
              : null}
        </span>
      </div>

      {completed ? (
        <>
          <ul>
            {completed.bouts.map((bout) => (
              <ResultRow key={bout.id} bout={bout} locale={locale} accent={accent} />
            ))}
          </ul>
          {note ? (
            <p className="mt-3.5 text-[13px] leading-relaxed text-ink-muted">{note}</p>
          ) : null}
        </>
      ) : (
        /*
         * No completed card exists for this promotion. The column says so and
         * stays empty rather than being padded with a card nobody has sourced;
         * it fills itself the moment a completed event lands in the content.
         */
        <>
          <div className="mt-4.5 border border-dashed border-rule-strong bg-card px-6 py-6">
            <p className="label-mono-sm font-semibold tracking-[0.18em] text-ink-meta">
              {dict.home.visibleGap}
            </p>
            <p className="display mt-3 text-[22px] leading-[1.05] text-ink md:text-[26px]">
              {dict.home.noCompletedCard(heading)}
            </p>
            <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
              {dict.home.noCompletedCardBody}
            </p>
            {next ? (
              <Link
                href={routes.event(locale, next.slug)}
                className="mt-4.5 inline-flex items-center gap-2.5 border border-ink px-4.5 py-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {next.name}
                <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </div>

          {next ? (
            <ul className="mt-4.5">
              {next.bouts.slice(0, 2).map((bout) => (
                <UpcomingRow key={bout.id} bout={bout} locale={locale} />
              ))}
            </ul>
          ) : null}
        </>
      )}
    </div>
  );
}

/**
 * Results, split one column per promotion.
 *
 * Promotions that have a completed card on file lead, so the section opens
 * with substance rather than with an apology. A promotion with nothing
 * completed still gets its column — it just says what is missing.
 */
export function ResultsBoard({ locale }: { locale: Locale }) {
  const completed = getCompletedEvents();
  const upcoming = getUpcomingEvents();

  const columns = ORGANIZATIONS.map((organization) => ({
    organization,
    completed: completed.find((e) => e.organization === organization),
    next: upcoming.find((e) => e.organization === organization),
  })).sort((a, b) => Number(Boolean(b.completed)) - Number(Boolean(a.completed)));

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-11">
      {columns.map((column) => (
        <PromotionColumn
          key={column.organization}
          organization={column.organization}
          completed={column.completed}
          next={column.next}
          locale={locale}
        />
      ))}
    </div>
  );
}
