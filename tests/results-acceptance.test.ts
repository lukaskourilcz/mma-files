import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ResultsBoard } from "../src/components/event/ResultsBoard";
import { deduplicateCompletedBouts, getDeliveredEvents, getFightAiQResultDelivery } from "../src/lib/boardless";
import { getUpcomingEvents } from "../src/lib/repository";

test("the public result cards contain one line for each repeated historical result", () => {
  const events = getDeliveredEvents();
  const ufc = events.find((event) => event.slug === "history-ufc-fight-night-du-plessis-vs-usman");
  const oktagon = events.find((event) => event.slug === "history-oktagon-92");
  assert.ok(ufc && oktagon, "the observed public cards are represented");
  assert.equal(ufc.bouts.length, 1);
  assert.equal(oktagon.bouts.filter((bout) => [bout.red.fighterRef, bout.blue.fighterRef].includes("fighter:oktagon/makhmud-muradov")).length, 1);
});

test("equivalent history merges evidence but preserves rematches and conflicting results", () => {
  const original = getFightAiQResultDelivery().bouts.find((bout) => bout.result?.winner === "red" && bout.id.includes(":bout:history-"))!;
  assert.ok(original?.result);
  const before = JSON.stringify(original);
  const duplicate = { ...original, id: "ufc:bout:history-duplicate", fighters: { red: original.fighters.blue, blue: original.fighters.red }, result: { ...original.result, winner: "blue" as const }, sourceRefs: ["source:additional"] };
  const conflict = { ...original, id: "ufc:bout:history-conflict", result: { ...original.result, winner: "blue" as const } };
  const rematch = { ...original, id: "ufc:bout:history-rematch", event: { ...original.event, startsAtUtc: "2026-09-07T00:00:00.000Z" } };
  const result = deduplicateCompletedBouts([original, duplicate, conflict, rematch]);
  assert.equal(result.length, 3);
  assert.ok(result[0]);
  assert.ok(result[0].sourceRefs.includes("source:additional"));
  assert.equal(JSON.stringify(original), before, "delivery bytes are not mutated");
});

test("upcoming cards follow the current clock rather than a stale delivery timestamp", (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-07T12:00:00Z") });
  assert.ok(getUpcomingEvents("2026-08-01T00:00:00Z").length > 0, "fixture includes formerly upcoming cards");
  assert.ok(getUpcomingEvents(new Date()).every((event) => Date.parse(event.startsAt) >= Date.now()));
  const html = renderToStaticMarkup(createElement(ResultsBoard, { locale: "cs" }));
  assert.ok(!html.includes("Gamrot vs. Salkilld"), "the past event is not labelled next on the homepage");
});
