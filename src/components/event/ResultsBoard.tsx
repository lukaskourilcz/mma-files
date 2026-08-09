import Link from "next/link";
import { Countdown } from "@/components/event/Countdown";
import { EmptyState } from "@/components/ui/Feedback";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/paths";
import { PROMOTION_ACCENT } from "@/lib/promotion";
import { getCompletedEvents, getEvents } from "@/lib/repository";
import {
  ORGANIZATIONS,
  type Bout,
  type FightEvent,
  type Locale,
  type Organization,
} from "@/lib/types";

/** A card is dated in its venue's zone, never in the server's zone. */
function stamp(event: FightEvent, locale: Locale): string {
  return formatDate(event.startsAt, locale, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: event.timeZone,
  });
}

function ResultLine({ bout, locale }: { bout: Bout; locale: Locale }) {
  const dict = getDictionary(locale);
  const result = bout.result;
  const redWon = Boolean(result?.winnerRef && result.winnerRef === bout.red.fighterRef);
  const blueWon = Boolean(result?.winnerRef && result.winnerRef === bout.blue.fighterRef);
  const hasWinner = redWon || blueWon;

  if (!hasWinner) {
    return (
      <li className="border-b border-rule py-3.5 text-[17px] leading-snug last:border-b-0">
        <span>{bout.red.name}</span>{" "}
        <span className="font-mono text-[12px] text-text-meta">{dict.results.versus}</span>{" "}
        <span>{bout.blue.name}</span>{" "}
        <span className="text-text-meta">·</span>{" "}
        <span className="font-mono text-[13px] text-text">{dict.results.noResult}</span>
      </li>
    );
  }

  const winner = redWon ? bout.red : bout.blue;
  const loser = redWon ? bout.blue : bout.red;
  const method = result ? dict.methodsShort[result.method] : "";
  const finish = result?.round
    ? `${method}, ${dict.results.round(result.round)}`
    : method;

  return (
    <li className="border-b border-rule py-3.5 text-[17px] leading-snug last:border-b-0">
      <span className="font-bold text-text">{winner.name}</span>{" "}
      <span className="font-mono text-[12px] text-text-meta">{dict.results.defeated}</span>{" "}
      <span className="text-text-muted">{loser.name}</span>{" "}
      <span className="text-text-meta">·</span>{" "}
      <span className="font-mono text-[13px] text-text">{finish}</span>
    </li>
  );
}

function CardLabel({ children }: { children: string }) {
  return (
    <p className="mb-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-text-meta">
      {children}
    </p>
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

  return (
    <section className="bg-card p-5 md:p-6">
      <header
        className="flex min-h-10 flex-wrap items-end justify-between gap-2 border-b-[3px] pb-3"
        style={{ borderColor: accent }}
      >
        <h3 className="display text-[length:var(--text-d5)] leading-none" style={{ color: accent }}>
          {dict.organizationsShort[organization]}
        </h3>
        {completed ? (
          <p className="font-mono text-[12px] tabular-nums text-text-meta">
            {completed.name} · {stamp(completed, locale)}
          </p>
        ) : null}
      </header>

      <div className="mt-5">
        <CardLabel>{dict.home.lastCard}</CardLabel>
        {completed ? (
          <ul>{completed.bouts.slice(0, 3).map((bout) => <ResultLine key={bout.id} bout={bout} locale={locale} />)}</ul>
        ) : (
          <EmptyState className="flex min-h-[120px] items-center justify-center">
            {dict.results.empty}
          </EmptyState>
        )}
      </div>

      {next ? (
        <div className="mt-7 border-t border-rule-strong pt-5">
          <CardLabel>{dict.home.nextCard}</CardLabel>
          <Link
            href={routes.event(locale, next.slug)}
            className="group mb-3 flex min-h-11 flex-wrap items-center justify-between gap-2"
          >
            <span className="text-[17px] font-bold text-text underline decoration-transparent decoration-[3px] underline-offset-4 group-hover:decoration-accent">
              {next.name}
            </span>
            <time
              dateTime={next.startsAt}
              className="font-mono text-[12px] tabular-nums text-text-meta"
            >
              {stamp(next, locale)}
            </time>
          </Link>
          <Countdown
            startsAt={next.startsAt}
            fallback={stamp(next, locale)}
            labels={dict.countdown}
          />
        </div>
      ) : null}
    </section>
  );
}

/** Fixed UFC/OKTAGON order; missing archives never reorder the page. */
export function ResultsBoard({ locale }: { locale: Locale }) {
  const completed = getCompletedEvents();
  const announced = getEvents().filter((event) => event.status !== "completed");

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-2">
      {ORGANIZATIONS.map((organization) => (
        <PromotionColumn
          key={organization}
          organization={organization}
          completed={completed.find((event) => event.organization === organization)}
          next={announced.find((event) => event.organization === organization)}
          locale={locale}
        />
      ))}
    </div>
  );
}
