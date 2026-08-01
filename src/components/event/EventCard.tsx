import Link from "next/link";
import { ActionLink, Chip, MissingValue } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { countryName, formatCountdown, formatDateTime } from "@/lib/format";
import { routes } from "@/lib/paths";
import { getFighterById } from "@/lib/repository";
import type { Bout, FightEvent, Locale } from "@/lib/types";

const STATUS_TONE = {
  announced: "muted",
  "card-forming": "muted",
  confirmed: "ember",
  completed: "default",
} as const;

function FighterName({
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
      className={`${className} underline decoration-ember decoration-[1.5px] underline-offset-[3px] hover:bg-ember-soft`}
    >
      {name}
    </Link>
  );
}

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
        <span className="label-mono-sm text-muted">{dict.billing[bout.billing]}</span>
        {bout.titleFight ? <Chip tone="ember">{dict.labels.titleFight}</Chip> : null}
      </div>

      <p className="mt-1.5 text-[0.9375rem] leading-snug">
        <FighterName
          name={bout.red.name}
          fighterRef={bout.red.fighterRef}
          locale={locale}
          strong={Boolean(redWon)}
        />{" "}
        <span className="label-mono-sm align-middle text-muted">vs</span>{" "}
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
        <span className="label-mono-sm text-muted">{bout.scheduledRounds} × 5:00</span>

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
              <span className="label-mono-sm text-muted">
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

export function EventCard({
  event,
  locale,
  showBouts = 2,
}: {
  event: FightEvent;
  locale: Locale;
  showBouts?: number;
}) {
  const dict = getDictionary(locale);
  const local = event.localizations[locale];
  const isPast = new Date(event.startsAt).getTime() < Date.now();
  const bouts = event.bouts.slice(0, showBouts);

  return (
    <article className="sheet sheet-hover flex h-full flex-col p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
        <Chip tone="dark">{dict.organizationsShort[event.organization]}</Chip>
        <Chip tone={STATUS_TONE[event.status]}>{dict.eventStatus[event.status]}</Chip>
        <span className="label-mono-sm ml-auto text-muted">
          {isPast
            ? dict.fightWeek.countdownPast
            : formatCountdown(event.startsAt, locale)}
        </span>
      </div>

      <h3 className="mt-4 text-xl leading-[1.2] tracking-[-0.025em] text-ink">
        <Link
          href={routes.event(locale, event.slug)}
          className="headline-link after:absolute after:inset-0"
        >
          {event.name}
        </Link>
      </h3>

      <p className="label-mono-sm mt-3 text-ink-muted">
        {formatDateTime(event.startsAt, locale, event.timeZone)} · {dict.events.localTime}
      </p>
      <p className="mt-1.5 text-sm text-ink-muted">
        {event.venue ? `${event.venue}, ` : ""}
        {event.city}, {countryName(event.country, dict)}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{local.summary}</p>

      <div className="mt-5 border-t border-rule-strong pt-4">
        {bouts.length > 0 ? (
          bouts.map((bout) => <BoutRow key={bout.id} bout={bout} locale={locale} />)
        ) : (
          <MissingValue label={dict.events.noBouts} />
        )}
      </div>

      {event.bouts.length > showBouts ? (
        <p className="label-mono-sm mt-3 text-muted">
          {dict.events.moreOnCard} {event.bouts.length - showBouts}
        </p>
      ) : null}

      <div className="relative z-10 mt-auto pt-5">
        <ActionLink href={routes.event(locale, event.slug)}>
          {dict.actions.viewEvent}
        </ActionLink>
      </div>
    </article>
  );
}
