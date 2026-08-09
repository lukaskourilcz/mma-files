import { EmptyState } from "@/components/ui/Feedback";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { PROMOTION_ACCENT } from "@/lib/promotion";
import type { Bout, FightEvent, Locale } from "@/lib/types";

function monthKey(event: FightEvent): string {
  return event.startsAt.slice(0, 7);
}

function monthLabel(event: FightEvent): string {
  return new Intl.DateTimeFormat("cs-CZ", {
    month: "long",
    year: "numeric",
    timeZone: event.timeZone,
  }).format(new Date(event.startsAt)).toLocaleLowerCase("cs-CZ");
}

function ResultNameLine({ bout, locale }: { bout: Bout; locale: Locale }) {
  const dict = getDictionary(locale);
  const winnerRef = bout.result?.winnerRef;
  const redWon = Boolean(winnerRef && winnerRef === bout.red.fighterRef);
  const blueWon = Boolean(winnerRef && winnerRef === bout.blue.fighterRef);
  if (!redWon && !blueWon) {
    return (
      <span className="text-[16px] leading-snug md:text-[17px]">
        {bout.red.name}{" "}
        <span className="font-mono text-[12px] text-text-meta">{dict.results.versus}</span>{" "}
        {bout.blue.name}{" "}
        <span className="text-text-meta">·</span>{" "}
        <span className="font-mono text-[13px]">{dict.results.noResult}</span>
      </span>
    );
  }
  const winner = redWon ? bout.red : bout.blue;
  const loser = redWon ? bout.blue : bout.red;
  return (
    <span className="text-[16px] leading-snug md:text-[17px]">
      <strong>{winner.name}</strong>{" "}
      <span className="font-mono text-[12px] text-text-meta">{dict.results.defeated}</span>{" "}
      <span className="text-text-muted">{loser.name}</span>
    </span>
  );
}

function ResultTiming({ bout, locale }: { bout: Bout; locale: Locale }) {
  const result = bout.result;
  if (!result) return null;
  const dict = getDictionary(locale);
  const timing = [
    dict.methodsShort[result.method],
    result.round ? dict.results.round(result.round) : null,
    result.time ?? null,
  ].filter(Boolean).join(" · ");
  return (
    <span className="font-mono text-[13px] tabular-nums text-text">
      {timing}
    </span>
  );
}

function ArchiveCard({ event, locale }: { event: FightEvent; locale: Locale }) {
  const dict = getDictionary(locale);
  const accent = PROMOTION_ACCENT[event.organization];
  const date = formatDate(event.startsAt, locale, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: event.timeZone,
  });
  return (
    <details className="content-auto group border-b border-rule-strong">
      <summary
        aria-label={dict.results.expand}
        className="flex min-h-14 cursor-pointer list-none items-center gap-3 py-3 marker:hidden"
      >
        <span
          className="shrink-0 px-2 py-[5px] font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
          style={{ backgroundColor: accent }}
        >
          {dict.organizationsShort[event.organization]}
        </span>
        <span className="min-w-0 flex-1 text-[17px] font-bold text-text">{event.name}</span>
        <span className="hidden shrink-0 font-mono text-[12px] tabular-nums text-text-meta sm:inline">
          {event.city ? `${event.city} · ` : ""}{date}
        </span>
        <span
          aria-hidden="true"
          className="mr-1 h-[10px] w-[10px] shrink-0 rotate-45 border-b border-r border-text transition-transform group-open:-rotate-135"
        />
      </summary>
      <ul className="border-t border-rule bg-card px-4 md:px-5">
        {event.bouts.map((bout) => (
          <li
            key={bout.id}
            className="grid gap-2 border-b border-rule py-4 last:border-b-0 md:grid-cols-[56px_minmax(0,1fr)_auto] md:items-baseline md:gap-4"
          >
            <span className="font-mono text-[11px] uppercase text-text-meta">
              {dict.billingShort[bout.billing]}
            </span>
            <ResultNameLine bout={bout} locale={locale} />
            <ResultTiming bout={bout} locale={locale} />
          </li>
        ))}
      </ul>
    </details>
  );
}

export function ResultsArchive({ events, locale }: { events: FightEvent[]; locale: Locale }) {
  const dict = getDictionary(locale);
  if (events.length === 0) return <EmptyState>{dict.results.empty}</EmptyState>;
  const groups = new Map<string, FightEvent[]>();
  for (const event of events) groups.set(monthKey(event), [...(groups.get(monthKey(event)) ?? []), event]);
  return (
    <div className="space-y-12">
      {[...groups.values()].map((group) => {
        const first = group[0]!;
        return (
          <section key={monthKey(first)} aria-labelledby={`month-${monthKey(first)}`}>
            <h2
              id={`month-${monthKey(first)}`}
              className="display sticky top-[var(--layout-chrome-h)] z-20 border-b border-rule-strong bg-paper py-3 text-[length:var(--text-d4)] text-text"
            >
              {monthLabel(first)}
            </h2>
            <div>{group.map((event) => <ArchiveCard key={event.id} event={event} locale={locale} />)}</div>
          </section>
        );
      })}
    </div>
  );
}
