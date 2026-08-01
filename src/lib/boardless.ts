import articleStore from "../../data/boardless/articles.json";
import fightAiQStore from "../../data/boardless/fightaiq.json";
import {
  DIVISIONS,
  type Article,
  type ArticleFormat,
  type Division,
  type FieldState,
  type FightEvent,
  type Fighter,
  type FighterField,
  type FighterRecord,
  type HeroTemplate,
  type Organization,
  type Source,
  type Stance,
} from "@/lib/types";

interface DeliveredLocalization {
  title: string;
  dek: string;
  bodyMDX: string;
}

interface DeliveredArticleImage {
  hero_path: string;
  thumb_path: string;
  width: number;
  height: number;
  alt_en: string;
  alt_cs: string;
  license: { name: string; author: string; source_url: string; attribution_html: string };
  origin: "photo" | "svg";
  hero_bytes_base64: string;
  thumb_bytes_base64: string;
}

interface DeliveredArticlePackage {
  schemaVersion: "article/1";
  slug: string;
  localizations: { en: DeliveredLocalization; cs: DeliveredLocalization };
  format: ArticleFormat;
  sources: Array<{ kind: "internal"; ref: string } | { kind: "external"; url: string; retrievedAt: string }>;
  image: DeliveredArticleImage;
  heroSpec: { template: string; bindings: Record<string, string | number | boolean> };
  fighterRefs: string[];
  eventRef?: string;
  modelVersion?: string;
  publishAt: string;
  slot: "am" | "pm";
  status: "published";
  packageHash: string;
}

export interface FightAiQFighterRecord {
  schemaVersion: "fighter-card/1";
  id: string;
  slug: string;
  org: Organization;
  fields: Record<string, {
    value: string | number | boolean | null | Array<string | number | boolean>;
    sourceRefs: string[];
    retrievedAt: string;
    status: "verified" | "provisional" | "disputed";
    corroborated: boolean;
  }>;
  criticalFields: string[];
  discrepancies: Array<{ field: string; values?: unknown[]; status: "open" | "resolved"; resolution?: string }>;
  completeness: number;
  corroboration: number;
  modelEligible: boolean;
  modelVersion: string;
  updatedAt: string;
  canonicalName: string;
  sources: Array<{ id: string; url?: string; publisher: string; title: string; retrievedAt: string; evidenceTier: "primary" | "secondary" | "tertiary"; license?: string }>;
  history: Array<{ boutRef: string; eventRef: string; happenedAt: string; opponentRef: string; result: "win" | "loss" | "draw" | "no-contest"; method: string | null; round: number | null }>;
  statsProfiles: Array<{ id: string; label: string; bouts: number; values: Record<string, number | null>; updatedAt: string }>;
  rating: { rating: number; deviation: number; volatility: number; boutCount: number };
  quality: { evidenceTier: "primary" | "secondary" | "tertiary"; gaps: string[] };
}

export interface FightAiQEvent {
  schemaVersion: "event-card/1";
  id: string;
  org: Organization;
  name: string;
  venue: string;
  startsAtLocal: string;
  timeZone: string;
  startsAtUtc: string;
  sourceRefs: string[];
  bouts: Array<{
    id: string;
    red: string;
    blue: string;
    division: string;
    scheduledRounds: 3 | 5;
    status: "announced" | "weigh-in" | "complete" | "cancelled";
  }>;
  updatedAt: string;
}

export interface FightAiQBout {
  schemaVersion: "bout/1";
  id: string;
  org: Organization;
  event: { ref: string; name: string; startsAtUtc: string; venue: string | null };
  fighters: { red: string; blue: string };
  division: string | null;
  scheduledRounds: 3 | 5 | null;
  status: "proposed" | "announced" | "confirmed" | "weigh-in" | "completed" | "cancelled" | "postponed";
  sourceRefs: string[];
  result: { winner: "red" | "blue" | "draw" | "no-contest"; method: string | null; round: number | null; elapsedSeconds: number | null; sourceRefs: string[] } | null;
  updatedAt: string;
}

export interface FightAiQStatsEntry {
  schemaVersion: "fightaiq-stats/1";
  id: string;
  boutRef: string;
  eventRef: string;
  fighterRefs: [string, string];
  modelVersion: string;
  redWin: number;
  blueWin: number;
  uncertainty: "clear-lean" | "lean" | "coin-flip" | "divergence";
  calibrationLabel: "early-model";
  marketUsed: boolean;
  status: "active" | "scored" | "void";
  outcome: "red" | "blue" | "draw" | "no-contest" | null;
  brierContribution: number | null;
  generatedAt: string;
}

