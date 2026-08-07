import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  dailyIndex,
  daysBetween,
  effectiveDateKey,
  revealedCount,
} from "../src/lib/daily-index.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const facts = JSON.parse(
  await readFile(path.join(here, "..", "src", "data", "mma-facts.json"), "utf8"),
);

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ANCHOR = "2026-07-01";

/* -------------------------------------------------------------------------- */
/* Dataset schema                                                             */
/* -------------------------------------------------------------------------- */

test("the file declares the dataset envelope", () => {
  assert.equal(facts.schemaVersion, "boardless-dataset/1");
  assert.equal(facts.dataset, "mma-facts");
  assert.match(facts.anchor, DATE);
  assert.equal(facts.anchor, ANCHOR);
});

// A minimum, not an equality: the file is append-only and an append must not
// require a test edit. See `src/data/README.md`.
test("the file carries at least the entries it shipped with", () => {
  assert.ok(
    facts.entries.length >= 50,
    `expected >= 50 entries, found ${facts.entries.length}`,
  );
});

test("every category is labelled in both locales", () => {
  const keys = Object.keys(facts.categories);
  assert.ok(keys.length > 0);
  for (const [key, label] of Object.entries(facts.categories)) {
    assert.match(key, SLUG);
    assert.notEqual(label.en.trim(), "", `${key}.en`);
    assert.notEqual(label.cs.trim(), "", `${key}.cs`);
  }
});

test("every id and slug is unique", () => {
  const ids = facts.entries.map((entry) => entry.id);
  const slugs = facts.entries.map((entry) => entry.slug);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every entry holds every required field", () => {
  for (const entry of facts.entries) {
    assert.notEqual(entry.id.trim(), "", `${entry.id}.id`);
    assert.match(entry.slug, SLUG, `${entry.id}.slug`);
    assert.match(entry.verified, DATE, `${entry.id}.verified`);
    assert.notEqual(entry.source.trim(), "", `${entry.id}.source`);
  }
});

test("every entry points at a category the file declares", () => {
  for (const entry of facts.entries) {
    assert.ok(
      Object.hasOwn(facts.categories, entry.category),
      `${entry.id}: unknown category ${entry.category}`,
    );
  }
});

test("every entry carries non-empty Czech and English text", () => {
  for (const entry of facts.entries) {
    for (const locale of ["cs", "en"]) {
      assert.notEqual(entry[locale].short.trim(), "", `${entry.id}.${locale}.short`);
      assert.notEqual(entry[locale].full.trim(), "", `${entry.id}.${locale}.full`);
      assert.ok(
        !entry[locale].short.includes("\n"),
        `${entry.id}.${locale}.short must stay one line`,
      );
    }
  }
});

test("every entry names its promotion", () => {
  for (const entry of facts.entries) {
    assert.ok(
      ["ufc", "oktagon", "cross"].includes(entry.promotion),
      `${entry.id}: bad promotion ${entry.promotion}`,
    );
  }
});

test("the mix stays weighted towards the promotions this magazine covers", () => {
  const count = (promotion) =>
    facts.entries.filter((entry) => entry.promotion === promotion).length;
  assert.ok(count("oktagon") >= 12, `oktagon entries: ${count("oktagon")}`);
  assert.ok(count("cross") >= 5, `cross entries: ${count("cross")}`);
});

test("no entry is flagged as demo seed — these facts are real", () => {
  for (const entry of facts.entries) {
    assert.equal(entry.isDemo, undefined, `${entry.id}.isDemo`);
  }
});

/* -------------------------------------------------------------------------- */
/* Determinism                                                                */
/* -------------------------------------------------------------------------- */

test("daysBetween is zero at the anchor", () => {
  assert.equal(daysBetween(ANCHOR, ANCHOR), 0);
});

test("daysBetween counts across month and year boundaries", () => {
  assert.equal(daysBetween(ANCHOR, "2026-08-07"), 37);
  assert.equal(daysBetween("2026-12-31", "2027-01-01"), 1);
  assert.equal(daysBetween("2028-02-28", "2028-03-01"), 2);
  assert.equal(daysBetween(ANCHOR, "2026-06-30"), -1);
});

test("daysBetween throws on a malformed date key", () => {
  assert.throws(() => daysBetween(ANCHOR, "2026-07"), /invalid date key/);
  assert.throws(() => daysBetween("", ANCHOR), /invalid date key/);
});

test("effectiveDateKey clamps missing and pre-anchor dates", () => {
  assert.equal(effectiveDateKey(ANCHOR, "2026-08-07"), "2026-08-07");
  assert.equal(effectiveDateKey(ANCHOR, "2026-01-01"), ANCHOR);
  assert.equal(effectiveDateKey(ANCHOR, undefined), ANCHOR);
});

test("consecutive dates give consecutive indices", () => {
  assert.equal(dailyIndex(ANCHOR, "2026-08-07", 50), 37);
  assert.equal(dailyIndex(ANCHOR, "2026-08-07", 50) + 1, dailyIndex(ANCHOR, "2026-08-08", 50));
});

test("the index wraps back to zero after a full cycle", () => {
  assert.equal(daysBetween(ANCHOR, "2026-08-20"), 50);
  assert.equal(dailyIndex(ANCHOR, "2026-08-20", 50), 0);
});

test("the same date always yields the same index", () => {
  assert.equal(dailyIndex(ANCHOR, "2026-09-14", 50), dailyIndex(ANCHOR, "2026-09-14", 50));
});

test("consecutive days select distinct entries that all exist", () => {
  const seen = new Set();
  for (let day = 1; day <= 31; day += 1) {
    const key = `2026-07-${String(day).padStart(2, "0")}`;
    const index = dailyIndex(ANCHOR, key, facts.entries.length);
    assert.ok(index >= 0 && index < facts.entries.length, `${key} -> ${index}`);
    assert.equal(typeof facts.entries[index].id, "string");
    seen.add(index);
  }
  assert.equal(seen.size, 31, "31 consecutive days must select 31 different entries");
});

test("revealedCount clamps to the dataset length", () => {
  assert.equal(revealedCount(ANCHOR, ANCHOR, 50), 1);
  assert.equal(revealedCount(ANCHOR, "2026-08-07", 50), 38);
  assert.equal(revealedCount(ANCHOR, "2030-01-01", 50), 50);
  assert.equal(revealedCount(ANCHOR, "2020-01-01", 50), 1);
});

test("an empty dataset is a programming error, not a silent zero", () => {
  assert.throws(() => dailyIndex(ANCHOR, ANCHOR, 0), /non-empty dataset/);
  assert.throws(() => revealedCount(ANCHOR, ANCHOR, 0), /non-empty dataset/);
});
