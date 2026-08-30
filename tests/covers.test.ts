import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TypographicCover, monogram } from "../src/components/hero/TypographicCover";
import { getFighters } from "../src/lib/repository";

const root = path.resolve(import.meta.dirname, "..");

function cover(seed: string, headline = "Nunesová: kariéra v číslech", variant: "file" | "monogram" = "file") {
  return renderToStaticMarkup(
    createElement(TypographicCover, { seed, headline, variant, label: headline }),
  );
}

test("the cover is deterministic: same seed, same markup", () => {
  assert.equal(cover("ufc-amanda-nunes"), cover("ufc-amanda-nunes"));
  assert.equal(cover("ufc-amanda-nunes"), cover("ufc-amanda-nunes"));
});

test("the cover reads its variation from the seed, not from chance", () => {
  const seeds = ["ufc-amanda-nunes", "ufc-alonzo-menifield", "oktagon-viktor-pesta", "ufc-alex-perez"];
  const rendered = seeds.map((seed) => cover(seed));
  assert.ok(new Set(rendered).size > 1, "different seeds must produce different covers");

  // And each of those is itself stable, not merely different from its neighbour.
  for (const [index, seed] of seeds.entries()) {
    assert.equal(cover(seed), rendered[index]);
  }
});

test("no clock and no randomness reaches the cover", async () => {
  const source = await readFile(path.join(root, "src/components/hero/TypographicCover.tsx"), "utf8");
  assert.doesNotMatch(source, /Math\.random|Date\.now\(\)|new Date\(/u);
});

test("HeroVisual is gone rather than left dead in the tree", async () => {
  await assert.rejects(access(path.join(root, "src/components/hero/HeroVisual.tsx")));

  const files: string[] = [];
  const walk = async (dir: string): Promise<void> => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.tsx?$/u.test(entry.name)) files.push(full);
    }
  };
  await walk(path.join(root, "src"));
  // Prose about what it replaced is fine; an import or a render is not.
  for (const file of files) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /hero\/HeroVisual|<HeroVisual/u, `${file} still uses HeroVisual`);
  }
});

test("delivered hero templates are honoured, not coerced to data-card", async () => {
  const store = JSON.parse(await readFile(path.join(root, "data/boardless/articles.json"), "utf8")) as {
    packages: Array<{ heroSpec: { template: string } }>;
  };
  const delivered = new Set(store.packages.map((entry) => entry.heroSpec.template));
  assert.ok(delivered.size > 0, "the delivery still carries hero templates");

  const types = await readFile(path.join(root, "src/lib/types.ts"), "utf8");
  const union = types.slice(types.indexOf("export type HeroTemplate ="), types.indexOf(";", types.indexOf("export type HeroTemplate =")));
  for (const template of delivered) {
    assert.ok(union.includes(`"${template}"`), `HeroTemplate must include ${template}`);
  }
});

test("monograms come from the name, and stay inside two initials", () => {
  assert.equal(monogram("Amanda Nunes"), "AN");
  assert.equal(monogram("Ian Machado Garry"), "IM");
  assert.equal(monogram("Khabib"), "K");
  assert.equal(monogram("  Jiří   Procházka "), "JP");
  assert.equal(monogram("Šárka Ž"), "ŠŽ");
});

test("every fighter gets a portrait treatment, none of them invented", () => {
  const fighters = getFighters();
  assert.ok(fighters.length > 0);
  for (const fighter of fighters) {
    const initials = monogram(fighter.name);
    assert.ok(initials.length >= 1 && initials.length <= 2, `${fighter.name} → ${initials}`);
    assert.equal(cover(`${fighter.organization}:${fighter.slug}`, fighter.name, "monogram").includes(initials), true);
  }
});
