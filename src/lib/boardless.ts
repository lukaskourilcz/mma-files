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
  schemaVersion: "fighter-record/1";
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

export interface FightAiQOddsSnapshot {
  schemaVersion: "odds-snapshot/1";
  boutRef: string;
  phase: "t3" | "t1" | "closing";
  source: "odds-api" | "owner-entry";
  market: string;
  prices: Array<{ pick: string; decimal: number }>;
  capturedAt: string;
}

export interface FightAiQModelRun {
  schemaVersion: "model-run/1";
  modelVersion: string;
  bouts: Array<{
    boutRef: string;
    probabilities: {
      redWin: number;
      blueWin: number;
      uncertainty: "clear-lean" | "lean" | "coin-flip" | "divergence";
      marketRedWin?: number;
      blendedRedWin: number;
    };
    excludedInputs: string[];
  }>;
  createdAt: string;
}

export interface FightAiQEdgeReport {
  schemaVersion: "edge-report/1";
  eventRef: string;
  modelRunRef: string;
  bouts: Array<{
    boutRef: string;
    modelProbability: number;
    marketProbability: number | null;
    divergence: number | null;
    recommendation: string;
  }>;
  calibrationContext: string;
  generatedAt: string;
}

export interface FightAiQSlip {
  schemaVersion: "slip-of-ten/1";
  eventRefs: string[];
  legs: Array<{
    boutRef: string;
    pick: string;
    modelProb: number;
    fairOdds: number;
    bookOdds?: number;
    note: string;
  }>;
  expectedLossLine: string;
  stakeGuidance: string;
  generatedAt: string;
}

export interface FightAiQDelivery {
  schemaVersion: "fightaiq-delivery/1";
  generatedAt: string | null;
  fighters: FightAiQFighterRecord[];
  events: FightAiQEvent[];
  odds: FightAiQOddsSnapshot[];
  modelRuns: FightAiQModelRun[];
  edgeReports: FightAiQEdgeReport[];
  slips: FightAiQSlip[];
  trackRecord: unknown;
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
  if (value.schemaVersion !== "fightaiq-delivery/1" || !Array.isArray(value.fighters) || !Array.isArray(value.events)) {
    return { schemaVersion: "fightaiq-delivery/1", generatedAt: null, fighters: [], events: [], odds: [], modelRuns: [], edgeReports: [], slips: [], trackRecord: null, packageHash: null };
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
  return [...retrievedAtByRef].map(([reference, retrievedAt]) => reference.startsWith("https://")
    ? { kind: "external", url: reference, retrievedAt, classification: "primary" }
    : { kind: "internal", ref: reference, retrievedAt, classification: "primary" });
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

export function getDeliveredFighters(): Fighter[] {
  return getFightAiQDelivery().fighters.map(deliveredFighter).filter((value): value is Fighter => Boolean(value));
}

export function getDeliveredEvents(): FightEvent[] {
  const snapshot = getFightAiQDelivery();
  return snapshot.events.map((value) => deliveredEvent(value, snapshot.fighters)).filter((event): event is FightEvent => Boolean(event));
}