export interface FightAiQDelivery {
  schemaVersion: "fightaiq-delivery/2";
  generatedAt: string | null;
  fighters: FightAiQFighterRecord[];
  events: FightAiQEvent[];
  bouts: FightAiQBout[];
  statsEntries: FightAiQStatsEntry[];
  packageHash: string | null;
}

const heroTemplates = new Set<HeroTemplate>([
  "tale-of-the-tape",
  "type-led-result",
  "data-card",
  "quote-led-preview",
]);

function organization(article: DeliveredArticlePackage): Organization | undefined {
  const reference = article.eventRef ?? article.fighterRefs[0];
  return reference?.startsWith("ufc:") ? "ufc" : reference?.startsWith("oktagon:") ? "oktagon" : undefined;
}

function fighterRef(reference: string): string {
  const [org, slug] = reference.split(":");
  return `fighter:${org}/${slug}`;
}

function eventRef(reference: string): string {
  const [org, kind, ...slug] = reference.split(":");
  return kind === "event" ? `event:${org}/${slug.join(":")}` : reference;
}

function source(value: DeliveredArticlePackage["sources"][number]): Source {
  return value.kind === "internal"
    ? { kind: "internal", ref: value.ref, classification: "primary" }
    : { kind: "external", url: value.url, retrievedAt: value.retrievedAt, classification: "primary" };
}

function deliveredArticle(value: DeliveredArticlePackage): Article | null {
  if (value.schemaVersion !== "article/1" || value.status !== "published") return null;
  if (!value.localizations.en.bodyMDX.trim() || !value.localizations.cs.bodyMDX.trim() || value.sources.length === 0) return null;
  const org = organization(value);
  const template = heroTemplates.has(value.heroSpec.template as HeroTemplate)
    ? value.heroSpec.template as HeroTemplate
    : "data-card";
  return {
    id: `article:${value.publishAt.slice(0, 10)}-${value.slot}-${value.slug}`,
    slug: value.slug,
    status: "published",
    format: value.format,
    localizations: {
      en: { title: value.localizations.en.title, dek: value.localizations.en.dek, body: value.localizations.en.bodyMDX },
      cs: { title: value.localizations.cs.title, dek: value.localizations.cs.dek, body: value.localizations.cs.bodyMDX },
    },
    ...(org ? { organization: org } : {}),
    fighterRefs: value.fighterRefs.map(fighterRef),
    ...(value.eventRef ? { eventRef: eventRef(value.eventRef) } : {}),
    sources: value.sources.map(source),
    publishAt: value.publishAt,
    heroSpec: { template, bindings: value.heroSpec.bindings },
    ...(value.modelVersion ? { modelVersion: value.modelVersion } : {}),
    packageHash: value.packageHash,
    image: {
      src: value.image.hero_path.replace(/^public/u, ""),
      thumbnailSrc: value.image.thumb_path.replace(/^public/u, ""),
      alt: { en: value.image.alt_en, cs: value.image.alt_cs },
      credit: value.image.license.attribution_html,
      creditUrl: value.image.license.source_url,
    },
    isDemo: false,
  };
}

export function getDeliveredArticles(): Article[] {
  const store = articleStore as unknown as { schemaVersion?: string; packages?: DeliveredArticlePackage[] };
  if (store.schemaVersion !== "mma-files-article-store/1" || !Array.isArray(store.packages)) return [];
  return store.packages.map(deliveredArticle).filter((article): article is Article => Boolean(article));
}

export function getFightAiQDelivery(): FightAiQDelivery {
  const value = fightAiQStore as unknown as FightAiQDelivery;
  if (value.schemaVersion !== "fightaiq-delivery/2" || !Array.isArray(value.fighters) || !Array.isArray(value.events) || !Array.isArray(value.bouts) || !Array.isArray(value.statsEntries)) {
    return { schemaVersion: "fightaiq-delivery/2", generatedAt: null, fighters: [], events: [], bouts: [], statsEntries: [], packageHash: null };
  }
  return value;
}

type DeliveredField = FightAiQFighterRecord["fields"][string];

function field(record: FightAiQFighterRecord, name: string): DeliveredField | undefined {
  return record.fields[name];
}

