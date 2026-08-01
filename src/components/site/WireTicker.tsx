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
  const items: WireItem[] = [];

  for (const event of getCompletedEvents()) {
    for (const bout of event.bouts) {
      const result = bout.result;
      if (!result) continue;

      const winner =
        result.winnerRef === bout.red.fighterRef
          ? bout.red.name
          : result.winnerRef === bout.blue.fighterRef
            ? bout.blue.name
            : undefined;
      const loser = winner === bout.red.name ? bout.blue.name : bout.red.name;

      const finish = result.finish
        ? (dict.finishes as Record<string, string | undefined>)[result.finish]
        : undefined;
      const timing = result.round
        ? ` R${result.round}${result.time ? ` ${result.time}` : ""}`
        : "";
      const detail = [dict.methods[result.method], finish].filter(Boolean).join(", ");

      items.push({
        key: `result:${bout.id}`,
        tag: event.name,
        // A draw or a no contest has no winner, so it is never phrased as one.
        text: winner
          ? `${winner} def. ${loser} — ${detail}${timing}`
          : `${bout.red.name} vs ${bout.blue.name} — ${detail}${timing}`,
      });
    }
  }

  for (const event of getUpcomingEvents()) {
    for (const bout of event.bouts) {
      const title = bout.titleFight ? ` (${dict.labels.titleFight})` : "";
      items.push({
        key: `booked:${bout.id}`,
        tag: dict.wire.booked,
        text: `${bout.red.name} vs ${bout.blue.name}${title}, ${dict.divisions[bout.division]} — ${formatDate(
          event.startsAt,
          locale,
          { day: "numeric", month: "short" },
        )}`,
      });
    }
  }

  for (const article of getArticles()) {
    for (const [i, line] of (article.unconfirmed?.[locale] ?? []).entries()) {
      items.push({ key: `open:${article.id}:${i}`, tag: dict.wire.open, text: line });
    }
  }

  return items;
}

function WireLine({ item }: { item: WireItem }) {
  return (
    <span className="flex h-[34px] items-center gap-2.5 whitespace-nowrap px-5 font-mono text-[11px] tracking-[0.05em] text-paper-meta">
      <span aria-hidden="true" className="block h-1 w-1 shrink-0 bg-signal" />
      <span className="font-semibold uppercase text-paper">{item.tag}</span>
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
      className="relative z-50 flex h-[34px] items-stretch overflow-hidden bg-ink"
    >
      <p className="flex shrink-0 items-center gap-[7px] bg-signal px-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
        <span
          aria-hidden="true"
          className="block h-1.5 w-1.5 animate-livedot rounded-full bg-ink"
        />
        {dict.wire.label}
      </p>

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="flex w-max animate-ticker">
          <ul className="flex">
            {items.map((item) => (
              <li key={item.key}>
                <WireLine item={item} />
              </li>
            ))}
          </ul>
          <ul className="flex" aria-hidden="true">
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
