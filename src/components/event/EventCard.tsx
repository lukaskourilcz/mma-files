import Link from "next/link";
import { Chip } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { countryName, formatCountdown, formatDateTime } from "@/lib/format";
import { routes } from "@/lib/paths";
import { PROMOTION_ACCENT } from "@/lib/promotion";
import { getFighterById } from "@/lib/repository";
import type { Bout, FightEvent, Locale } from "@/lib/types";

export function FighterName({
  name,
  fighterRef,
  locale,
  strong,
}: {
  name: string;
  fighterRef?: string;
  locale: Locale;
  strong?: boolean;
}) {
  const fighter = fighterRef ? getFighterById(fighterRef) : undefined;
  const className = strong ? "font-semibold text-ink" : "text-ink";

  if (!fighter) return <span className={className}>{name}</span>;
  return (
    <Link
      href={routes.fighter(locale, fighter.organization, fighter.slug)}
      className={`${className} underline decoration-transparent decoration-[3px] underline-offset-4 hover:decoration-accent`}
    >
      {name}
    </Link>
  );
}

/** The detailed bout row used on the event, fighter and results pages. */
export function BoutRow({ bout, locale }: { bout: Bout; locale: Locale }) {
  const dict = getDictionary(locale);
  const result = bout.result;
  const redWon = result?.winnerRef && result.winnerRef === bout.red.fighterRef;
  const blueWon = result?.winnerRef && result.winnerRef === bout.blue.fighterRef;
  const finishLabel = result?.finish
    ? (dict.finishes as Record<string, string | undefined>)[result.finish]
    : undefined;

  return (
    <div className="border-t border-rule py-3.5 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <span className="label-mono-sm text-ink-meta">{dict.billing[bout.billing]}</span>
        {bout.titleFight ? <Chip tone="signal">{dict.labels.titleFight}</Chip> : null}
      </div>

      <p className="mt-1.5 text-[0.9375rem] leading-snug">
        <FighterName
          name={bout.red.name}
          fighterRef={bout.red.fighterRef}
          locale={locale}
          strong={Boolean(redWon)}
        />{" "}
        <span className="label-mono-sm align-middle text-ink-meta">vs</span>{" "}
        <FighterName
          name={bout.blue.name}
          fighterRef={bout.blue.fighterRef}
          locale={locale}
          strong={Boolean(blueWon)}
        />
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <span className="label-mono-sm text-ink-muted">
          {dict.divisions[bout.division]}
        </span>
        <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
        <span className="label-mono-sm text-ink-meta">
          {bout.scheduledRounds} × 5:00
        </span>

        {result ? (
          <>
            <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
            <Chip tone={result.winnerRef ? "default" : "muted"}>
              {dict.methods[result.method]}
            </Chip>
            {finishLabel ? (
              <span className="label-mono-sm text-ink-muted">{finishLabel}</span>
            ) : null}
            {result.round ? (
              <span className="label-mono-sm text-ink-meta">
                R{result.round}
                {result.time ? ` · ${result.time}` : ""}
              </span>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}

/** Compact card row: slot, the two names, the terms, and a title chip. */
function CardBout({ bout, locale }: { bout: Bout; locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <li className="flex items-center gap-3 border-b border-rule py-3">
      <span className="label-mono-sm w-[52px] shrink-0 font-semibold tracking-[0.1em] text-ink-meta">
        {dict.billingShort[bout.billing]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold leading-tight text-ink">
          <FighterName name={bout.red.name} fighterRef={bout.red.fighterRef} locale={locale} strong />{" "}
          <span className="label-mono-sm font-normal text-ink-meta">
            {dict.results.versus}
          </span>{" "}
          <FighterName name={bout.blue.name} fighterRef={bout.blue.fighterRef} locale={locale} strong />
        </p>
        <p className="label-mono-sm mt-[3px] tracking-[0.13em] text-ink-meta">
          {dict.divisions[bout.division]} · {bout.scheduledRounds} × 5:00
        </p>
      </div>
      {bout.titleFight ? (
        <span className="label-mono-sm shrink-0 bg-accent px-[7px] py-[3px] font-semibold text-paper">
          {dict.labels.titleFight}
        </span>
      ) : null}
    </li>
  );
}

/**
 * A booked card. The promotion rule sits on top, the countdown chip on the
 * right, and the whole bout list underneath — an unannounced preliminary card
 * stays unannounced, so `note` is rendered verbatim rather than summarised.
 */
export function EventCard({
  event,
  locale,
  showBouts,
}: {
  event: FightEvent;
  locale: Locale;
  /** Defaults to the whole card. */
  showBouts?: number;
}) {
  const dict = getDictionary(locale);
  const local = event.localizations[locale];
  const accent = PROMOTION_ACCENT[event.organization];
  const isPast = new Date(event.startsAt).getTime() < Date.now();
  const bouts = showBouts ? event.bouts.slice(0, showBouts) : event.bouts;

  return (
    <article className="flex h-full flex-col border border-rule-strong bg-card">
      <div aria-hidden="true" className="h-1" style={{ backgroundColor: accent }} />

      <div className="flex flex-wrap items-center gap-2.5 border-b border-rule px-5 py-4">
        <span className="text-[11px] font-extrabold uppercase leading-none tracking-[0.14em] text-ink">
          {dict.organizationsShort[event.organization]}
        </span>
        <span className="label-mono-sm tracking-[0.14em] text-ink-meta">
          {dict.eventStatus[event.status]}
        </span>
        <span className="label-mono-sm ml-auto bg-note px-2 py-1 font-semibold tracking-[0.12em] text-note-ink">
          {isPast
            ? dict.fightWeek.countdownPast
            : formatCountdown(event.startsAt, locale)}
        </span>
      </div>

      <div className="p-5">
        <h3 className="display text-[26px] leading-[1.02] text-ink md:text-[30px]">
          <Link
            href={routes.event(locale, event.slug)}
            className="headline-link after:absolute after:inset-0"
          >
            {event.name}
          </Link>
        </h3>

        <p className="label-mono-sm mt-2.5 tracking-[0.13em] text-ink-muted">
          {formatDateTime(event.startsAt, locale, event.timeZone)} ·{" "}
          {[event.venue, event.city, event.country ? countryName(event.country, dict) : ""].filter(Boolean).join(", ")}
        </p>

        {bouts.length > 0 ? (
          <ul className="mt-4.5 border-t border-rule">
            {bouts.map((bout) => (
              <CardBout key={bout.id} bout={bout} locale={locale} />
            ))}
          </ul>
        ) : (
          <p className="label-mono-sm mt-4.5 text-text-meta">
            {dict.events.noBouts}
          </p>
        )}

        {showBouts && event.bouts.length > showBouts ? (
          <p className="label-mono-sm mt-3 text-ink-meta">
            {dict.events.moreOnCard} {event.bouts.length - showBouts}
          </p>
        ) : null}

        {local.note ? (
          <p className="mt-3.5 text-[13.5px] leading-relaxed text-ink-muted">
            {local.note}
          </p>
        ) : null}
      </div>

      <div className="relative z-10 mt-auto border-t border-rule px-5 py-3.5">
        <Link
          href={routes.event(locale, event.slug)}
          className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-ink hover:underline"
        >
          {dict.actions.openTheCard} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
