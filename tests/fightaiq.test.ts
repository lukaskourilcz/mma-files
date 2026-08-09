import assert from "node:assert/strict";
import test from "node:test";
import {
  getDeliveredEvents,
  getDeliveredFighters,
  normalizeDeliveredDivision,
} from "../src/lib/boardless";

test("normalizes MediaWiki division artifacts without guessing an absent value", () => {
  assert.equal(normalizeDeliveredDivision("* Lightweight"), "lightweight");
  assert.equal(normalizeDeliveredDivision("{{plainlist| * Light Heavyweight }}"), "light-heavyweight");
  assert.equal(normalizeDeliveredDivision("Middleweight Light Heavyweight"), "light-heavyweight");
  assert.equal(normalizeDeliveredDivision("{{plainlist|"), undefined);
  assert.equal(normalizeDeliveredDivision(undefined), undefined);
});

test("keeps delivered cards authoritative and derives recent result cards", () => {
  const events = getDeliveredEvents();
  const delivered = events.find((event) => event.slug === "ufc-330-makhachev-vs-machado-garry");
  assert.equal(delivered?.bouts.length, 11);
  assert.ok(events.some((event) => event.organization === "ufc" && event.status === "completed"));
  assert.ok(events.some((event) => event.organization === "oktagon" && event.status === "completed"));
  assert.ok(events.filter((event) => event.status === "completed").every((event) => event.bouts.every((bout) => bout.result)));
});

test("recovers valid fighter divisions but leaves genuinely missing values out", () => {
  const fighters = getDeliveredFighters();
  assert.equal(fighters.find((fighter) => fighter.slug === "makhmud-muradov")?.division, "light-heavyweight");
  assert.equal(fighters.find((fighter) => fighter.slug === "mateusz-legierski")?.division, "lightweight");
  assert.equal(fighters.find((fighter) => fighter.slug === "azamat-bekoev"), undefined);
  assert.equal(fighters.length, 68);
});
