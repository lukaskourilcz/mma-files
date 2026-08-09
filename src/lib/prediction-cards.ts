import type {
  FightAiQBout,
  FightAiQEventSurface,
  FightAiQStatsEntry,
} from "@/lib/boardless";
import { ORGANIZATIONS, type Organization } from "@/lib/types";
import type { PredictionBout } from "@/components/fightaiq/BoutRow";

export interface PredictionCard {
  organization: Organization;
  eventName: string;
  eventStamp: string;
  venue?: string;
  bouts: PredictionBout[];
  provenance?: { version: string; capturedAt: string };
}

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Runtime guard for the static file fetched by the homepage client island. */
export function isPredictionSurface(value: unknown): value is FightAiQEventSurface {
  if (!record(value)) return false;
  if (
    value.schemaVersion !== "fightaiq-surface/1"
    || value.surface !== "predictions"
    || !(typeof value.generatedAt === "string" || value.generatedAt === null)
    || !record(value.fighterNames)
    || !Array.isArray(value.events)
    || !Array.isArray(value.bouts)
    || !Array.isArray(value.statsEntries)
  ) return false;

  return value.events.every((event) =>
    record(event)
    && (event.org === "ufc" || event.org === "oktagon")
    && typeof event.name === "string"
    && typeof event.startsAtUtc === "string"
    && Array.isArray(event.bouts),
  ) && value.bouts.every((bout) =>
    record(bout)
    && typeof bout.id === "string"
    && (bout.org === "ufc" || bout.org === "oktagon")
    && record(bout.event)
    && record(bout.fighters)
    && typeof bout.updatedAt === "string",
  ) && value.statsEntries.every((entry) =>
    record(entry)
    && typeof entry.boutRef === "string"
    && typeof entry.modelVersion === "string"
    && typeof entry.generatedAt === "string"
    && typeof entry.redWin === "number"
    && typeof entry.blueWin === "number",
  );
}

function fighterName(snapshot: FightAiQEventSurface, reference: string): string {
  return snapshot.fighterNames[reference]
    ?? reference.split(":").at(-1)?.replaceAll("-", " ")
    ?? reference;
}

function modelFor(models: ReadonlyMap<string, FightAiQStatsEntry>, boutId: string) {
  const model = models.get(boutId);
  if (!model || model.status !== "active") return undefined;
  return {
    redWin: model.redWin,
    blueWin: model.blueWin,
    version: model.modelVersion,
    capturedAt: model.generatedAt,
  };
}

/** Prefer a model-backed duplicate, then the newest delivered update. */
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
    ) picked.set(key, bout);
  }
  return [...picked.values()].sort((left, right) => left.id.localeCompare(right.id));
}

export function predictionCardsFromSurface(
  snapshot: FightAiQEventSurface,
  divisions: Readonly<Record<string, string>>,
  limit?: number,
): PredictionCard[] {
  const anchor = snapshot.generatedAt;
  const models = new Map(
    snapshot.statsEntries
      .filter((entry) => entry.status === "active")
      .map((entry) => [entry.boutRef, entry]),
  );

  return ORGANIZATIONS.flatMap((organization) => {
    const authoritative = snapshot.events
      .filter((event) => event.org === organization)
      .filter((event) => event.bouts.some((bout) => bout.status !== "complete" && bout.status !== "cancelled"))
      .filter((event) => anchor ? event.startsAtUtc >= anchor : true)
      .sort((left, right) => left.startsAtUtc.localeCompare(right.startsAtUtc))[0];
    if (authoritative) {
      const selected = limit ? authoritative.bouts.slice(0, limit) : authoritative.bouts;
      const activeModels = selected
        .map((bout) => models.get(bout.id))
        .filter((entry): entry is FightAiQStatsEntry => Boolean(entry));
      const newestModel = [...activeModels]
        .sort((left, right) => right.generatedAt.localeCompare(left.generatedAt))[0];
      const eventDate = new Intl.DateTimeFormat("cs-CZ", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(authoritative.startsAtUtc));
      return [{
        organization,
        eventName: authoritative.name,
        eventStamp: authoritative.venue ? `${eventDate} · ${authoritative.venue}` : eventDate,
        ...(authoritative.venue ? { venue: authoritative.venue } : {}),
        bouts: selected.map((bout) => ({
          id: bout.id,
          redName: fighterName(snapshot, bout.red),
          blueName: fighterName(snapshot, bout.blue),
          division: divisions[bout.division] ?? bout.division,
          rounds: bout.scheduledRounds,
          ...(modelFor(models, bout.id) ? { model: modelFor(models, bout.id) } : {}),
        })),
        ...(newestModel ? {
          provenance: { version: newestModel.modelVersion, capturedAt: newestModel.generatedAt },
        } : {}),
      }];
    }

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
    const newestModel = [...activeModels]
      .sort((left, right) => right.generatedAt.localeCompare(left.generatedAt))[0];
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
          ? divisions[bout.division] ?? bout.division
          : "—",
        ...(bout.scheduledRounds ? { rounds: bout.scheduledRounds } : {}),
        ...(modelFor(models, bout.id) ? { model: modelFor(models, bout.id) } : {}),
      })),
      ...(newestModel ? {
        provenance: { version: newestModel.modelVersion, capturedAt: newestModel.generatedAt },
      } : {}),
    }];
  });
}
