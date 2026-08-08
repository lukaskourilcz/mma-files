#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

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
  return `{${Object.keys(value).sort((left, right) => left.localeCompare(right)).map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
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

function independentSourceCount(sourceRefs) {
  return new Set(sourceRefs.map((reference) => {
    if (reference.startsWith("source:cito-ufc:")) return "provider:cito-ufc";
    if (reference.startsWith("source:wikipedia:")) return "provider:wikipedia";
    if (reference.startsWith("source:wikidata:")) return "provider:wikidata";
    if (reference.startsWith("source:the-odds-api:")) return "provider:the-odds-api";
    if (reference.startsWith("https://")) return `host:${new URL(reference).hostname.toLowerCase()}`;
    return reference.split(":").slice(0, 2).join(":");
  })).size;
}

function base64Bytes(value, field, maximum) {
  const encoded = requiredString(value, field, Math.ceil(maximum * 1.4));
  if (!/^[A-Za-z0-9+/]+={0,2}$/u.test(encoded)) throw new DeliveryError("schema_invalid", `${field} must be base64`);
  const bytes = Buffer.from(encoded, "base64");
  if (!bytes.length || bytes.byteLength > maximum) throw new DeliveryError("schema_invalid", `${field} exceeds its byte limit`);
  return bytes;
}

async function validateArticle(value) {
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
  // Czech is the published locale; English is optional and on its way out. A locale that is
  // present is validated exactly as strictly as before — requiredString is the shared guard
  // for every field in this file and is not relaxed.
  for (const locale of ["cs", ...(localizations?.en ? ["en"] : [])]) {
    const localized = object(localizations?.[locale]);
    requiredString(localized?.title, `${locale}.title`, 180);
    requiredString(localized?.dek, `${locale}.dek`, 360);
    requiredString(localized?.bodyMDX, `${locale}.bodyMDX`);
  }
  const image = object(article.image);
  if (!image) throw new DeliveryError("schema_invalid", "article.image is required");
  const expectedBase = `public/images/articles/${article.slug}`;
  const pathPattern = new RegExp(`^${expectedBase}/(?:hero|thumb)\\.(?:webp|png|svg)$`);
  const heroPath = requiredString(image.hero_path, "image.hero_path", 260);
  const thumbPath = requiredString(image.thumb_path, "image.thumb_path", 260);
  if (!pathPattern.test(heroPath) || !heroPath.includes("/hero.")) throw new DeliveryError("schema_invalid", "image.hero_path is outside the article asset directory");
  if (!pathPattern.test(thumbPath) || !thumbPath.includes("/thumb.")) throw new DeliveryError("schema_invalid", "image.thumb_path is outside the article asset directory");
  if (heroPath === thumbPath) throw new DeliveryError("schema_invalid", "hero and thumbnail paths must differ");
  const width = Number(image.width);
  const height = Number(image.height);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 640 || height < 360) throw new DeliveryError("schema_invalid", "image dimensions are invalid");
  requiredString(image.alt_cs, "image.alt_cs", 300);
  if (image.alt_en !== undefined) requiredString(image.alt_en, "image.alt_en", 300);
  const license = object(image.license);
  const licenseName = requiredString(license?.name, "image.license.name", 80);
  if (!["CC0", "CC BY", "CC BY-SA", "Pexels License", "Pixabay Content License", "BoardlessAI deterministic", "BoardlessAI illustration"].includes(licenseName)) {
    throw new DeliveryError("schema_invalid", "image license is not allowed");
  }
  requiredString(license?.author, "image.license.author", 200);
  const sourceUrl = requiredString(license?.source_url, "image.license.source_url", 600);
  if (!sourceUrl.startsWith("https://")) throw new DeliveryError("schema_invalid", "image license source must use HTTPS");
  requiredString(license?.attribution_html, "image.license.attribution_html", 2_000);
  // Three origins, one licence each, checked in both directions. A reader told a picture is a
  // photograph has to be right, and an illustration BoardlessAI rendered says so in its own alt
  // text — so it may not arrive wearing a photographer's licence, and a photograph may not
  // arrive wearing BoardlessAI's.
  const licenseForOrigin = { svg: "BoardlessAI deterministic", illustration: "BoardlessAI illustration" };
  if (!["photo", "svg", "illustration"].includes(image.origin)) {
    throw new DeliveryError("schema_invalid", "image.origin must be photo, svg or illustration");
  }
  const requiredLicense = licenseForOrigin[image.origin];
  const disagrees = requiredLicense
    ? licenseName !== requiredLicense
    : Object.values(licenseForOrigin).includes(licenseName);
  if (disagrees) throw new DeliveryError("schema_invalid", "image origin and license disagree");
  const heroBytes = base64Bytes(image.hero_bytes_base64, "image.hero_bytes_base64", 800_000);
  const thumbBytes = base64Bytes(image.thumb_bytes_base64, "image.thumb_bytes_base64", 300_000);
  try {
    const [heroMetadata, thumbMetadata] = await Promise.all([sharp(heroBytes).metadata(), sharp(thumbBytes).metadata()]);
    if (heroMetadata.width !== width || heroMetadata.height !== height) throw new Error("hero dimensions differ from image metadata");
    if (thumbMetadata.width !== 640 || thumbMetadata.height !== 360) throw new Error("thumbnail must be 640x360");
    if (image.origin === "svg" && heroMetadata.format !== "svg") throw new Error("FRAME fallback must contain SVG bytes");
    if (["photo", "illustration"].includes(image.origin) && !["webp", "png", "jpeg"].includes(heroMetadata.format ?? "")) throw new Error("a photograph or illustration must be a supported raster image");
  } catch (error) {
    throw new DeliveryError("content_invalid", error instanceof Error ? error.message : "image bytes are invalid");
  }
  if (!Array.isArray(article.sources) || article.sources.length === 0) {
    throw new DeliveryError("schema_invalid", "article sources cannot be empty");
  }
  if (!Array.isArray(article.fighterRefs)) {
    throw new DeliveryError("schema_invalid", "fighterRefs must be an array");
  }
  article.fighterRefs.forEach((reference, index) => scopedReference(reference, `fighterRefs[${index}]`));
  if (article.eventRef !== undefined) scopedReference(article.eventRef, "eventRef");
  if (article.correction !== undefined) {
    const correction = object(article.correction);
    if (!correction || correction.schemaVersion !== "article-image-correction/1") {
      throw new DeliveryError("schema_invalid", "correction must use article-image-correction/1");
    }
    const supersedes = requiredString(correction.supersedesPackageHash, "correction.supersedesPackageHash", 64);
    if (!/^[a-f0-9]{64}$/u.test(supersedes)) {
      throw new DeliveryError("schema_invalid", "correction.supersedesPackageHash must be a sha256");
    }
    requiredString(correction.reason, "correction.reason", 300);
    isoDateTime(correction.correctedAt, "correction.correctedAt");
  }
  const expected = packageHash(article);
  if (article.packageHash !== expected) {
    throw new DeliveryError("content_invalid", "article packageHash does not match its canonical bytes");
  }
  return article;
}

const acceptedFightSchemas = {
  fighters: "fighter-card/1",
  events: "event-card/1",
  bouts: "bout/1",
  statsEntries: "fightaiq-stats/1",
};

const privateFightAiQFields = ["odds", "modelRuns", "edgeReports", "slips", "trackRecord"];

function validateFightAiQ(value) {
  const feed = object(value);
  if (!feed || feed.schemaVersion !== "fightaiq-delivery/2") {
    throw new DeliveryError("schema_invalid", "FightAIQ payload must use fightaiq-delivery/2");
  }
  for (const field of privateFightAiQFields) {
    if (field in feed) throw new DeliveryError("schema_invalid", `FightAIQ payload must not publish private ${field} data`);
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
        requiredString(fighter.canonicalName, `fighters[${index}].canonicalName`, 160);
        if (!Array.isArray(fighter.sources) || fighter.sources.length === 0 || !Array.isArray(fighter.history) || !Array.isArray(fighter.statsProfiles) || !Array.isArray(fighter.changeLog) || fighter.changeLog.length === 0) {
          throw new DeliveryError("schema_invalid", `fighters[${index}] card collections are invalid`);
        }
        const quality = object(fighter.quality);
        if (!quality || !["primary", "secondary", "tertiary"].includes(quality.evidenceTier) || !Array.isArray(quality.gaps)) {
          throw new DeliveryError("schema_invalid", `fighters[${index}].quality is invalid`);
        }
        isoDateTime(fighter.updatedAt, `fighters[${index}].updatedAt`);
      }
      if (key === "bouts") {
        const bout = object(entry);
        const event = object(bout.event);
        const fighters = object(bout.fighters);
        scopedReference(bout.id, `bouts[${index}].id`);
        scopedReference(event?.ref, `bouts[${index}].event.ref`);
        isoDateTime(event?.startsAtUtc, `bouts[${index}].event.startsAtUtc`);
        scopedReference(fighters?.red, `bouts[${index}].fighters.red`);
        scopedReference(fighters?.blue, `bouts[${index}].fighters.blue`);
        if (!["proposed", "announced", "confirmed", "weigh-in", "completed", "cancelled", "postponed"].includes(bout.status) || !Array.isArray(bout.statusHistory) || bout.statusHistory.length === 0 || object(bout.statusHistory.at(-1))?.status !== bout.status) {
          throw new DeliveryError("schema_invalid", `bouts[${index}] status history is invalid`);
        }
        if (!Array.isArray(bout.sourceRefs) || bout.sourceRefs.length === 0) throw new DeliveryError("schema_invalid", `bouts[${index}] needs sourceRefs`);
        if (["confirmed", "weigh-in"].includes(bout.status) && independentSourceCount(bout.sourceRefs) < 2) throw new DeliveryError("schema_invalid", `bouts[${index}] needs two independent sources before confirmation`);
        isoDateTime(bout.updatedAt, `bouts[${index}].updatedAt`);
      }
      if (key === "statsEntries") {
        const stats = object(entry);
        scopedReference(stats.boutRef, `statsEntries[${index}].boutRef`);
        if (typeof stats.redWin !== "number" || typeof stats.blueWin !== "number" || Math.abs(stats.redWin + stats.blueWin - 1) > 0.000001) {
          throw new DeliveryError("schema_invalid", `statsEntries[${index}] probabilities are invalid`);
        }
        if (stats.calibrationLabel !== "early-model") throw new DeliveryError("schema_invalid", `statsEntries[${index}] needs the early-model label`);
        if (stats.status === "scored" && (typeof stats.brierContribution !== "number" || !["red", "blue"].includes(stats.outcome))) throw new DeliveryError("schema_invalid", `statsEntries[${index}] scored result is incomplete`);
        isoDateTime(stats.generatedAt, `statsEntries[${index}].generatedAt`);
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

async function atomicBytes(file, bytes) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.boardlessai-${process.pid}.tmp`;
  try {
    await writeFile(temporary, bytes, { flag: "wx" });
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
}

