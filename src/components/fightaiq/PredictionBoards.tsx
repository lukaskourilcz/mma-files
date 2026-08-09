import { PredictionBoard, type PredictionBout } from "@/components/fightaiq/BoutRow";
import { EmptyState } from "@/components/ui/Feedback";
import { getDictionary } from "@/i18n";
import {
  getFightAiQDelivery,
  type FightAiQBout,
  type FightAiQDelivery,
  type FightAiQStatsEntry,
} from "@/lib/boardless";
import { ORGANIZATIONS, type Locale, type Organization } from "@/lib/types";

export interface PredictionCard {
  organization: Organization;
  eventName: string;
  eventStamp: string;
  venue?: string;
  bouts: PredictionBout[];
  provenance?: { version: string; capturedAt: string };
}

function fighterName(snapshot: FightAiQDelivery, reference: string): string {
  return snapshot.fighters.find((fighter) => fighter.id === reference)?.canonicalName
    ?? reference.split(":").at(-1)?.replaceAll("-", " ")
    ?? reference;
}

function modelFor(
  models: ReadonlyMap<string, FightAiQStatsEntry>,
  bout: FightAiQBout,
) {
  const model = models.get(bout.id);
  if (!model || model.status !== "active") return undefined;
  return {
    redWin: model.redWin,
    blueWin: model.blueWin,
    version: model.modelVersion,
    capturedAt: model.generatedAt,
  };
}

/**
 * Keep one sourced row per fighter pair. When the delivery contains repeated
 * discoveries, prefer the row carrying a model, then the newest delivered
 * update. Neither choice reads the wall clock.
 */
function deduplicate(
  bouts: FightAiQBout[],
  models: ReadonlyMap<string, FightAiQStatsEntry>,
): FightAiQBout[] {
  const picked = new Map<string, FightAiQBout>();
  for (const bout of bouts) {
    const key = [bout.fighters.red, bout.fighters.blue].sort().join("|");
    const previous = picked.get(key);
    if (!previous) {
      picked.set(key, bout);
      continue;
    }
    const boutHasModel = models.has(bout.id);
    const previousHasModel = models.has(previous.id);
    if (
      (boutHasModel && !previousHasModel)
      || (boutHasModel === previousHasModel && bout.updatedAt > previous.updatedAt)
    ) {
      picked.set(key, bout);
    }
  }
  return [...picked.values()].sort((left, right) => left.id.localeCompare(right.id));
}

export function getPredictionCards(locale: Locale, limit?: number): PredictionCard[] {
  const snapshot = getFightAiQDelivery();
  const dict = getDictionary(locale);
  const anchor = snapshot.generatedAt;
  const models = new Map(
    snapshot.statsEntries
      .filter((entry) => entry.status === "active")
      .map((entry) => [entry.boutRef, entry]),
  );

  return ORGANIZATIONS.flatMap((organization) => {
    const available = snapshot.bouts.filter((bout) => {
      if (bout.org !== organization) return false;
      if (bout.event.ref.includes(":event:history-")) return false;
      if (bout.status === "cancelled" || bout.status === "postponed" || bout.status === "completed") return false;
      return anchor ? bout.event.startsAtUtc >= anchor : true;
    });
    const event = [...available]
      .sort((left, right) => left.event.startsAtUtc.localeCompare(right.event.startsAtUtc))[0];
    if (!event) return [];

    const eventBouts = deduplicate(
      available.filter((bout) => bout.event.ref === event.event.ref),
      models,
    );
    const selected = limit ? eventBouts.slice(0, limit) : eventBouts;
    const activeModels = selected
      .map((bout) => models.get(bout.id))
      .filter((entry): entry is FightAiQStatsEntry => Boolean(entry));
    const newestModel = [...activeModels].sort((left, right) => right.generatedAt.localeCompare(left.generatedAt))[0];
    const eventDate = new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(event.event.startsAtUtc));

    return [{
      organization,
      eventName: event.event.name,
      eventStamp: event.event.venue ? `${eventDate} · ${event.event.venue}` : eventDate,
      ...(event.event.venue ? { venue: event.event.venue } : {}),
      bouts: selected.map((bout) => ({
        id: bout.id,
        redName: fighterName(snapshot, bout.fighters.red),
        blueName: fighterName(snapshot, bout.fighters.blue),
        division: bout.division
          ? (dict.divisions as Record<string, string>)[bout.division] ?? bout.division
          : "—",
        rounds: bout.scheduledRounds ?? 3,
        ...(modelFor(models, bout) ? { model: modelFor(models, bout) } : {}),
      })),
      ...(newestModel ? {
        provenance: {
          version: newestModel.modelVersion,
          capturedAt: newestModel.generatedAt,
        },
      } : {}),
    }];
  });
}

function provenanceStamp(value: string): string {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function PredictionBoardList({
  locale,
  limit,
}: {
  locale: Locale;
  limit?: number;
}) {
  const dict = getDictionary(locale);
  const cards = getPredictionCards(locale, limit);
  const byOrganization = new Map(cards.map((card) => [card.organization, card]));

  return (
    <div className="space-y-16">
      {ORGANIZATIONS.map((organization) => {
        const card = byOrganization.get(organization);
        if (!card) {
          const accent = organization === "ufc"
            ? "var(--color-badge-ufc-on-dark)"
            : "var(--color-badge-oktagon-on-dark)";
          return (
            <section key={organization} className="bg-chrome text-text-inverse">
              <header className="border-b-[3px] pb-3" style={{ borderColor: accent }}>
                <h2 className="display text-[length:var(--text-d5)]" style={{ color: accent }}>
                  {dict.organizationsShort[organization]}
                </h2>
              </header>
              <EmptyState className="mt-5 border-rule-dark text-text-inverse-meta">
                {dict.events.empty}
              </EmptyState>
            </section>
          );
        }
        return (
          <div key={organization}>
            <PredictionBoard
              organization={organization}
              eventName={card.eventName}
              eventStamp={card.eventStamp}
              bouts={card.bouts}
              locale={locale}
            />
            {card.provenance ? (
              <p className="border-t border-rule-dark pt-3 font-mono text-[11px] text-text-inverse-meta">
                {dict.predictions.earlyModel} · {dict.predictions.modelVersion} {card.provenance.version} · {dict.predictions.captured(provenanceStamp(card.provenance.capturedAt))}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
