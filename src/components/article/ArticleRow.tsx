import Link from "next/link";
import { PhotoSlot } from "@/components/media/PhotoSlot";
import { NoteChip } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { formatDate, formatRelative } from "@/lib/format";
import { routes } from "@/lib/paths";
import type { Article, Locale, StoryImage } from "@/lib/types";
import type { WeekArticleCard } from "@/lib/week-chunks";

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
          credit: article.thumbCredit ?? "Redakční vizuál",
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
            creditMode="overlay"
          />
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[11px] font-medium uppercase tracking-[var(--tracking-kicker)] text-accent">
            {organization
              ? dict.organizationsShort[organization]
              : dict.labels.desk}
          </span>
          <span className="mt-1.5 block text-[17px] font-bold leading-[1.3] text-text underline decoration-transparent decoration-[3px] underline-offset-4 group-hover:decoration-accent">
            {local.title}
          </span>
          {isDemo ? (
            <NoteChip className="mt-2">{dict.article.demoBadge}</NoteChip>
          ) : null}
          <time
            dateTime={article.publishAt}
            className="mt-2 block font-mono text-[12px] tabular-nums text-text-meta md:hidden"
          >
            {timestamp}
          </time>
        </span>
        <time
          dateTime={article.publishAt}
          className="hidden self-center text-right font-mono text-[12px] tabular-nums text-text-meta md:block"
        >
          {timestamp}
        </time>
      </Link>
    </li>
  );
}