function fieldText(record: FightAiQFighterRecord, name: string): string | undefined {
  const value = field(record, name)?.value;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function fieldNumber(record: FightAiQFighterRecord, name: string): number | undefined {
  const value = field(record, name)?.value;
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function fieldState(record: FightAiQFighterRecord, name: FighterField): FieldState {
  const value = field(record, name);
  if (!value) return "unavailable";
  if (record.discrepancies.some((item) => item.field === name && item.status === "open")) return "disputed";
  return value.status;
}

function division(value: string | undefined): Division | undefined {
  if (!value) return undefined;
  const normalized = value
    .toLowerCase()
    .replaceAll("women's", "womens")
    .replaceAll("women’s", "womens")
    .replace(/\s+/gu, "-");
  return DIVISIONS.find((candidate) => candidate === normalized);
}

function stance(value: string | undefined): Stance | undefined {
  const normalized = value?.toLowerCase();
  return normalized === "orthodox" || normalized === "southpaw" || normalized === "switch"
    ? normalized
    : undefined;
}

function record(value: string | undefined): FighterRecord | undefined {
  const match = value?.match(/^(\d+)\s*[-–]\s*(\d+)\s*[-–]\s*(\d+)(?:\s*\((\d+)\s*NC\))?$/iu);
  if (!match) return undefined;
  return {
    wins: Number(match[1]),
    losses: Number(match[2]),
    draws: Number(match[3]),
    ...(match[4] ? { noContests: Number(match[4]) } : {}),
  };
}

function sourcesFor(record: FightAiQFighterRecord): Source[] {
  const retrievedAtByRef = new Map<string, string>();
  for (const value of Object.values(record.fields)) {
    for (const reference of value.sourceRefs) {
      if (!retrievedAtByRef.has(reference)) retrievedAtByRef.set(reference, value.retrievedAt);
    }
  }
  const structured = record.sources.map((item): Source => item.url
    ? { kind: "external", url: item.url, title: item.title, publisher: item.publisher, retrievedAt: item.retrievedAt, classification: item.evidenceTier === "primary" ? "primary" : "secondary" }
    : { kind: "internal", ref: item.id, title: item.title, publisher: item.publisher, retrievedAt: item.retrievedAt, classification: item.evidenceTier === "primary" ? "primary" : "secondary" });
  const fieldSources = [...retrievedAtByRef].map(([reference, retrievedAt]): Source => reference.startsWith("https://")
    ? { kind: "external", url: reference, retrievedAt, classification: "primary" }
    : { kind: "internal", ref: reference, retrievedAt, classification: "primary" });
  return [...new Map([...structured, ...fieldSources].map((item) => [item.url ?? item.ref ?? JSON.stringify(item), item])).values()];
}

function deliveredFighter(value: FightAiQFighterRecord): Fighter | null {
  const name = fieldText(value, "name");
  const weightClass = division(fieldText(value, "division"));
  if (!name || !weightClass) return null;
  const fighterRecord = record(fieldText(value, "record"));
  const sourceList = sourcesFor(value);
  if (sourceList.length === 0) return null;
  const summary = `FightAIQ has ${Math.round(value.completeness * 100)}% of this file filled and ${Math.round(value.corroboration * 100)}% of recorded fields corroborated.`;
  const summaryCs = `FightAIQ má vyplněno ${Math.round(value.completeness * 100)} % tohoto profilu a ${Math.round(value.corroboration * 100)} % zaznamenaných údajů potvrzuje více zdrojů.`;
  const modelNote = value.modelEligible
    ? `The verified critical fields clear FightAIQ's ${value.modelVersion} analysis gate.`
    : "One or more critical fields still need stronger evidence before model use.";
  const modelNoteCs = value.modelEligible
    ? `Ověřená klíčová pole splňují podmínky modelu FightAIQ ${value.modelVersion}.`
    : "Nejméně jeden klíčový údaj potřebuje lepší podklady, než jej bude možné použít v modelu.";
  return {
    id: `fighter:${value.org}/${value.slug}`,
    slug: value.slug,
    organization: value.org,
    name,
    ...(fieldText(value, "nickname") ? { nickname: fieldText(value, "nickname") } : {}),
    division: weightClass,
    country: fieldText(value, "country") ?? "",
    ...(fieldText(value, "team") ? { team: fieldText(value, "team") } : {}),
    ...(fighterRecord ? { record: fighterRecord } : {}),
    ...(stance(fieldText(value, "stance")) ? { stance: stance(fieldText(value, "stance")) } : {}),
    ...(fieldNumber(value, "heightCm") !== undefined ? { heightCm: fieldNumber(value, "heightCm") } : {}),
    ...(fieldNumber(value, "reachCm") !== undefined ? { reachCm: fieldNumber(value, "reachCm") } : {}),
    ...(fieldText(value, "dateOfBirth") ? { dateOfBirth: fieldText(value, "dateOfBirth") } : {}),
    localizations: {
      en: { summary, styleNote: fieldText(value, "styleNote") ?? modelNote },
      cs: { summary: summaryCs, styleNote: fieldText(value, "styleNoteCs") ?? modelNoteCs },
    },
    fieldStates: {
      record: fighterRecord ? fieldState(value, "record") : "unavailable",
      stance: stance(fieldText(value, "stance")) ? fieldState(value, "stance") : "unavailable",
      heightCm: fieldNumber(value, "heightCm") !== undefined ? fieldState(value, "heightCm") : "unavailable",
      reachCm: fieldNumber(value, "reachCm") !== undefined ? fieldState(value, "reachCm") : "unavailable",
      dateOfBirth: fieldText(value, "dateOfBirth") ? fieldState(value, "dateOfBirth") : "unavailable",
      team: fieldText(value, "team") ? fieldState(value, "team") : "unavailable",
      division: fieldState(value, "division"),
    },
    sources: sourceList,
    isDemo: false,
    fightFile: {
      evidenceTier: value.quality.evidenceTier,
      gaps: value.quality.gaps,
      rating: { rating: value.rating.rating, deviation: value.rating.deviation, boutCount: value.rating.boutCount },
      history: value.history,
      statsProfiles: value.statsProfiles
    }
  };
}

function fighterName(reference: string, records: readonly FightAiQFighterRecord[]): string {
  const match = records.find((candidate) => candidate.id === reference);
  return match ? fieldText(match, "name") ?? match.slug.replaceAll("-", " ") : reference.split(":").at(-1)?.replaceAll("-", " ") ?? reference;
}

function eventSource(reference: string, retrievedAt: string): Source {
  return reference.startsWith("https://")
    ? { kind: "external", url: reference, retrievedAt, classification: "primary" }
    : { kind: "internal", ref: reference, retrievedAt, classification: "primary" };
}

function deliveredEvent(value: FightAiQEvent, fighters: readonly FightAiQFighterRecord[]): FightEvent | null {
  const slug = value.id.replace(`${value.org}:event:`, "");
  if (!slug || value.sourceRefs.length === 0 || value.bouts.length === 0) return null;
  const completed = value.bouts.every((bout) => bout.status === "complete" || bout.status === "cancelled");
  const confirmed = value.bouts.some((bout) => bout.status === "weigh-in");
  const boutWord = value.bouts.length === 1 ? "bout" : "bouts";
  const boutWordCs = value.bouts.length === 1 ? "zápas" : value.bouts.length < 5 ? "zápasy" : "zápasů";
  return {
    id: `event:${value.org}/${slug}`,
    slug,
    organization: value.org,
    name: value.name,
    startsAt: value.startsAtUtc,
    timeZone: value.timeZone,
    venue: value.venue,
    city: "",
    country: "",
    status: completed ? "completed" : confirmed ? "confirmed" : "announced",
    bouts: value.bouts.map((bout, index) => ({
      id: bout.id,
      division: division(bout.division) ?? "catchweight",
      red: { name: fighterName(bout.red, fighters), fighterRef: `fighter:${bout.red.replace(":", "/")}` },
      blue: { name: fighterName(bout.blue, fighters), fighterRef: `fighter:${bout.blue.replace(":", "/")}` },
      scheduledRounds: bout.scheduledRounds,
      billing: index === 0 ? "main" : index === 1 ? "co-main" : "main-card",
    })),
    localizations: {
      en: { summary: `${value.name} has ${value.bouts.length} sourced ${boutWord} on file. The listing was last checked ${value.updatedAt.slice(0, 10)}.` },
      cs: { summary: `${value.name} má v podkladech ${value.bouts.length} ${boutWordCs}. Soupiska byla naposledy ověřena ${value.updatedAt.slice(0, 10)}.` },
    },
    sources: value.sourceRefs.map((reference) => eventSource(reference, value.updatedAt)),
    isDemo: false,
  };
}

function resultMethod(value: FightAiQBout["result"]): import("@/lib/types").ResultMethod {
  if (!value || value.winner === "draw") return "draw";
  if (value.winner === "no-contest") return "no-contest";
  const method = value.method?.toLowerCase() ?? "";
  if (method.includes("submission") || method.includes("sub")) return "submission";
  if (method.includes("split")) return "decision-split";
  if (method.includes("majority")) return "decision-majority";
  if (method.includes("decision")) return "decision-unanimous";
  if (method.includes("tko")) return "tko";
  return "ko";
}

function resultTime(seconds: number | null): string | undefined {
  if (seconds === null) return undefined;
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function deliveredBoutEvents(values: readonly FightAiQBout[], fighters: readonly FightAiQFighterRecord[], statsEntries: readonly FightAiQStatsEntry[]): FightEvent[] {
  const active = values.filter((bout) => bout.status !== "cancelled" && bout.status !== "postponed");
  const predictions = new Map(statsEntries.filter((entry) => entry.status === "active").map((entry) => [entry.boutRef, entry]));
  const groups = new Map<string, FightAiQBout[]>();
  for (const bout of active) groups.set(bout.event.ref, [...(groups.get(bout.event.ref) ?? []), bout]);
  return [...groups.values()].flatMap((bouts) => {
    const first = bouts[0];
    if (!first) return [];
    const slug = first.event.ref.replace(`${first.org}:event:`, "");
    const complete = bouts.every((bout) => bout.status === "completed");
    const confirmed = bouts.some((bout) => bout.status === "confirmed" || bout.status === "weigh-in");
    const sources = [...new Set(bouts.flatMap((bout) => bout.sourceRefs))];
    return [{
      id: `event:${first.org}/${slug}`,
      slug,
      organization: first.org,
      name: first.event.name,
      startsAt: first.event.startsAtUtc,
      timeZone: "UTC",
      ...(first.event.venue ? { venue: first.event.venue } : {}),
      city: "",
      country: "",
      status: complete ? "completed" as const : confirmed ? "confirmed" as const : "card-forming" as const,
      bouts: bouts.sort((left, right) => left.id.localeCompare(right.id)).map((bout, index) => ({
        id: bout.id,
        division: division(bout.division ?? undefined) ?? "catchweight",
        red: { name: fighterName(bout.fighters.red, fighters), fighterRef: `fighter:${bout.fighters.red.replace(":", "/")}` },
        blue: { name: fighterName(bout.fighters.blue, fighters), fighterRef: `fighter:${bout.fighters.blue.replace(":", "/")}` },
        scheduledRounds: bout.scheduledRounds ?? 3,
        billing: index === 0 ? "main" as const : index === 1 ? "co-main" as const : "main-card" as const,
        ...(predictions.get(bout.id) ? { prediction: {
          redWin: predictions.get(bout.id)!.redWin,
          blueWin: predictions.get(bout.id)!.blueWin,
          uncertainty: predictions.get(bout.id)!.uncertainty,
          modelVersion: predictions.get(bout.id)!.modelVersion,
          calibrationLabel: predictions.get(bout.id)!.calibrationLabel
        } } : {}),
        ...(bout.result ? { result: {
          ...(bout.result.winner === "red" ? { winnerRef: `fighter:${bout.fighters.red.replace(":", "/")}` } : bout.result.winner === "blue" ? { winnerRef: `fighter:${bout.fighters.blue.replace(":", "/")}` } : {}),
          method: resultMethod(bout.result),
          ...(bout.result.method ? { finish: bout.result.method.toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, "") } : {}),
          ...(bout.result.round ? { round: bout.result.round } : {}),
          ...(resultTime(bout.result.elapsedSeconds) ? { time: resultTime(bout.result.elapsedSeconds) } : {})
        } } : {})
      })),
      localizations: {
        en: { summary: `${first.event.name} has ${bouts.length} sourced fight${bouts.length === 1 ? "" : "s"} on file.` },
        cs: { summary: `${first.event.name} má v podkladech ${bouts.length} ${bouts.length === 1 ? "zápas" : bouts.length < 5 ? "zápasy" : "zápasů"}.` }
      },
      sources: sources.map((reference) => eventSource(reference, first.updatedAt)),
      isDemo: false
    }];
  });
}

export function getDeliveredFighters(): Fighter[] {
  return getFightAiQDelivery().fighters.map(deliveredFighter).filter((value): value is Fighter => Boolean(value));
}

export function getDeliveredEvents(): FightEvent[] {
  const snapshot = getFightAiQDelivery();
  const eventBouts = snapshot.bouts.filter((bout) => !bout.event.ref.includes(":event:history-"));
  if (eventBouts.length) return deliveredBoutEvents(eventBouts, snapshot.fighters, snapshot.statsEntries);
  return snapshot.events.map((value) => deliveredEvent(value, snapshot.fighters)).filter((event): event is FightEvent => Boolean(event));
}
