import raw from "@/data/mma-facts.json";
import {
  dailyIndex,
  effectiveDateKey,
  type DatasetEntry,
  type DatasetFile,
} from "./daily";

// Parsed once at module scope. This is an additive build-time read surface:
// `data/boardless/` stays the only delivery write target and
// `src/lib/repository.ts` stays the only article read path. Neither is touched
// here.
const facts = raw as DatasetFile;

export function loadMmaFacts(): DatasetFile {
  return facts;
}

/**
 * The fact belonging to a publication date. Missing or pre-anchor dates clamp
 * to the anchor, so the returned `dateKey` is the one the pick actually used.
 */
export function factOfTheDay(dateKey: string | undefined): {
  entry: DatasetEntry;
  dateKey: string;
} {
  const resolved = effectiveDateKey(facts.anchor, dateKey);
  const entry = facts.entries[dailyIndex(facts.anchor, resolved, facts.entries.length)];
  if (entry === undefined) throw new Error("mma-facts.json has no entries");
  return { entry, dateKey: resolved };
}
