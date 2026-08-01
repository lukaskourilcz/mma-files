#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export class DeliveryError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "DeliveryError";
    this.code = code;
  }
}

function object(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : null;
}

function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
}

function hashView(value) {
  if (Array.isArray(value)) return value.map(hashView);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== "packageHash")
    .map(([key, child]) => [key, hashView(child)]));
}

export function packageHash(value) {
  return createHash("sha256").update(canonical(hashView(value))).digest("hex");
}

function requiredString(value, field, maximum = 40_000) {
  if (typeof value !== "string" || !value.trim() || value.length > maximum) {
    throw new DeliveryError("schema_invalid", `${field} must be a non-empty string`);
  }
  return value;
}

function isoDateTime(value, field) {
  const text = requiredString(value, field, 80);
  if (Number.isNaN(Date.parse(text)) || !text.includes("T")) {
    throw new DeliveryError("schema_invalid", `${field} must be an ISO date-time`);
  }
  return text;
}

function scopedReference(value, field) {
  const text = requiredString(value, field, 240);
  if (!/^(?:ufc|oktagon):/u.test(text)) {
    throw new DeliveryError("schema_invalid", `${field} is outside UFC and Oktagon`);
  }
  return text;
}

function validateArticle(value) {
  const article = object(value);
  if (!article || article.schemaVersion !== "article/1" || article.status !== "published") {
    throw new DeliveryError("schema_invalid", "MMA Files accepts only published article/1 packages");
  }
  requiredString(article.slug, "slug", 180);
  isoDateTime(article.publishAt, "publishAt");
  if (article.slot !== "am" && article.slot !== "pm") {
    throw new DeliveryError("schema_invalid", "slot must be am or pm");
  }
  const localizations = object(article.localizations);
  for (const locale of ["en", "cs"]) {
    const localized = object(localizations?.[locale]);
    requiredString(localized?.title, `${locale}.title`, 180);
    requiredString(localized?.dek, `${locale}.dek`, 360);
    requiredString(localized?.bodyMDX, `${locale}.bodyMDX`);
  }
  if (!Array.isArray(article.sources) || article.sources.length === 0) {
    throw new DeliveryError("schema_invalid", "article sources cannot be empty");
  }
  if (!Array.isArray(article.fighterRefs)) {
    throw new DeliveryError("schema_invalid", "fighterRefs must be an array");
  }
  article.fighterRefs.forEach((reference, index) => scopedReference(reference, `fighterRefs[${index}]`));
  if (article.eventRef !== undefined) scopedReference(article.eventRef, "eventRef");
  const expected = packageHash(article);
  if (article.packageHash !== expected) {
    throw new DeliveryError("content_invalid", "article packageHash does not match its canonical bytes");
  }
  return article;
}

const acceptedFightSchemas = {
  fighters: "fighter-record/1",
  events: "event-card/1",
  odds: "odds-snapshot/1",
  modelRuns: "model-run/1",
  edgeReports: "edge-report/1",
  slips: "slip-of-ten/1",
};

