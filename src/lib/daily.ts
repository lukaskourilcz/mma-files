// Typed access to the one canonical implementation in `daily-index.mjs`.
// The app imports from here; `tests/facts.test.mjs` imports the `.mjs`
// directly. There is deliberately no second implementation to keep in step.

export {
  dailyIndex,
  daysBetween,
  effectiveDateKey,
  revealedCount,
} from "./daily-index.mjs";

export type LocalizedText = {
  /** One line, ends without a period where it is a fragment. */
  short: string;
  /** One to three sentences: the complete checkable statement. */
  full: string;
};

export type DatasetEntry = {
  id: string;
  slug: string;
  category: string;
  /** `cross` = Czech and Slovak fighters competing in the UFC. */
  promotion?: "ufc" | "oktagon" | "cross";
  term?: string;
  en: LocalizedText;
  cs: LocalizedText;
  /** YYYY-MM-DD — when this entry was last checked against its source. */
  verified: string;
  /** Short human pointer for re-verification, not necessarily a URL. */
  source: string;
};

export type DatasetFile = {
  schemaVersion: "boardless-dataset/1";
  dataset: "ai-facts" | "mma-facts" | "ai-lessons";
  /** YYYY-MM-DD; origin of the daily index. */
  anchor: string;
  categories: Record<string, { en: string; cs: string }>;
  /** Array order is the reveal order: day 0 is `entries[0]`. */
  entries: DatasetEntry[];
};
