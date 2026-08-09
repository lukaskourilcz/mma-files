import Link from "next/link";
import { PhotoSlot } from "@/components/media/PhotoSlot";
import { EmptyState } from "@/components/ui/Feedback";
import { NoteChip } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/paths";
import type { Article, Locale } from "@/lib/types";

export function ArticleCard({
  article,
  locale,
  headingLevel = "h3",
  size = "default",
}: {
  article: Article;
  locale: Locale;
  headingLevel?: "h2" | "h3";
  size?: "default" | "compact";
}) {
  const dict = getDictionary(locale);
  const local = article.localizations[locale] ?? article.localizations.cs!;
  const Heading = headingLevel;
  const kicker = article.organization
    ? dict.organizationsShort[article.organization]
    : dict.labels.desk;

  return (
    <article className="group relative h-full border border-rule-strong bg-card hover:border-text">
      <Link href={routes.article(locale, article.slug)} className="flex h-full flex-col">
        {size === "default" ? (
          <span className="relative block aspect-video overflow-hidden bg-well">
            <PhotoSlot
              image={article.image}
              locale={locale}
              note={dict.labels.photoSlots.story}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              useThumbnail
              creditMode="overlay"
            />
          </span>
        ) : null}

        <span className="flex flex-1 flex-col p-4">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[var(--tracking-kicker)] text-accent">
              {kicker}
            </span>
            {article.isDemo ? <NoteChip>{dict.article.demoBadge}</NoteChip> : null}
          </span>
          <Heading
            className={`mt-2 block font-bold leading-[1.3] text-text underline decoration-transparent decoration-[3px] underline-offset-4 group-hover:decoration-accent ${
              size === "compact" ? "text-[15px]" : "text-[length:var(--text-d6)]"
            }`}
          >
            {local.title}
          </Heading>
          {size === "default" ? (
            <span className="mt-2 line-clamp-3 text-[15px] leading-[1.5] text-text-muted">
              {local.dek}
            </span>
          ) : null}
          <time
            dateTime={article.publishAt}
            className="mt-auto pt-4 font-mono text-[12px] tabular-nums text-text-meta"
          >
            {formatDate(article.publishAt, locale, {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </time>
        </span>
      </Link>
    </article>
  );
}

export function ArticleGrid({
  articles,
  locale,
  emptyLabel,
  columns = 3,
}: {
  articles: Article[];
  locale: Locale;
  emptyLabel: string;
  columns?: 2 | 3;
}) {
  if (articles.length === 0) return <EmptyState>{emptyLabel}</EmptyState>;
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {articles.map((article) => (
        <li key={article.id} className="content-auto">
          <ArticleCard article={article} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
