import { Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { factOfTheDay } from "@/lib/facts";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/types";

/**
 * One checkable fact, deterministically picked from the lead publication date.
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
      className="bg-accent py-6 text-paper"
    >
      <Container className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-8">
        <p className="display text-[22px] leading-none">
          {copy.kicker}
        </p>
        <p className="max-w-[72ch] text-[17px] font-medium leading-[1.5]">{entry.cs.short}</p>
        <div className="font-mono text-[11px] leading-relaxed opacity-80 md:text-right">
          <p className="flex items-center gap-2 md:justify-end">
            <span aria-hidden="true" className="h-[5px] w-[5px] bg-paper" />
            {copy.verified}{" "}
            <time dateTime={entry.verified}>{formatDate(entry.verified, locale)}</time>
          </p>
          <p>{copy.source}: {entry.source}</p>
        </div>
      </Container>
    </aside>
  );
}
