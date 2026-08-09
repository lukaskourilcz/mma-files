import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  bucketIsoWeeks,
  formatWeekRangeLabel,
  isoWeekBounds,
  isoWeekKey,
} from "../src/lib/week-windows.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));

test("ISO week bucketing crosses a month boundary on Monday", () => {
  assert.equal(isoWeekKey("2026-08-02T23:59:59.000Z"), "2026-W31");
  assert.equal(isoWeekKey("2026-08-03T00:00:00.000Z"), "2026-W32");
  assert.deepEqual(isoWeekBounds("2026-W32"), {
    from: "2026-08-03T00:00:00.000Z",
    to: "2026-08-09T00:00:00.000Z",
  });
});

test("ISO week bucketing crosses the calendar year without splitting week one", () => {
  assert.equal(isoWeekKey("2025-12-29T12:00:00.000Z"), "2026-W01");
  assert.equal(isoWeekKey("2026-01-04T23:59:59.000Z"), "2026-W01");
  assert.equal(isoWeekKey("2026-01-05T00:00:00.000Z"), "2026-W02");
});

test("week windows are newest-first, deterministic and bounded by the lead", () => {
  const windows = bucketIsoWeeks([
    { slug: "older", publishAt: "2026-08-02T16:00:00.000Z" },
    { slug: "lead", publishAt: "2026-08-05T08:00:00.000Z" },
    { slug: "same-week", publishAt: "2026-08-04T09:00:00.000Z" },
    { slug: "future", publishAt: "2026-08-06T08:00:00.000Z" },
  ], "2026-08-05T08:00:00.000Z");

  assert.deepEqual(windows.map((week) => week.key), ["2026-W32", "2026-W31"]);
  assert.deepEqual(windows[0].articles.map((article) => article.slug), ["lead", "same-week"]);
  assert.ok(windows.every((week) => week.articles.every((article) => article.slug !== "future")));
});

test("week labels use explicit Czech UTC formatting", () => {
  assert.equal(formatWeekRangeLabel("2026-W32", "cs-CZ"), "Týden 3.–9. srpna");
  assert.equal(
    formatWeekRangeLabel("2026-W01", "cs-CZ"),
    "Týden 29. prosince 2025–4. ledna 2026",
  );
});

test("the week chunk path contains no ambient clock or random reads", async () => {
  const files = [
    path.join(here, "..", "scripts", "emit-week-chunks.ts"),
    path.join(here, "..", "src", "lib", "week-windows.mjs"),
  ];
  const source = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.doesNotMatch(source, /new Date\(\s*\)|Date\.now\(|Math\.random\(/u);
});