async function readBytes(file) {
  try {
    return await readFile(file);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

function articleIdentity(article) {
  return `${article.publishAt.slice(0, 10)}:${article.slot}`;
}

/**
 * What a correction may change: the picture, the block declaring the correction, and the hash.
 *
 * A delivered article is immutable by date and slot, and that is what stops a published piece
 * being quietly swapped. It also made it impossible to fix a hero that showed the wrong thing —
 * two of the first week's articles did, and both stayed wrong. A correction is the one door
 * through, and it is narrow: the incoming package must name the stored one's hash, and every
 * other field must be byte-identical. The words a reader read cannot change here.
 *
 * BoardlessAI checks the same thing before it sends. This side checks it again rather than
 * trusting that, because a producer that got it wrong would otherwise rewrite an article through
 * a door meant for photographs.
 */
const CORRECTABLE_FIELDS = ["image", "correction", "packageHash"];

function withoutCorrectableFields(article) {
  return Object.fromEntries(Object.entries(article).filter(([key]) => !CORRECTABLE_FIELDS.includes(key)));
}

export function isImageOnlyCorrection(current, replacement) {
  const correction = object(replacement.correction);
  if (!correction) return false;
  if (correction.supersedesPackageHash !== current.packageHash) return false;
  if (articleIdentity(current) !== articleIdentity(replacement)) return false;
  if (current.packageHash === replacement.packageHash) return false;
  return canonical(withoutCorrectableFields(current)) === canonical(withoutCorrectableFields(replacement));
}

export async function materializeBoardlessPackage(value, root = process.cwd()) {
  const candidate = object(value);
  if (candidate?.schemaVersion === "article/1") {
    const article = await validateArticle(candidate);
    const file = path.join(root, "data", "boardless", "articles.json");
    const store = await readJson(file, { schemaVersion: "mma-files-article-store/1", packages: [] });
    if (store.schemaVersion !== "mma-files-article-store/1" || !Array.isArray(store.packages)) {
      throw new DeliveryError("schema_invalid", "article store is malformed");
    }
    const current = store.packages.find((entry) => articleIdentity(entry) === articleIdentity(article));
    if (current) {
      if (current.packageHash === article.packageHash && canonical(current) === canonical(article)) {
        const heroFile = path.join(root, article.image.hero_path);
        const thumbFile = path.join(root, article.image.thumb_path);
        const [heroCurrent, thumbCurrent] = await Promise.all([readBytes(heroFile), readBytes(thumbFile)]);
        const heroExpected = Buffer.from(article.image.hero_bytes_base64, "base64");
        const thumbExpected = Buffer.from(article.image.thumb_bytes_base64, "base64");
        if (heroCurrent?.equals(heroExpected) && thumbCurrent?.equals(thumbExpected)) {
          return { status: "noop", kind: "article", packageHash: article.packageHash, paths: [] };
        }
        throw new DeliveryError("hash_conflict", `${articleIdentity(article)} image assets are missing or changed`);
      }
      if (!isImageOnlyCorrection(current, article)) {
        throw new DeliveryError("hash_conflict", `${articleIdentity(article)} already contains different immutable bytes`);
      }
      // A correction replaces the stored package and overwrites its two image files in place, so
      // the article keeps its URL and its assets keep their paths. Nothing else on disk moves.
      const heroFile = path.join(root, article.image.hero_path);
      const thumbFile = path.join(root, article.image.thumb_path);
      await atomicBytes(heroFile, Buffer.from(article.image.hero_bytes_base64, "base64"));
      await atomicBytes(thumbFile, Buffer.from(article.image.thumb_bytes_base64, "base64"));
      const corrected = store.packages
        .map((entry) => (articleIdentity(entry) === articleIdentity(article) ? article : entry));
      await atomicJson(file, { schemaVersion: "mma-files-article-store/1", packages: corrected });
      return {
        status: "corrected",
        kind: "article",
        packageHash: article.packageHash,
        supersedes: current.packageHash,
        paths: ["data/boardless/articles.json", article.image.hero_path, article.image.thumb_path]
      };
    }
    const packages = [...store.packages, article].sort((left, right) =>
      left.publishAt.localeCompare(right.publishAt) || left.slot.localeCompare(right.slot));
    const heroRelative = article.image.hero_path;
    const thumbRelative = article.image.thumb_path;
    const heroFile = path.join(root, heroRelative);
    const thumbFile = path.join(root, thumbRelative);
    const heroBytes = Buffer.from(article.image.hero_bytes_base64, "base64");
    const thumbBytes = Buffer.from(article.image.thumb_bytes_base64, "base64");
    const [existingHero, existingThumb] = await Promise.all([readBytes(heroFile), readBytes(thumbFile)]);
    if ((existingHero && !existingHero.equals(heroBytes)) || (existingThumb && !existingThumb.equals(thumbBytes))) {
      throw new DeliveryError("hash_conflict", `${articleIdentity(article)} image path already contains different bytes`);
    }
    if (!existingHero) await atomicBytes(heroFile, heroBytes);
    if (!existingThumb) await atomicBytes(thumbFile, thumbBytes);
    await atomicJson(file, { schemaVersion: "mma-files-article-store/1", packages });
    return { status: "written", kind: "article", packageHash: article.packageHash, paths: ["data/boardless/articles.json", heroRelative, thumbRelative] };
  }

  if (candidate?.schemaVersion === "fightaiq-delivery/2") {
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
