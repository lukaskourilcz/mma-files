import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { articleCopy, getArticles, getLeadArticle } from "@/lib/repository";
import type { WeekArticleCard } from "@/lib/week-chunks";
import { bucketIsoWeeks } from "@/lib/week-windows.mjs";

const outputDirectory = path.join(process.cwd(), "public", "data", "weeks");

function publicCard(article: ReturnType<typeof getArticles>[number]): WeekArticleCard {
  const copy = articleCopy(article, "cs");
  if (!copy) throw new Error(`published article lacks Czech copy: ${article.slug}`);
  const rawCredit = article.image?.credit ?? null;
  return {
    slug: article.slug,
    title: copy.title,
    dek: copy.dek,
    org: article.organization ?? null,
    publishAt: article.publishAt,
    thumbPath: article.image?.thumbnailSrc ?? article.image?.src ?? null,
    thumbAlt: article.image?.alt.cs ?? null,
    thumbCredit: rawCredit && !/boardlessai/iu.test(rawCredit) ? rawCredit : null,
    thumbCreditUrl: rawCredit && !/boardlessai/iu.test(rawCredit)
      ? article.image?.creditUrl ?? null
      : null,
    isDemo: article.isDemo === true,
  };
}

async function cleanJsonFiles(): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });
  const entries = await readdir(outputDirectory, { withFileTypes: true });
  await Promise.all(entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => unlink(path.join(outputDirectory, entry.name))));
}

export async function emitWeekChunks(): Promise<void> {
  await cleanJsonFiles();
  const lead = getLeadArticle();
  const weeks = lead ? bucketIsoWeeks(getArticles(), lead.publishAt) : [];
  const index = weeks.map((week) => week.key);

  await Promise.all([
    writeFile(path.join(outputDirectory, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8"),
    ...weeks.map((week) => writeFile(
      path.join(outputDirectory, `${week.key}.json`),
      `${JSON.stringify(week.articles.map(publicCard), null, 2)}\n`,
      "utf8",
    )),
  ]);
}

emitWeekChunks().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
