import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(tsx?|mjs)$/u.test(entry.name)) yield full;
  }
}

async function sourceFiles() {
  const files = [];
  for await (const file of walk(src)) files.push(file);
  return files;
}

/**
 * Colour names the `@theme` block actually defines. Tailwind v4 generates a
 * utility only for a token that exists, so anything else is a class that
 * silently paints nothing — the failure this file exists to catch.
 */
async function definedColours() {
  const css = await readFile(path.join(root, "src/app/globals.css"), "utf8");
  const theme = css.slice(css.indexOf("@theme {"), css.indexOf("@keyframes ticker"));
  return {
    colours: new Set([...theme.matchAll(/--color-([a-z0-9-]+):/gu)].map((match) => match[1])),
    textSizes: new Set([...theme.matchAll(/--text-([a-z0-9-]+):/gu)].map((match) => match[1])),
  };
}

/* The utilities that were live in the tree before the token layer was restored.
 * They are listed by name so a regression names itself in the failure output. */
const RETIRED = [
  "text-ink", "text-ink-muted", "text-ink-meta", "text-muted", "text-graphite",
  "text-ember", "text-paper-muted", "text-paper-meta",
  "bg-ink", "bg-ember", "bg-ember-soft", "bg-danger", "bg-rule-dark-strong",
  "border-ember", "decoration-ember",
];

test("no utility references a retired colour name", async () => {
  const offenders = [];
  for (const file of await sourceFiles()) {
    const text = await readFile(file, "utf8");
    text.split("\n").forEach((line, index) => {
      for (const name of RETIRED) {
        const pattern = new RegExp(String.raw`(?<![\w\-/])${name}(?![\w\-])`, "u");
        if (pattern.test(line)) offenders.push(`${path.relative(root, file)}:${index + 1} ${name}`);
      }
    });
  }
  assert.deepEqual(offenders, []);
});

/* Prefixes whose value is a colour, longest first so `ring-offset-` wins over `ring-`. */
const COLOUR_PREFIXES = [
  "ring-offset", "placeholder", "decoration", "divide", "outline", "stroke",
  "accent", "border", "caret", "text", "fill", "ring", "from", "via", "bg", "to",
];

/* Values that are legal after a colour prefix but are not colours. */
const KEYWORDS = {
  text: ["center", "left", "right", "justify", "start", "end", "wrap", "nowrap", "balance",
    "pretty", "ellipsis", "clip", "auto", "xs", "sm", "base", "lg", "xl"],
  border: ["solid", "dashed", "dotted", "double", "hidden", "none", "collapse", "separate", "spacing"],
  divide: ["solid", "dashed", "dotted", "double", "none"],
  ring: ["inset", "offset"],
  outline: ["none", "hidden", "solid", "dashed", "dotted", "double", "offset"],
  decoration: ["solid", "dashed", "dotted", "double", "wavy", "none", "slice", "clone", "auto", "from-font"],
  stroke: ["none"],
  fill: ["none"],
  bg: ["fixed", "local", "scroll", "clip", "origin", "bottom", "center", "left", "right", "top",
    "repeat", "no", "auto", "cover", "contain", "none", "gradient", "linear", "radial", "conic",
    "blend", "size", "position"],
};

const BUILTIN = new Set(["white", "black", "transparent", "current", "inherit"]);
const PALETTE = /^(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}$/u;
/* `border-t-2`, `divide-y-0` and friends: a side plus a width, never a colour. */
const SIDE_WIDTH = /^[tblrxyse](?:-\d+)?$/u;
const NUMERIC_TEXT = /^\dxl$/u;

test("every colour utility in src resolves to a token the theme defines", async () => {
  const { colours, textSizes } = await definedColours();
  const offenders = [];

  for (const file of await sourceFiles()) {
    const text = await readFile(file, "utf8");
    text.split("\n").forEach((line, index) => {
      for (const match of line.matchAll(/(?<![\w\-/.])(?:[a-z0-9-]+:)*([a-z][a-z0-9-]*)(?:\/\d+)?(?![\w\-/.])/gu)) {
        const utility = match[1];
        const prefix = COLOUR_PREFIXES.find((candidate) => utility.startsWith(`${candidate}-`));
        if (!prefix) continue;
        const value = utility.slice(prefix.length + 1);
        if (!value || value.endsWith("-") || /^\d/u.test(value)) continue;
        if (BUILTIN.has(value) || PALETTE.test(value) || colours.has(value)) continue;
        if (KEYWORDS[prefix]?.includes(value)) continue;
        if (prefix === "text" && (textSizes.has(value) || NUMERIC_TEXT.test(value))) continue;
        if ((prefix === "border" || prefix === "divide") && SIDE_WIDTH.test(value)) continue;
        offenders.push(`${path.relative(root, file)}:${index + 1} ${utility}`);
      }
    });
  }

  assert.deepEqual(offenders, []);
});

test("every text size comes from the scale, not from a pixel value", async () => {
  const offenders = [];
  for (const file of await sourceFiles()) {
    const text = await readFile(file, "utf8");
    text.split("\n").forEach((line, index) => {
      for (const match of line.matchAll(/(?<![\w-])(?:[a-z0-9-]+:)*text-\[[0-9][^\]]*\]/gu)) {
        offenders.push(`${path.relative(root, file)}:${index + 1} ${match[0]}`);
      }
    });
  }
  assert.deepEqual(
    offenders,
    [],
    "map the size onto a --text-* token, or add the missing step to @theme",
  );
});

test("card and row headlines keep the display face at small sizes", async () => {
  for (const name of ["ArticleCard", "ArticleRow"]) {
    const source = await readFile(path.join(root, `src/components/article/${name}.tsx`), "utf8");
    assert.match(source, /className=\{?[`"][^`"]*\bdisplay\b/u, `${name} headline uses the display face`);
    assert.match(source, /text-\[length:var\(--text-d[56]\)\]/u, `${name} headline sits on d5 or d6`);
    assert.match(source, /dict\.formats\[/u, `${name} kicker names the format`);
    assert.match(source, /thumbnailSrc|useThumbnail/u, `${name} renders a thumbnail`);
  }
});

test("one demo wording, and something still reads it", async () => {
  const dictionary = await readFile(path.join(root, "src/i18n/cs.ts"), "utf8");
  const wording = "Ukázkový obsah";
  assert.equal(
    dictionary.split(wording).length - 1,
    1,
    "the demo badge wording is declared exactly once",
  );

  const readers = [];
  for (const file of await sourceFiles()) {
    if ((await readFile(file, "utf8")).includes("dict.demo.articleBadge")) readers.push(file);
  }
  assert.ok(readers.length > 0, "the surviving key is the one that renders");
});

test("the site keeps square corners and one page opening", async () => {
  const offenders = [];
  for (const file of await sourceFiles()) {
    const text = await readFile(file, "utf8");
    text.split("\n").forEach((line, index) => {
      if (/(?<![\w-])rounded(?:-[a-z0-9[\]./-]+)?(?![\w-])/u.test(line)) {
        offenders.push(`${path.relative(root, file)}:${index + 1}`);
      }
    });
  }
  assert.deepEqual(offenders, [], "--radius is 0; no rounded-* utility belongs in the tree");

  const feed = await readFile(path.join(root, "src/components/article/ArticleFeed.tsx"), "utf8");
  assert.match(feed, /return <PageHeader /u, "FeedPageHeader must delegate, not fork the opening");

  const header = await readFile(path.join(root, "src/components/ui/PageHeader.tsx"), "utf8");
  assert.match(header, /<h1 className="display /u, "the page H1 is set in Anton");
});
