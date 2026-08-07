import { Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { factOfTheDay } from "@/lib/facts";
import type { Locale } from "@/lib/types";

/**
 * A slim belt above the lead story: one checkable fact, picked from the lead
 * article's published date so the same content always builds the same page.
 *
 * It sits before LeadStory because on a phone the hero fills the first screen,
 * and a belt underneath it would never be seen. Self-contained by design — no
 * link, no tooltip, nothing to tap.
 */
export function DidYouKnow({
  dateKey,
  locale,
}: {
  dateKey: string | undefined;
  locale: Locale;
}) {
  // factOfTheDay clamps a missing or pre-anchor date to the anchor itself.
  const { entry } = factOfTheDay(dateKey);
  const dict = getDictionary(locale);
  const copy = dict.didYouKnow;

  return (
    <aside
      aria-label={copy.ariaLabel}
      className="border-b border-rule-strong bg-card"
    >
      <Container className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 md:py-4">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          {copy.kicker}
        </p>
        <p className="min-w-0 flex-1 text-sm leading-relaxed">{entry.cs.short}</p>
        <p className="hidden shrink-0 text-[0.6875rem] uppercase tracking-[0.08em] tabular-nums text-ink-muted md:block">
          {copy.verified} <time dateTime={entry.verified}>{entry.verified}</time>
        </p>
      </Container>
    </aside>
  );
}
