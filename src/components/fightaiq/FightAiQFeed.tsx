import { BoutRow, type PredictionBout } from "@/components/fightaiq/BoutRow";
import { Container, Kicker, SectionHeading } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import type { FightAiQEventSurface, FightAiQStatsEntry } from "@/lib/boardless";
import { getPredictionCopy } from "@/lib/prediction-copy";
import type { Locale } from "@/lib/types";

function timestamp(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Prague",
  }).format(date);
}

/**
 * A stats entry is a bout the model has an opinion about; render it as one.
 *
 * Division and scheduled rounds come from the bout the entry points at, so a
 * model line for a bout the surface does not carry simply shows neither.
 */
function boutFor(
  entry: FightAiQStatsEntry,
  snapshot: FightAiQEventSurface,
  divisions: Readonly<Record<string, string>>,
): PredictionBout {
  const [red, blue] = entry.fighterRefs;
  const bout = snapshot.bouts.find((candidate) => candidate.id === entry.boutRef);
  const name = (reference: string) =>
    snapshot.fighterNames[reference]
    ?? reference.split(":").at(-1)?.replaceAll("-", " ")
    ?? reference;
  const record = (reference: string) => {
    const value = snapshot.fighterRecords?.[reference];
    return value?.trim() ? value : undefined;
  };
  return {
    id: entry.id,
    redName: name(red),
    blueName: name(blue),
    ...(record(red) ? { redRecord: record(red) } : {}),
    ...(record(blue) ? { blueRecord: record(blue) } : {}),
    division: bout?.division ? divisions[bout.division] ?? bout.division : "",
    ...(bout?.scheduledRounds ? { rounds: bout.scheduledRounds } : {}),
    model: {
      redWin: entry.redWin,
      blueWin: entry.blueWin,
      version: entry.modelVersion,
      capturedAt: entry.generatedAt,
      uncertainty: entry.uncertainty,
    },
  };
}

/**
 * The FightAIQ module on the data desk.
 *
 * It shows every active model line rather than one event's board, so it keeps
 * its own selection — but it renders through the same matchup row as
 * `/cs/predikce`, and every string it prints comes from `cs.ts`.
 */
export function FightAiQFeed({ snapshot, locale }: {
  snapshot: FightAiQEventSurface;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const copy = getPredictionCopy(locale);
  const active = snapshot.statsEntries.filter((entry) => entry.status === "active");

  return (
    <section
      className="border-y border-rule-dark bg-chrome py-12 text-text-inverse md:py-16"
      aria-labelledby="fightaiq-feed"
    >
      <Container>
        <SectionHeading
          id="fightaiq-feed"
          kicker={dict.dataDesk.feedEyebrow}
          title={dict.dataDesk.feedTitle}
          tone="paper"
          {...(snapshot.generatedAt
            ? { note: `${dict.dataDesk.feedUpdated}: ${timestamp(snapshot.generatedAt)}` }
            : {})}
        />

        {snapshot.generatedAt ? (
          <>
            <p className="mt-6 max-w-[68ch] border-l-2 border-accent-on-dark pl-4 text-[length:var(--text-sm)] leading-relaxed text-text-inverse-muted">
              {dict.dataDesk.feedWarning}
            </p>

            <div className="mt-10">
              <Kicker tone="paper">{dict.dataDesk.feedModels} · {active.length}</Kicker>
              {active.length > 0 ? (
                <ul className="mt-4 border-t border-rule-dark">
                  {active.map((entry) => (
                    <BoutRow
                      key={entry.id}
                      bout={boutFor(entry, snapshot, copy.divisions)}
                      copy={copy}
                    />
                  ))}
                </ul>
              ) : (
                <p className="mt-4 max-w-[68ch] text-[length:var(--text-sm)] leading-relaxed text-text-inverse-muted">
                  {dict.dataDesk.feedEmpty}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="mt-6 max-w-[68ch] text-[length:var(--text-sm)] leading-relaxed text-text-inverse-muted">
            {dict.dataDesk.feedEmpty}
          </p>
        )}
      </Container>
    </section>
  );
}
