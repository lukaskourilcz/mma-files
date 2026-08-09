import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("homepage client work is split and fetched only near its section", async () => {
  const [home, predictions, weeks, newsletter] = await Promise.all([
    read("src/app/[locale]/page.tsx"),
    read("src/components/fightaiq/HomepagePredictions.tsx"),
    read("src/components/article/DeferredWeekHistory.tsx"),
    read("src/components/site/DeferredNewsletter.tsx"),
  ]);

  assert.match(home, /from "next\/dynamic"/);
  assert.match(predictions, /IntersectionObserver/);
  assert.match(predictions, /import\("@\/components\/fightaiq\/HomepagePredictionsLoaded"\)/);
  assert.match(weeks, /import\("@\/components\/article\/WeekHistory"\)/);
  assert.match(newsletter, /import\("@\/components\/site\/NewsletterModule"\)/);
  assert.doesNotMatch(home, /getFightAiQPredictionDelivery/);
});

test("the lead owns the critical image priority and mono fonts do not", async () => {
  const [photo, lead, layout] = await Promise.all([
    read("src/components/media/PhotoSlot.tsx"),
    read("src/components/article/LeadStory.tsx"),
    read("src/app/[locale]/layout.tsx"),
  ]);

  assert.match(photo, /fetchPriority=\{priority \? "high" : undefined\}/);
  assert.match(lead, /priority/);
  assert.match(layout, /const plexMono = IBM_Plex_Mono\([\s\S]*preload: false/);
});

test("SEO discovery keeps the indexing gates and includes Predikce", async () => {
  const [sitemap, robots, rss, predictions] = await Promise.all([
    read("src/app/sitemap.ts"),
    read("src/app/robots.ts"),
    read("src/app/[locale]/rss.xml/route.ts"),
    read("src/app/[locale]/predikce/page.tsx"),
  ]);

  assert.match(sitemap, /if \(!allowIndexing\) return \[\]/);
  assert.match(sitemap, /localised\(routes\.predictions/);
  assert.match(robots, /if \(!allowIndexing\)/);
  assert.match(rss, /allowIndexing \? getArticlesIn/);
  assert.match(rss, /routes\.predictions\(raw\)/);
  assert.match(predictions, /pageMetadata\(/);
});

test("reader controls retain focus, target and reduced-motion contracts", async () => {
  const [css, footer, primitives, menu, newsletter] = await Promise.all([
    read("src/app/globals.css"),
    read("src/components/site/SiteFooter.tsx"),
    read("src/components/ui/primitives.tsx"),
    read("src/components/site/MobileMenu.tsx"),
    read("src/components/site/NewsletterModule.tsx"),
  ]);

  assert.match(css, /:focus-visible\s*\{\s*outline: 2px solid currentColor;/);
  assert.match(css, /\.ticker-viewport\s*\{\s*overflow-x: auto !important;/);
  assert.match(footer, /min-h-11/);
  assert.match(primitives, /inline-flex min-h-11 items-center/);
  assert.match(menu, /event\.key === "Escape"/);
  assert.match(menu, /document\.body\.style\.overflow = "hidden"/);
  assert.doesNotMatch(newsletter, /outline-none/);
});

test("every primary navigation target has a route file", async () => {
  const navigation = await read("src/config/navigation.ts");
  const builders = [...navigation.matchAll(/routes\.(\w+)\(locale/g)].map((match) => match[1]);
  const routeFiles = {
    latest: "src/app/[locale]/latest/page.tsx",
    predictions: "src/app/[locale]/predikce/page.tsx",
    fightWeek: "src/app/[locale]/fight-week/page.tsx",
    results: "src/app/[locale]/results/page.tsx",
    fighters: "src/app/[locale]/fighters/page.tsx",
  };
  assert.deepEqual(new Set(builders), new Set([...Object.keys(routeFiles), "organization"]));
  await Promise.all(Object.values(routeFiles).map((path) => access(new URL(path, root))));
  await Promise.all(["ufc", "oktagon"].map((organization) =>
    access(new URL(`src/app/[locale]/${organization}/page.tsx`, root))));
});
