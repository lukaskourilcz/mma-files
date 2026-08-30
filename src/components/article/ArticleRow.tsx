import Link from "next/link";
import { PhotoSlot } from "@/components/media/PhotoSlot";
import { Chip, NoteChip } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { formatDate, formatRelative } from "@/lib/format";
import { routes } from "@/lib/paths";
import type { Article, Locale, StoryImage } from "@/lib/types";
import type { WeekArticleCard } from "@/lib/week-chunks";

/**
 * The feed row: the card anatomy at row density.
 *
 * Same ladder as `ArticleCard` — kicker line, Anton headline, mono meta —
 * one step down and without the dek. Its thumbnail carries no credit chip:
 * at 96px the chip covers the picture it is crediting, and the credit is on
 * the article the row links to.
 */
export function ArticleRow({
  article,
  locale,
  referenceTime,
}: {
  article: Article | WeekArticleCard;
  locale: Locale;
  /** Stable snapshot time used for reproducible relative timestamps. */
  referenceTime: string;
}) {
  const dict = getDictionary(locale);
  const delivered = "localizations" in article;
  const local = delivered
    ? article.localizations[locale] ?? article.localizations.cs!
    : { title: article.title, dek: article.dek };
  const organization = delivered ? article.organization : article.org ?? undefined;
  const isDemo = article.isDemo === true;
  const image: StoryImage | undefined = delivered
    ? article.image
    : article.thumbPath
      ? {
          src: article.thumbPath,
          thumbnailSrc: article.thumbPath,
          alt: { cs: article.thumbAlt ?? article.title },
          credit: article.thumbCredit ?? "",
          ...(article.thumbCreditUrl ? { creditUrl: article.thumbCreditUrl } : {}),
        }
      : undefined;
  const delta = new Date(referenceTime).getTime() - new Date(article.publishAt).getTime();
  const timestamp =
    delta >= 0 && delta < 86_400_000
      ? formatRelative(article.publishAt, locale, new Date(referenceTime))
      : formatDate(article.publishAt, locale, {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });

  return (
    <li className="content-auto border-b border-rule last:border-b-0">
      <Link
        href={routes.article(locale, article.slug)}
        className="group grid grid-cols-[96px_minmax(0,1fr)] gap-3 py-4 hover:bg-card md:grid-cols-[160px_minmax(0,1fr)_auto] md:gap-x-5"
      >
        <span className="relative aspect-video self-start overflow-hidden bg-well">
          <PhotoSlot
            image={image}
            locale={locale}
            note={dict.labels.photoSlots.story}
            sizes="(min-width: 768px) 160px, 96px"
            useThumbnail
          />
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span className="label-mono text-accent">{dict.formats[article.format]}</span>
            {organization ? (
              <Chip tone="muted">{dict.organizationsShort[organization]}</Chip>
            ) : null}
            {isDemo ? <NoteChip>{dict.demo.articleBadge}</NoteChip> : null}
          </span>
          <span className="display headline-link mt-2 block text-[length:var(--text-d6)] leading-tight text-text">
            {local.title}
          </span>
          <time
            dateTime={article.publishAt}
            className="label-mono mt-2 block text-text-meta md:hidden"
          >
            {timestamp}
          </time>
        </span>
        <time
          dateTime={article.publishAt}
          className="label-mono hidden self-center text-right text-text-meta md:block"
        >
          {timestamp}
        </time>
      </Link>
    </li>
  );
}