function validateFightAiQ(value) {
  const feed = object(value);
  if (!feed || feed.schemaVersion !== "fightaiq-delivery/1") {
    throw new DeliveryError("schema_invalid", "FightAIQ payload must use fightaiq-delivery/1");
  }
  isoDateTime(feed.generatedAt, "generatedAt");
  for (const [key, schemaVersion] of Object.entries(acceptedFightSchemas)) {
    if (!Array.isArray(feed[key])) throw new DeliveryError("schema_invalid", `${key} must be an array`);
    for (const [index, entry] of feed[key].entries()) {
      if (object(entry)?.schemaVersion !== schemaVersion) {
        throw new DeliveryError("schema_invalid", `${key}[${index}] must use ${schemaVersion}`);
      }
      const org = object(entry)?.org;
      if (org !== undefined && org !== "ufc" && org !== "oktagon") {
        throw new DeliveryError("schema_invalid", `${key}[${index}] is outside UFC and Oktagon`);
      }
      if (key === "fighters") {
        const fighter = object(entry);
        const id = requiredString(fighter.id, `fighters[${index}].id`, 180);
        const slug = requiredString(fighter.slug, `fighters[${index}].slug`, 160);
        if (id !== `${fighter.org}:${slug}` || !/^(?:ufc|oktagon):[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id)) {
          throw new DeliveryError("schema_invalid", `fighters[${index}] identity is invalid`);
        }
        const fields = object(fighter.fields);
        if (!fields || Object.keys(fields).length === 0) throw new DeliveryError("schema_invalid", `fighters[${index}].fields cannot be empty`);
        for (const [fieldName, rawField] of Object.entries(fields)) {
          const sourced = object(rawField);
          if (!sourced || !Array.isArray(sourced.sourceRefs) || sourced.sourceRefs.length === 0) {
            throw new DeliveryError("schema_invalid", `fighters[${index}].fields.${fieldName} needs sourceRefs`);
          }
          sourced.sourceRefs.forEach((reference, sourceIndex) => requiredString(reference, `fighters[${index}].fields.${fieldName}.sourceRefs[${sourceIndex}]`, 240));
          isoDateTime(sourced.retrievedAt, `fighters[${index}].fields.${fieldName}.retrievedAt`);
          if (!["verified", "provisional", "disputed"].includes(sourced.status) || typeof sourced.corroborated !== "boolean") {
            throw new DeliveryError("schema_invalid", `fighters[${index}].fields.${fieldName} evidence state is invalid`);
          }
        }
        if (!Array.isArray(fighter.criticalFields) || !Array.isArray(fighter.discrepancies)) {
          throw new DeliveryError("schema_invalid", `fighters[${index}] review fields are invalid`);
        }
        isoDateTime(fighter.updatedAt, `fighters[${index}].updatedAt`);
      }
      if (key === "events") {
        const event = object(entry);
        requiredString(event.id, `events[${index}].id`, 180);
        requiredString(event.name, `events[${index}].name`, 180);
        requiredString(event.venue, `events[${index}].venue`, 180);
        isoDateTime(event.startsAtLocal, `events[${index}].startsAtLocal`);
        isoDateTime(event.startsAtUtc, `events[${index}].startsAtUtc`);
        requiredString(event.timeZone, `events[${index}].timeZone`, 100);
        if (!Array.isArray(event.sourceRefs) || event.sourceRefs.length === 0 || !Array.isArray(event.bouts) || event.bouts.length === 0) {
          throw new DeliveryError("schema_invalid", `events[${index}] needs sources and bouts`);
        }
        isoDateTime(event.updatedAt, `events[${index}].updatedAt`);
      }
    }
  }
  if (feed.trackRecord !== null && object(feed.trackRecord)?.schemaVersion !== "track-record/1") {
    throw new DeliveryError("schema_invalid", "trackRecord must be null or track-record/1");
  }
  const expected = packageHash(feed);
  if (feed.packageHash !== expected) {
    throw new DeliveryError("content_invalid", "FightAIQ packageHash does not match its canonical bytes");
  }
  return feed;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

async function atomicJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.boardlessai-${process.pid}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
}

function articleIdentity(article) {
  return `${article.publishAt.slice(0, 10)}:${article.slot}`;
}

export async function materializeBoardlessPackage(value, root = process.cwd()) {
  const candidate = object(value);
  if (candidate?.schemaVersion === "article/1") {
    const article = validateArticle(candidate);
    const file = path.join(root, "data", "boardless", "articles.json");
    const store = await readJson(file, { schemaVersion: "mma-files-article-store/1", packages: [] });
    if (store.schemaVersion !== "mma-files-article-store/1" || !Array.isArray(store.packages)) {
      throw new DeliveryError("schema_invalid", "article store is malformed");
    }
    const current = store.packages.find((entry) => articleIdentity(entry) === articleIdentity(article));
    if (current) {
      if (current.packageHash === article.packageHash && canonical(current) === canonical(article)) {
        return { status: "noop", kind: "article", packageHash: article.packageHash, paths: [] };
      }
      throw new DeliveryError("hash_conflict", `${articleIdentity(article)} already contains different immutable bytes`);
    }
    const packages = [...store.packages, article].sort((left, right) =>
      left.publishAt.localeCompare(right.publishAt) || left.slot.localeCompare(right.slot));
    await atomicJson(file, { schemaVersion: "mma-files-article-store/1", packages });
    return { status: "written", kind: "article", packageHash: article.packageHash, paths: ["data/boardless/articles.json"] };
  }

  if (candidate?.schemaVersion === "fightaiq-delivery/1") {
    const feed = validateFightAiQ(candidate);
    const file = path.join(root, "data", "boardless", "fightaiq.json");
    const current = await readJson(file, null);
    if (current?.packageHash === feed.packageHash && canonical(current) === canonical(feed)) {
      return { status: "noop", kind: "fightaiq", packageHash: feed.packageHash, paths: [] };
    }
    if (current?.generatedAt && Date.parse(current.generatedAt) > Date.parse(feed.generatedAt)) {
      throw new DeliveryError("hash_conflict", "a newer FightAIQ snapshot is already stored");
    }
    await atomicJson(file, feed);
    return { status: "written", kind: "fightaiq", packageHash: feed.packageHash, paths: ["data/boardless/fightaiq.json"] };
  }

  throw new DeliveryError("schema_invalid", "unsupported BoardlessAI package schema");
}

async function main() {
  const packageFile = process.argv[2];
  if (!packageFile) throw new Error("usage: npm run consume:boardless -- <package.json> [repository-root]");
  const root = path.resolve(process.argv[3] ?? process.cwd());
  const value = JSON.parse(await readFile(path.resolve(packageFile), "utf8"));
  console.log(JSON.stringify(await materializeBoardlessPackage(value, root)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    if (error instanceof DeliveryError) console.error(`[delivery:${error.code}] ${error.message}`);
    else console.error(`[delivery:schema_invalid] ${error instanceof Error ? error.message : "unknown error"}`);
    process.exit(1);
  });
}
