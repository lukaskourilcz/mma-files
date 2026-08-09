import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { getArticles, getCompletedEvents, getUpcomingEvents } from "@/lib/repository";
import type { Locale } from "@/lib/types";

interface WireItem {
  key: string;
  tag: string;
  text: string;
}

/**
 * Every line on the wire is composed from something the repository actually
 * holds: a recorded result, a booking on file, or a question a released story
 * has explicitly left open. Nothing here is written by hand, so the ticker
 * cannot drift from the files behind it.
 */
function buildWire(locale: Locale): WireItem[] {
  const dict = getDictionary(locale);
  const results: WireItem[] = [];
  const bookings: WireItem[] = [];
  const questions: WireItem[] = [];

  for (const event of getCompletedEvents()) {
    for (const bout of event.bouts) {
      const result = bout.result;
      if (!result) continue;

      // Guard the ref before comparing: two absent refs are not a match, and
      // treating them as one would report a no contest as a win.
      const winner = result.winnerRef
        ? result.winnerRef === bout.red.fighterRef
          ? bout.red.name
          : result.winnerRef === bout.blue.fighterRef
            ? bout.blue.name
            : undefined
        : undefined;
      const loser = winner === bout.red.name ? bout.blue.name : bout.red.name;

      const finish = result.finish
        ? (dict.finishes as Record<string, string | undefined>)[result.finish]
        : undefined;
      const timing = result.round
        ? ` R${result.round}${result.time ? ` ${result.time}` : ""}`
        : "";
      const detail = [dict.methods[result.method], finish].filter(Boolean).join(", ");

      results.push({
        key: `result:${bout.id}`,
        tag: event.name,
        // A draw or a no contest has no winner, so it is never phrased as one.
        text: winner
          ? `${winner} ${dict.results.defeated} ${loser} — ${detail}${timing}`
          : `${bout.red.name} ${dict.results.versus} ${bout.blue.name} — ${detail}${timing}`,
      });
    }
  }

  for (const event of getUpcomingEvents()) {
    for (const bout of event.bouts) {
      const title = bout.titleFight ? ` (${dict.labels.titleFight})` : "";
      bookings.push({
        key: `booked:${bout.id}`,
        tag: dict.wire.booked,
        text: `${bout.red.name} ${dict.results.versus} ${bout.blue.name}${title}, ${dict.divisions[bout.division]} — ${formatDate(
          event.startsAt,
          locale,
          // The venue's date, not the server's: a 19:00 Las Vegas card is
          // already the next day in Prague.
          { day: "numeric", month: "short", timeZone: event.timeZone },
        )}`,
      });
    }
  }

  for (const article of getArticles()) {
    for (const [i, line] of (article.unconfirmed?.[locale] ?? []).entries()) {
      questions.push({ key: `open:${article.id}:${i}`, tag: dict.wire.open, text: line });
    }
  }

  return [...bookings.slice(0, 5), ...results.slice(0, 8), ...questions.slice(0, 3)];
}

function WireLine({ item }: { item: WireItem }) {
  return (
    <span className="flex h-[var(--layout-ticker-h)] items-center gap-2.5 whitespace-nowrap px-5 font-mono text-[11px] tracking-[var(--tracking-mono)] text-text-inverse-meta">
      <span aria-hidden="true" className="block h-1 w-1 shrink-0 bg-accent" />
      <span className="font-semibold uppercase text-text-inverse">{item.tag}</span>
      {item.text}
    </span>
  );
}

/**
 * Broadcast furniture: results, bookings and open questions on a loop. The
 * marquee needs two identical passes so translating the row by -50% lands
 * exactly where it started; the second pass is decorative and hidden from
 * assistive technology.
 */
export function WireTicker({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = buildWire(locale);
  if (items.length === 0) return null;

  return (
    <aside
      aria-label={dict.wire.label}
      className="flex h-[var(--layout-ticker-h)] items-stretch overflow-hidden bg-chrome"
    >
      <p className="relative z-10 flex shrink-0 items-center gap-[7px] bg-accent px-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-paper">
        <span
          aria-hidden="true"
          className="block h-1.5 w-1.5 animate-livedot bg-chrome"
        />
        {dict.wire.label}
      </p>

      <div className="ticker-viewport relative min-w-0 flex-1 overflow-hidden">
        <div className="ticker-track flex w-max animate-ticker">
          <ul className="flex">
            {items.map((item) => (
              <li key={item.key}>
                <WireLine item={item} />
              </li>
            ))}
          </ul>
          <ul className="ticker-echo flex" aria-hidden="true">
            {items.map((item) => (
              <li key={`echo:${item.key}`}>
                <WireLine item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
