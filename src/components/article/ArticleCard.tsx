import Link from "next/link";
import { Chip } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { formatDate, readingTimeMinutes } from "@/lib/format";
import { routes } from "@/lib/paths";
import type { Article, Locale } from "@/lib/types";

export function FileNumber({ article }: { article: Article }) {
  if (!article.fileNumber) return null;
  return (
    <span className="label-mono-sm text-muted">
      {String(article.fileNumber).padStart(3, "0")}
    </span>
  );
}

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
  const local = article.localizations[locale];
  const Heading = headingLevel;
  const minutes = readingTimeMinutes(local.body);

  return (
    <article className="sheet sheet-hover group flex h-full flex-col p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Chip tone="ember">{dict.formats[article.format]}</Chip>
        {article.organization ? (
          <Chip tone="muted">{dict.organizationsShort[article.organization]}</Chip>
        ) : null}
        <FileNumber article={article} />
      </div>

      <Heading
        className={`mt-4 tracking-[-0.025em] text-ink ${
          size === "compact" ? "text-[1.0625rem] leading-snug" : "text-xl leading-[1.22] md:text-[1.375rem]"
        }`}
      >
        <Link
          href={routes.article(locale, article.slug)}
          className="headline-link after:absolute after:inset-0"
        >
          {local.title}
        </Link>
      </Heading>

      {size === "default" ? (
        <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-muted">
          {local.dek}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-5">
        <time
          dateTime={article.publishAt}
          className="label-mono-sm text-ink-muted"
        >
          {formatDate(article.publishAt, locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
        <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
        <span className="label-mono-sm text-muted">
          {minutes} {dict.labels.readingTime}
        </span>
        {article.isDemo ? (
          <>
            <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
            <span className="label-mono-sm text-ember">{dict.labels.demoShort}</span>
          </>
        ) : null}
      </div>
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
  if (articles.length === 0) {
    return (
      <p className="sheet px-5 py-10 text-center text-sm text-ink-muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul
      className={`grid gap-5 sm:grid-cols-2 ${
        columns === 3 ? "lg:grid-cols-3" : ""
      }`}
    >
      {articles.map((article) => (
        <li key={article.id} className="relative">
          <ArticleCard article={article} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
