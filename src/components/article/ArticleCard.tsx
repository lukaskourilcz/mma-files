import Link from "next/link";
import { PhotoSlot } from "@/components/media/PhotoSlot";
import { EmptyState } from "@/components/ui/Feedback";
import { Chip, NoteChip } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/paths";
import type { Article, Locale } from "@/lib/types";

/**
 * The card anatomy, shared with `ArticleRow`: kicker line, Anton headline,
 * dek, mono meta.
 *
 * Importance is carried by density and by the picture, never by a shadow or a
 * different border — every panel on this site is one hairline on a flat
 * surface. `compact` is the rail and in-column variant: same ladder, one step
 * down, dek dropped.
 */
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
  const compact = size === "compact";
  // A thumbnail renders wherever the delivery has one — the compact card used
  // to drop the picture even when the file carried it.
  const thumbnail = article.image?.thumbnailSrc ?? article.image?.src;

  return (
    <article className="group relative h-full border border-rule-strong bg-card hover:border-text">
      <Link href={routes.article(locale, article.slug)} className="flex h-full flex-col">
        {thumbnail ? (
          <span className="relative block aspect-video overflow-hidden bg-well">
            <PhotoSlot
              image={article.image}
              locale={locale}
              note={dict.labels.photoSlots.story}
              sizes={compact ? "300px" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"}
              useThumbnail
              {...(compact ? {} : { creditMode: "overlay" as const })}
            />
          </span>
        ) : null}

        <span className={`flex flex-1 flex-col ${compact ? "p-3.5" : "p-4"}`}>
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span className="label-mono text-accent">{dict.formats[article.format]}</span>
            {article.organization ? (
              <Chip tone="muted">{dict.organizationsShort[article.organization]}</Chip>
            ) : null}
            {article.isDemo ? <NoteChip>{dict.demo.articleBadge}</NoteChip> : null}
          </span>

          <Heading
            className={`display headline-link mt-2.5 block leading-tight text-text ${
              compact ? "text-[length:var(--text-d6)]" : "text-[length:var(--text-d5)]"
            }`}
          >
            {local.title}
          </Heading>

          {compact ? null : (
            <span className="mt-2 line-clamp-3 text-[length:var(--text-sm)] leading-[1.5] text-text-muted">
              {local.dek}
            </span>
          )}

          <time
            dateTime={article.publishAt}
            className="label-mono mt-auto pt-4 text-text-meta"
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
