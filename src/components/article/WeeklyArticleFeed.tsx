import { ArticleFeed } from "@/components/article/ArticleFeed";
import { WeekHistory } from "@/components/article/WeekHistory";
import { bucketIsoWeeks } from "@/lib/week-windows.mjs";
import type { Article, Locale, Organization } from "@/lib/types";

export function WeeklyArticleFeed({
  articles,
  locale,
  emptyLabel,
  anchor,
  organization,
  blockLimit,
  includeInfeed = true,
}: {
  articles: Article[];
  locale: Locale;
  emptyLabel: string;
  anchor?: string;
  organization?: Organization;
  blockLimit: number;
  includeInfeed?: boolean;
}) {
  if (!anchor) {
    return <ArticleFeed articles={[]} locale={locale} emptyLabel={emptyLabel} />;
  }
  const weeks = bucketIsoWeeks(articles, anchor);
  const first = weeks[0];
  if (!first) {
    return <ArticleFeed articles={[]} locale={locale} emptyLabel={emptyLabel} />;
  }

  return (
    <>
      <ArticleFeed
        articles={first.articles.slice(0, blockLimit)}
        locale={locale}
        emptyLabel={emptyLabel}
        includeInfeed={includeInfeed}
        referenceTime={anchor}
      />
      <WeekHistory
        locale={locale}
        initialWeekKey={first.key}
        availableWeekKeys={weeks.map((week) => week.key)}
        referenceTime={anchor}
        organization={organization}
        blockLimit={blockLimit}
      />
    </>
  );
}
