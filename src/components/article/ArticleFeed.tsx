import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleRow } from "@/components/article/ArticleRow";
import { EmptyState } from "@/components/ui/Feedback";
import { Container } from "@/components/ui/primitives";
import type { Article, Locale } from "@/lib/types";

export function ArticleFeed({
  articles,
  locale,
  emptyLabel,
  includeInfeed = true,
}: {
  articles: Article[];
  locale: Locale;
  emptyLabel: string;
  includeInfeed?: boolean;
}) {
  if (articles.length === 0) return <EmptyState>{emptyLabel}</EmptyState>;
  const referenceTime = articles[0]?.publishAt;
  if (!referenceTime) return <EmptyState>{emptyLabel}</EmptyState>;

  return (
    <ol className="divide-y-0 divide-rule">
      {articles.map((article) => (
        <ArticleRow
          key={article.id}
          article={article}
          locale={locale}
          referenceTime={referenceTime}
        />
      )).flatMap((row, index) =>
        includeInfeed && index === 3
          ? [
              row,
              <li key="infeed-rectangle" className="border-b border-rule py-1">
                <AdSlot name="infeed-rectangle" locale={locale} />
              </li>,
            ]
          : [row],
      )}
    </ol>
  );
}

export function FeedPageHeader({
  title,
  dek,
  accent = "var(--color-accent)",
}: {
  title: string;
  dek?: string;
  accent?: string;
}) {
  return (
    <header className="bg-paper">
      <Container className="pt-10 md:pt-14">
        <h1 className="display text-[length:var(--text-d2)] text-text">{title}</h1>
        {dek ? (
          <p className="mt-4 max-w-[68ch] text-[17px] leading-relaxed text-text-muted">{dek}</p>
        ) : null}
        <span className="mt-7 block h-[3px] w-full" style={{ backgroundColor: accent }} />
      </Container>
    </header>
  );
}
