import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { materializeBoardlessPackage, packageHash } from "../scripts/consume-boardless-package.mjs";

async function root() {
  return mkdtemp(path.join(os.tmpdir(), "mma-files-delivery-"));
}

function article(overrides = {}) {
  const value = {
    schemaVersion: "article/1",
    slug: "verified-fight-preview",
    localizations: {
      en: { title: "A verified fight preview", dek: "What the file supports.", bodyMDX: "The English body." },
      cs: { title: "Doložená pozvánka", dek: "Co podklady potvrzují.", bodyMDX: "Český text." },
    },
    format: "fight-week-preview",
    sources: [{ kind: "internal", ref: "state/ventures/fightaiq/events/ufc/event.json" }],
    heroSpec: { template: "data-card", bindings: { label: "Verified" } },
    fighterRefs: ["ufc:alex-example"],
    eventRef: "ufc:event:fixture-night",
    publishAt: "2026-08-01T08:00:00.000Z",
    slot: "am",
    status: "published",
    ...overrides,
  };
  return { ...value, packageHash: packageHash(value) };
}

function fightFeed(overrides = {}) {
  const value = {
    schemaVersion: "fightaiq-delivery/1",
    generatedAt: "2026-08-01T08:30:00.000Z",
    fighters: [{ schemaVersion: "fighter-record/1", id: "ufc:alex-example", org: "ufc" }],
    events: [{ schemaVersion: "event-card/1", id: "ufc:event:fixture-night", org: "ufc" }],
    odds: [], modelRuns: [], edgeReports: [], slips: [], trackRecord: null,
    ...overrides,
  };
  return { ...value, packageHash: packageHash(value) };
}

test("stores a bilingual article once and rejects a changed same-slot replay", async () => {
  const target = await root();
  try {
    const pkg = article();
    assert.equal((await materializeBoardlessPackage(pkg, target)).status, "written");
    assert.equal((await materializeBoardlessPackage(pkg, target)).status, "noop");
    const changed = article({ slug: "different-story" });
    await assert.rejects(materializeBoardlessPackage(changed, target), /different immutable bytes/);
    const stored = JSON.parse(await readFile(path.join(target, "data/boardless/articles.json"), "utf8"));
    assert.equal(stored.packages.length, 1);
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});

test("stores the newest FightAIQ snapshot and rejects stale replacement", async () => {
  const target = await root();
  try {
    const current = fightFeed();
    assert.equal((await materializeBoardlessPackage(current, target)).status, "written");
    assert.equal((await materializeBoardlessPackage(current, target)).status, "noop");
    const stale = fightFeed({ generatedAt: "2026-07-31T08:30:00.000Z" });
    await assert.rejects(materializeBoardlessPackage(stale, target), /newer FightAIQ snapshot/);
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});

test("rejects out-of-scope organizations and tampered hashes", async () => {
  const target = await root();
  try {
    const outOfScope = fightFeed({ fighters: [{ schemaVersion: "fighter-record/1", id: "ksw:bad", org: "ksw" }] });
    await assert.rejects(materializeBoardlessPackage(outOfScope, target), /outside UFC and Oktagon/);
    const tampered = article();
    tampered.localizations.en.title = "Changed after signing";
    await assert.rejects(materializeBoardlessPackage(tampered, target), /canonical bytes/);
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});
