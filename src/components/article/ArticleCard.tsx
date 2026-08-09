import Link from "next/link";
import { PhotoSlot } from "@/components/media/PhotoSlot";
import { getDictionary } from "@/i18n";
import { formatDate, readingTimeMinutes } from "@/lib/format";
import { routes } from "@/lib/paths";
import { accentFor } from "@/lib/promotion";
import type { Article, Locale } from "@/lib/types";

/**
 * A file card: 16:9 photo slot with the promotion rule and badge, then the
 * headline, the dek, and a footer of date and read time.
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
  /** `compact` drops the photo slot and the dek — used in sidebars. */
  size?: "default" | "compact";
}) {
  const dict = getDictionary(locale);
  // Czech is the locale every article has; a card in a language the article was never
  // written in shows its Czech copy rather than an empty tile.
  const local = article.localizations[locale] ?? article.localizations.cs!;
  const Heading = headingLevel;
  const minutes = readingTimeMinutes(local.body);
  const accent = accentFor(article.organization);
  const promotion = article.organization
    ? dict.organizationsShort[article.organization]
    : dict.labels.desk;

  return (
    <article className="sheet sheet-hover flex h-full flex-col">
      {size === "default" ? (
        <div className="relative aspect-video overflow-hidden border-b border-rule">
          <PhotoSlot
            image={article.image}
            locale={locale}
            note={dict.labels.photoSlots.story}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            useThumbnail
          />
          <span
            aria-hidden="true"
            style={{ backgroundColor: accent }}
            className="absolute left-0 top-0 z-10 h-1 w-full"
          />
          <span
            style={{ backgroundColor: `color-mix(in oklch, ${accent} 88%, black)` }}
            className="label-mono-sm absolute bottom-3 left-3 z-10 px-2 py-1 font-semibold tracking-[0.14em] text-white"
          >
            {promotion}
          </span>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4 md:px-4.5 md:pb-4.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="label-mono-sm font-semibold tracking-[0.16em] text-ink-muted">
            {dict.formats[article.format]}
          </span>
        </div>

        <Heading
          className={`mt-2.5 font-extrabold leading-[1.16] tracking-[-0.01em] text-ink ${
            size === "compact" ? "text-[1.0625rem]" : "text-[1.25rem]"
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
          <p className="mt-2 line-clamp-3 text-[13.5px] leading-[1.55] text-ink-muted">
            {local.dek}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-4">
          <time
            dateTime={article.publishAt}
            className="label-mono-sm tracking-[0.14em] text-ink-meta"
          >
            {formatDate(article.publishAt, locale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
          <span aria-hidden="true" className="h-2.5 w-px bg-rule-strong" />
          <span className="label-mono-sm tracking-[0.14em] text-ink-meta">
            {minutes} {dict.labels.readingTime}
          </span>
        </div>
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
      className={`grid gap-5 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}
    >
      {articles.map((article) => (
        <li key={article.id} className="relative">
          <ArticleCard article={article} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
