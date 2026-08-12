import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { materializeBoardlessPackage, packageHash } from "../scripts/consume-boardless-package.mjs";

async function root() {
  return mkdtemp(path.join(os.tmpdir(), "mma-files-delivery-"));
}

function article(overrides = {}) {
  const svg = (width, height) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#111"/></svg>`).toString("base64");
  const value = {
    schemaVersion: "article/1",
    slug: "verified-fight-preview",
    localizations: {
      en: { title: "A verified fight preview", dek: "What the file supports.", bodyMDX: "The English body." },
      cs: { title: "Doložená pozvánka", dek: "Co podklady potvrzují.", bodyMDX: "Český text." },
    },
    format: "fight-week-preview",
    sources: [{ kind: "internal", ref: "state/ventures/fightaiq/events/ufc/event.json" }],
    image: {
      hero_path: "public/images/articles/verified-fight-preview/hero.svg",
      thumb_path: "public/images/articles/verified-fight-preview/thumb.svg",
      width: 1600,
      height: 900,
      alt_en: "A verified fixture fight preview",
      alt_cs: "Doložená pozvánka na zkušební zápas",
      license: {
        name: "BoardlessAI deterministic",
        author: "BoardlessAI FRAME",
        source_url: "https://boardless-ai.vercel.app/",
        attribution_html: "Artwork by BoardlessAI FRAME",
      },
      origin: "svg",
      hero_bytes_base64: svg(1600, 900),
      thumb_bytes_base64: svg(640, 360),
    },
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
  const sourced = (value) => ({
    value,
    sourceRefs: ["https://example.com/file"],
    retrievedAt: "2026-08-01T08:00:00.000Z",
    status: "provisional",
    corroborated: false,
  });
  const value = {
    schemaVersion: "fightaiq-delivery/2",
    generatedAt: "2026-08-01T08:30:00.000Z",
    fighters: [{
      schemaVersion: "fighter-card/1",
      id: "ufc:alex-example",
      slug: "alex-example",
      org: "ufc",
      canonicalName: "Alex Example",
      aliases: [],
      identity: { wikidataId: null, wikipediaTitle: "Alex Example", externalIds: {} },
      organizationHistory: [{ org: "ufc", from: null, to: null, status: "active", sourceRefs: ["https://example.com/file"] }],
      sources: [{ id: "source:fixture", url: "https://example.com/file", publisher: "Fixture", title: "Fixture", retrievedAt: "2026-08-01T08:00:00.000Z", evidenceTier: "secondary" }],
      fields: { name: sourced("Alex Example"), division: sourced("Lightweight") },
      criticalFields: ["name", "division"],
      discrepancies: [],
      history: [],
      statsProfiles: [],
      rating: { system: "glicko2", rating: 1500, deviation: 350, volatility: 0.06, boutCount: 0, asOfBoutRef: null, updatedAt: "2026-08-01T08:00:00.000Z" },
      quality: { evidenceTier: "secondary", gaps: ["record"], lastReviewedAt: null },
      changeLog: [{ at: "2026-08-01T08:00:00.000Z", kind: "created", fields: ["identity"], sourceRefs: ["source:fixture"], note: "Fixture record." }],
      completeness: 0.25,
      corroboration: 0,
      modelEligible: false,
      modelVersion: "mma-1.0.0+fixture",
      updatedAt: "2026-08-01T08:00:00.000Z",
    }],
    events: [{
      schemaVersion: "event-card/1",
      id: "ufc:event:fixture-night",
      org: "ufc",
      name: "Fixture Night",
      venue: "Fixture Arena",
      startsAtLocal: "2026-08-08T20:00:00+02:00",
      timeZone: "Europe/Prague",
      startsAtUtc: "2026-08-08T18:00:00.000Z",
      sourceRefs: ["https://example.com/event"],
      bouts: [{ id: "bout-1", red: "ufc:alex-example", blue: "ufc:sam-example", division: "Lightweight", scheduledRounds: 3, status: "announced" }],
      updatedAt: "2026-08-01T08:00:00.000Z",
    }],
    bouts: [{
      schemaVersion: "bout/1",
      id: "ufc:bout:fixture-bout",
      org: "ufc",
      event: { ref: "ufc:event:fixture-night", name: "Fixture Night", startsAtUtc: "2026-08-08T18:00:00.000Z", venue: "Fixture Arena" },
      fighters: { red: "ufc:alex-example", blue: "ufc:sam-example" },
      division: "lightweight",
      scheduledRounds: 3,
      status: "announced",
      statusHistory: [{ status: "announced", at: "2026-08-01T08:00:00.000Z", sourceRefs: ["https://example.com/event"], note: "Fixture." }],
      discovery: { firstSeenAt: "2026-08-01T08:00:00.000Z", lastSeenAt: "2026-08-01T08:00:00.000Z", sourceRefs: ["https://example.com/event"] },
      sourceRefs: ["https://example.com/event"],
      result: null,
      predictionRefs: [],
      changeLog: [{ at: "2026-08-01T08:00:00.000Z", kind: "created", fields: ["status"], sourceRefs: ["https://example.com/event"], note: "Fixture." }],
      updatedAt: "2026-08-01T08:00:00.000Z",
    }],
    statsEntries: [],
    ...overrides,
  };
  return { ...value, packageHash: packageHash(value) };
}

async function adImage(width, height) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: "#0b0b0c",
    },
  })
    .webp()
    .toBuffer();
}

