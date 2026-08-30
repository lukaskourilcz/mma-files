import { EventCard } from "@/components/event/EventCard";
import { ActionLink, Container, SectionHeading } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import type { FightEvent, Locale } from "@/lib/types";

/**
 * "Co je dál" — the booked-card belt under the cover story.
 *
 * Only cards the repository actually holds appear here. When nothing is
 * booked the belt renders nothing at all: an empty strip of placeholder dates
 * would be a promise the desk has no evidence for.
 */
export function EventBelt({
  events,
  locale,
}: {
  events: FightEvent[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  if (events.length === 0) return null;

  return (
    <section aria-labelledby="fight-week-home" className="border-b border-rule-strong bg-well py-10 md:py-14">
      <Container>
        <SectionHeading
          id="fight-week-home"
          kicker={dict.home.fightWeekTag}
          title={dict.home.fightWeekTitle}
          dek={dict.home.fightWeekDek}
          action={
            <ActionLink href={routes.fightWeek(locale)}>{dict.nav.fightWeek}</ActionLink>
          }
        />
      </Container>

      {/* One row that scrolls on small screens with the next card peeking, and
       * settles into the page gutter from md up. */}
      <ul className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 md:px-10">
        {events.map((event) => (
          <li
            key={event.id}
            className="relative w-[82vw] max-w-[380px] shrink-0 snap-start md:w-[360px]"
          >
            <EventCard event={event} locale={locale} showBouts={2} />
          </li>
        ))}
      </ul>
    </section>
  );
}
