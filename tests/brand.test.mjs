import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the shipped wordmarks use Anton outlines and the amended colourways", async () => {
  const [wordmark, inverse, live] = await Promise.all([
    read("public/brand/mma-files-wordmark.svg"),
    read("public/brand/mma-files-wordmark-inverse.svg"),
    read("public/brand/mma-files-wordmark-live.svg"),
  ]);

  assert.doesNotMatch(wordmark, /<text\b/);
  assert.doesNotMatch(inverse, /<text\b/);
  assert.match(wordmark, /oklch\(0\.52 0\.22 27\)/);
  assert.match(inverse, /oklch\(0\.68 0\.19 27\)/);
  assert.match(live, /font-family="Anton"/);
  assert.match(live, />MMA FILES<\/text>/);
});

test("favicon exports have exact dimensions and preserve the coral bar", async () => {
  for (const size of [32, 180, 512]) {
    const image = sharp(
      fileURLToPath(new URL(`../public/brand/mark-${size}.png`, import.meta.url)),
    );
    const metadata = await image.metadata();
    assert.equal(metadata.width, size);
    assert.equal(metadata.height, size);
  }

  const { data, info } = await sharp(
    fileURLToPath(new URL("../public/brand/mark-32.png", import.meta.url)),
  )
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = Array.from({ length: info.width * info.height }, (_, index) =>
    [...data.subarray(index * info.channels, index * info.channels + 3)].join(","),
  );
  assert.ok(pixels.includes("247,94,84"));
});

test("homepage and article cards share the amended token palette", async () => {
  const [card, home, article] = await Promise.all([
    read("src/components/brand/OgCard.tsx"),
    read("src/app/[locale]/opengraph-image.tsx"),
    read("src/app/[locale]/articles/[slug]/opengraph-image.tsx"),
  ]);

  assert.match(card, /chrome: "#0B0B0C"/);
  assert.match(card, /accent: "#C9000C"/);
  assert.match(card, /accentOnDark: "#F75E54"/);
  assert.match(card, /fontFamily: "Anton"/);
  assert.doesNotMatch(`${card}${home}${article}`, /#FF5A00|#09090B|Math\.random|Date\.now|new Date/);
  assert.match(home, /dict\.footer\.blurb/);
  assert.match(article, /dict\.organizationsShort/);
});