async function adsPackage({
  slotId = "infeed-rectangle",
  width = 300,
  height = 250,
  pixelWidth = width,
  pixelHeight = height,
} = {}) {
  const bytes = await adImage(pixelWidth, pixelHeight);
  return {
    schemaVersion: "mma-ads/1",
    updatedAt: "2026-08-09T12:00:00.000Z",
    slots: {
      [slotId]: {
        enabled: true,
        image: {
          src: `/ads/${slotId}-${width}x${height}.webp`,
          width,
          height,
          bytes_base64: bytes.toString("base64"),
        },
        alt: "Reklamní sdělení",
        href: null,
      },
    },
  };
}

test("matches BoardlessAI locale-aware canonical key ordering", () => {
  assert.equal(packageHash({ Z: 1, a: 2 }), "904baf6c3b55f398cb3d7d18b7b2a5ff2b3e2cef2e9b0b2761fd3c6de6f6882d");
});

test("stores a bilingual article once and rejects a changed same-slot replay", async () => {
  const target = await root();
  try {
    const pkg = article();
    assert.equal((await materializeBoardlessPackage(pkg, target)).status, "written");
    assert.equal((await materializeBoardlessPackage(pkg, target)).status, "noop");
    const changed = article({ format: "data-story" });
    await assert.rejects(materializeBoardlessPackage(changed, target), /different immutable bytes/);
    const stored = JSON.parse(await readFile(path.join(target, "data/boardless/articles.json"), "utf8"));
    assert.equal(stored.packages.length, 1);
    assert.equal((await readFile(path.join(target, pkg.image.hero_path))).equals(Buffer.from(pkg.image.hero_bytes_base64, "base64")), true);
    assert.equal((await readFile(path.join(target, pkg.image.thumb_path))).equals(Buffer.from(pkg.image.thumb_bytes_base64, "base64")), true);
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});

test("refuses a second article at an address the first one already holds", async () => {
  // The desk previewed one fight card on three separate days and gave all three the event's
  // slug. The slug is the URL and the asset directory both: the reader resolves it to the first
  // match, so the later articles would have been stored and then never served.
  const target = await root();
  try {
    const first = article();
    assert.equal((await materializeBoardlessPackage(first, target)).status, "written");

    const sameSlugLaterDay = sign({ ...article(), publishAt: "2026-08-02T08:00:00.000Z" });
    await assert.rejects(
      materializeBoardlessPackage(sameSlugLaterDay, target),
      /reuses the slug of 2026-08-01:am/,
    );

    const ownAddress = sign({
      ...article(),
      publishAt: "2026-08-02T08:00:00.000Z",
      slug: "verified-fight-preview-round-two",
      image: {
        ...article().image,
        hero_path: "public/images/articles/verified-fight-preview-round-two/hero.svg",
        thumb_path: "public/images/articles/verified-fight-preview-round-two/thumb.svg",
      },
    });
    assert.equal((await materializeBoardlessPackage(ownAddress, target)).status, "written");

    const stored = JSON.parse(await readFile(path.join(target, "data/boardless/articles.json"), "utf8"));
    assert.equal(stored.packages.length, 2);
    assert.equal(new Set(stored.packages.map((entry) => entry.slug)).size, 2);
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});

function correctionOf(stored, overrides = {}) {
  const plate = (width, height, fill) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${fill}"/></svg>`).toString("base64");
  const { packageHash: parent, ...rest } = stored;
  return sign({
    ...rest,
    image: {
      ...stored.image,
      alt_cs: "Ilustrační plát, nikoli fotografie osoby",
      hero_bytes_base64: plate(1600, 900, "#222"),
      thumb_bytes_base64: plate(640, 360, "#222"),
    },
    correction: {
      schemaVersion: "article-image-correction/1",
      supersedesPackageHash: parent,
      reason: "The delivered hero was not a photograph of the article's subject.",
      correctedAt: "2026-08-08T22:08:02.960Z",
    },
    ...overrides,
  });
}

test("replaces the picture through the correction door and leaves the words alone", async () => {
  const target = await root();
  try {
    const pkg = article();
    await materializeBoardlessPackage(pkg, target);
    const corrected = correctionOf(pkg);

    const result = await materializeBoardlessPackage(corrected, target);
    assert.equal(result.status, "corrected");
    assert.equal(result.supersededPackageHash, pkg.packageHash);

    const stored = JSON.parse(await readFile(path.join(target, "data/boardless/articles.json"), "utf8"));
    assert.equal(stored.packages.length, 1, "a correction replaces the slot rather than adding one");
    assert.equal(stored.packages[0].packageHash, corrected.packageHash);
    assert.equal(stored.packages[0].localizations.cs.bodyMDX, pkg.localizations.cs.bodyMDX);
    assert.equal(
      (await readFile(path.join(target, corrected.image.hero_path))).equals(Buffer.from(corrected.image.hero_bytes_base64, "base64")),
      true,
      "the delivered picture is overwritten, not preserved",
    );
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});

test("refuses a correction that changes anything a reader read", async () => {
  const target = await root();
  try {
    const pkg = article();
    await materializeBoardlessPackage(pkg, target);

    const smuggled = correctionOf(pkg, {
      localizations: { ...pkg.localizations, cs: { ...pkg.localizations.cs, bodyMDX: "Přepsaný text." } },
    });
    await assert.rejects(materializeBoardlessPackage(smuggled, target), /different immutable bytes/);

    const wrongParent = correctionOf(pkg, {
      correction: {
        schemaVersion: "article-image-correction/1",
        supersedesPackageHash: "0".repeat(64),
        reason: "Names a package this store never held.",
        correctedAt: "2026-08-08T22:08:02.960Z",
      },
    });
    await assert.rejects(materializeBoardlessPackage(wrongParent, target), /different immutable bytes/);

    const malformed = correctionOf(pkg, {
      correction: {
        schemaVersion: "article-image-correction/1",
        supersedesPackageHash: "not-a-digest",
        reason: "Carries no openable parent.",
        correctedAt: "2026-08-08T22:08:02.960Z",
      },
    });
    await assert.rejects(materializeBoardlessPackage(malformed, target), /sha256 digest/);

    const stored = JSON.parse(await readFile(path.join(target, "data/boardless/articles.json"), "utf8"));
    assert.equal(stored.packages[0].packageHash, pkg.packageHash, "the stored package survives every refused correction");
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
    const outOfScope = fightFeed({ fighters: [{ schemaVersion: "fighter-card/1", id: "pfl:bad", org: "pfl" }] });
    await assert.rejects(materializeBoardlessPackage(outOfScope, target), /outside UFC and Oktagon/);
    const leakedOdds = fightFeed({ odds: [{ schemaVersion: "odds-snapshot/1", prices: [{ decimal: 1.8 }] }] });
    await assert.rejects(materializeBoardlessPackage(leakedOdds, target), /must not publish private odds data/);
    const tampered = article();
    tampered.localizations.cs.title = "Changed after signing";
    await assert.rejects(materializeBoardlessPackage(tampered, target), /canonical bytes/);
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});

/** Re-sign a package after editing it, the way the producer would. */
function sign({ packageHash: _stale, ...rest }) {
  return { ...rest, packageHash: packageHash(rest) };
}

test("stores a Czech-only article, and still refuses one with no Czech", async () => {
  // MMA Files is moving to Czech only. The consumer has to accept a package with no English
  // half before BoardlessAI sends one: delivery fails closed and reverts, so a consumer one
  // step behind the desk throws away an article that is perfectly good.
  const target = await root();
  try {
    const czechOnly = article();
    delete czechOnly.localizations.en;
    delete czechOnly.image.alt_en;
    assert.equal((await materializeBoardlessPackage(sign(czechOnly), target)).status, "written");
    const stored = JSON.parse(await readFile(path.join(target, "data/boardless/articles.json"), "utf8"));
    assert.equal(stored.packages.length, 1);
    assert.equal(stored.packages[0].localizations.en, undefined);
    assert.equal(stored.packages[0].localizations.cs.title, "Doložená pozvánka");

    const englishOnly = article();
    delete englishOnly.localizations.cs;
    await assert.rejects(materializeBoardlessPackage(sign(englishOnly), target), /cs\.title/);
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});

test("accepts an explicit article organization and rejects invalid or contradictory values", async () => {
  const target = await root();
  try {
    const explicit = article({ organization: "ufc" });
    assert.equal((await materializeBoardlessPackage(explicit, target)).status, "written");
    const stored = JSON.parse(await readFile(path.join(target, "data/boardless/articles.json"), "utf8"));
    assert.equal(stored.packages[0].organization, "ufc");

    await assert.rejects(
      materializeBoardlessPackage(article({ organization: "pfl", slot: "pm" }), target),
      /organization must be ufc or oktagon/,
    );
    await assert.rejects(
      materializeBoardlessPackage(article({ organization: "oktagon", slot: "pm" }), target),
      /organization contradicts the package references/,
    );
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});

test("materializes a verified ad manifest and creative atomically", async () => {
  const target = await root();
  try {
    const pkg = await adsPackage();
    const first = await materializeBoardlessPackage(pkg, target);
    assert.equal(first.status, "written");
    assert.deepEqual(first.paths, [
      "data/boardless/ads.json",
      "public/ads/infeed-rectangle-300x250.webp",
    ]);
    assert.equal((await materializeBoardlessPackage(pkg, target)).status, "noop");

    const stored = JSON.parse(
      await readFile(path.join(target, "data/boardless/ads.json"), "utf8"),
    );
    assert.equal(stored.schemaVersion, "mma-ads/1");
    assert.equal(stored.slots["infeed-rectangle"].image.bytes_base64, undefined);
    const metadata = await sharp(
      await readFile(path.join(target, "public/ads/infeed-rectangle-300x250.webp")),
    ).metadata();
    assert.deepEqual([metadata.width, metadata.height], [300, 250]);
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});

test("rejects unknown ad slots and off-contract dimensions", async () => {
  const target = await root();
  try {
    await assert.rejects(
      materializeBoardlessPackage(await adsPackage({ slotId: "unknown-slot" }), target),
      /unknown ad slot id/,
    );
    await assert.rejects(
      materializeBoardlessPackage(
        await adsPackage({ width: 301, height: 250 }),
        target,
      ),
      /do not match the slot specification/,
    );
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});

test("rejects ad bytes whose real pixels differ from the manifest", async () => {
  const target = await root();
  try {
    await assert.rejects(
      materializeBoardlessPackage(
        await adsPackage({ pixelWidth: 299, pixelHeight: 250 }),
        target,
      ),
      /ad creative pixels must be 300x250/,
    );
  } finally {
    await rm(target, { recursive: true, force: true });
  }
});
