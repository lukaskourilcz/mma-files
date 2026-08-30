#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RESULT_WINDOW_MS = 365 * 86_400_000;

/* Canonical names arrive as Wikipedia article titles, so a handful carry the
 * encyclopaedia's disambiguator — "Felipe Lima (fighter)". That is a source
 * artifact, not the fighter's name, and it is stripped the same way delivered
 * divisions have their MediaWiki markup stripped. */
function readerName(canonicalName) {
  return canonicalName.replace(/\s*\((?:fighter|fighter,[^)]*|mixed martial artist)\)$/iu, "").trim()
    || canonicalName;
}

function fighterNames(fighters) {
  return Object.fromEntries(fighters.map((fighter) => [fighter.id, readerName(fighter.canonicalName)]));
}

/* Records as the delivery states them. A fighter whose record was never
 * sourced is simply absent from the map — the surfaces never carry a 0-0-0. */
function fighterRecords(fighters) {
  return Object.fromEntries(fighters
    .map((fighter) => [fighter.id, fighter.fields?.record?.value])
    .filter(([, value]) => typeof value === "string" && value.trim()));
}

function surface(source, name, values) {
  return {
    schemaVersion: "fightaiq-surface/1",
    surface: name,
    generatedAt: source.generatedAt,
    sourcePackageHash: source.packageHash,
    fighterNames: fighterNames(source.fighters),
    fighterRecords: fighterRecords(source.fighters),
    ...values,
  };
}

export function splitFightAiQDelivery(source) {
  if (source?.schemaVersion !== "fightaiq-delivery/2") {
    throw new Error("FightAIQ chunks require fightaiq-delivery/2");
  }
  const anchor = Date.parse(source.generatedAt);
  if (!Number.isFinite(anchor)) throw new Error("FightAIQ delivery needs a valid generatedAt");
  const resultsBoundary = anchor - RESULT_WINDOW_MS;
  const predictionBouts = source.bouts.filter((bout) =>
    !bout.event.ref.includes(":event:history-")
    && bout.status !== "completed"
    && bout.status !== "cancelled"
    && bout.status !== "postponed");
  const resultBouts = source.bouts.filter((bout) => {
    const startsAt = Date.parse(bout.event.startsAtUtc);
    return bout.status === "completed"
      && Boolean(bout.result)
      && startsAt >= resultsBoundary
      && startsAt <= anchor;
  });
  const predictionEvents = source.events.filter((event) =>
    event.bouts.some((bout) => bout.status !== "complete" && bout.status !== "cancelled"));
  const resultEvents = source.events.filter((event) =>
    event.bouts.length > 0
    && event.bouts.every((bout) => bout.status === "complete" || bout.status === "cancelled"));

  return {
    predictions: surface(source, "predictions", {
      events: predictionEvents,
      bouts: predictionBouts,
      statsEntries: source.statsEntries.filter((entry) => entry.status === "active"),
    }),
    results: surface(source, "results", {
      events: resultEvents,
      bouts: resultBouts,
      statsEntries: source.statsEntries.filter((entry) => entry.status === "scored"),
    }),
    fighters: surface(source, "fighters", {
      fighters: source.fighters,
    }),
  };
}

export async function emitFightAiQChunks({
  input = path.resolve("data/boardless/fightaiq.json"),
  output = path.resolve("public/data/fightaiq"),
} = {}) {
  const source = JSON.parse(await readFile(input, "utf8"));
  const chunks = splitFightAiQDelivery(source);
  await mkdir(output, { recursive: true });
  await Promise.all(Object.entries(chunks).map(([name, value]) =>
    writeFile(path.join(output, `${name}.json`), `${JSON.stringify(value)}\n`, "utf8")));
  return chunks;
}

const invoked = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  await emitFightAiQChunks();
}
