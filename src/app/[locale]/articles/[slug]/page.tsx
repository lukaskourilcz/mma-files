import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleCard } from "@/components/article/ArticleCard";
import { CorrectionNotice } from "@/components/article/CorrectionNotice";
import { ArticleSources } from "@/components/article/ArticleSources";
import { PhotoCredit, PhotoSlot } from "@/components/media/PhotoSlot";
import { Container, Kicker, NoteChip } from "@/components/ui/primitives";
import { absoluteUrl, allowIndexing, siteConfig, siteUrl } from "@/config/site";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { Prose } from "@/lib/markdown";
import { routes } from "@/lib/paths";
import {
  articleCopy,
  getArticleBySlug,
  getArticles,
  getArticlesByOrganization,
  getArticlesIn,
} from "@/lib/repository";
import { LOCALES, isLocale, type Article, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getArticlesIn(locale).map((article) => ({ locale, slug: article.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  const local = articleCopy(article, locale) ?? article.localizations.cs!;
  const indexable = allowIndexing && !article.isDemo;
  return {
    metadataBase: new URL(siteUrl),
    title: local.title,
    description: local.dek,
    alternates: {
      canonical: routes.article(locale, slug),
      languages: { cs: routes.article("cs", slug), "x-default": routes.article("cs", slug) },
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: "article",
      title: local.title,
      description: local.dek,
      url: routes.article(locale, slug),
      publishedTime: article.publishAt,
      modifiedTime: article.updatedAt ?? article.publishAt,
      authors: [siteConfig.byline[locale]],
      locale: "cs_CZ",
      ...(article.image ? { images: [{ url: article.image.src, alt: article.image.alt[locale] }] } : {}),
    },
  };
}

function sectionArticles(article: Article): Article[] {
  const candidates = article.organization
    ? getArticlesByOrganization(article.organization)
    : getArticles();
  return candidates.filter((item) => item.slug !== article.slug);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const local = articleCopy(article, locale);
  if (!local) notFound();
  const section = sectionArticles(article);
  const related = section.slice(0, 3);
  const rail = section.slice(0, 5);
  const internalArtwork = Boolean(article.image && /boardlessai/iu.test(article.image.credit));

  const articleLd = article.isDemo
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: local.title,
        description: local.dek,
        inLanguage: locale,
        datePublished: article.publishAt,
        dateModified: article.updatedAt ?? article.publishAt,
        author: { "@type": "Organization", name: siteConfig.byline[locale] },
        publisher: { "@type": "NewsMediaOrganization", name: siteConfig.name },
        mainEntityOfPage: absoluteUrl(routes.article(locale, slug)),
        isAccessibleForFree: true,
        ...(article.image ? { image: absoluteUrl(article.image.src) } : {}),
      };

  return (
    <article>
      {article.packageHash ? <meta name="boardless-content-hash" content={article.packageHash} /> : null}
      {articleLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      ) : null}

      <header className="border-b border-rule-strong bg-paper">
        <Container className="py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-2">
            <Kicker>
              {article.organization
                ? dict.organizationsShort[article.organization]
                : dict.labels.desk}
            </Kicker>
            {article.isDemo ? <NoteChip>{dict.article.demoBadge}</NoteChip> : null}
          </div>
          <h1 className="display mt-5 max-w-[18ch] text-[length:var(--text-d3)] text-text md:text-[length:var(--text-d2)]">
            {local.title}
          </h1>
          <p className="mt-5 max-w-[60ch] text-[18px] leading-[1.5] text-text-muted md:text-[20px]">
            {local.dek}
          </p>
          <p className="mt-6 font-mono text-[12px] tabular-nums text-text-meta">
            <time dateTime={article.publishAt}>{formatDate(article.publishAt, locale)}</time>
            <span aria-hidden="true"> · </span>
            {dict.article.byline}
          </p>
        </Container>
      </header>

      <AdSlot name="article-top" locale={locale} />

      <Container className="py-8 md:py-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div className="min-w-0">
            <figure>
              <div className="relative aspect-video overflow-hidden border border-rule-strong bg-well">
                <PhotoSlot
                  image={article.image}
                  locale={locale}
                  note={dict.labels.photoSlots.story}
                  sizes="(min-width: 1024px) 900px, 100vw"
                  priority
                />
              </div>
              {article.image ? (
                internalArtwork ? (
                  <figcaption className="border-t border-rule bg-paper px-3 py-2 font-mono text-[11px] text-text-meta">
                    Redakční vizuál · datová ilustrace
                  </figcaption>
                ) : (
                  <PhotoCredit image={article.image} displayCredit={`Foto: ${article.image.credit}`} />
                )
              ) : null}
            </figure>

            {article.corrections?.length ? (
              <div className="mt-7">
                <CorrectionNotice corrections={article.corrections} locale={locale} />
              </div>
            ) : null}

            <Prose
              body={local.body}
              locale={locale}
              className="prose-file mt-10 max-w-[var(--layout-measure)]"
              afterThirdBlock={<AdSlot name="article-mid" locale={locale} className="max-w-none" />}
            />

            <ArticleSources sources={article.sources} locale={locale} />
          </div>

          <aside className="hidden lg:block" aria-label={dict.article.moreFromSection}>
            <AdSlot name="article-rail" locale={locale} />
            {rail.length > 0 ? (
              <section className="mt-10 border-t border-rule-strong pt-6">
                <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-text-meta">
                  {dict.article.moreFromSection}
                </h2>
                <ul className="mt-5 space-y-4">
                  {rail.map((item) => (
                    <li key={item.id}>
                      <ArticleCard article={item} locale={locale} size="compact" />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </Container>

      {related.length > 0 ? (
        <section aria-labelledby="related" className="border-t border-rule-strong bg-card py-12 md:py-16">
          <Container>
            <h2 id="related" className="display text-[length:var(--text-d4)] text-text">
              {dict.article.related}
            </h2>
            <ul className="mt-7 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <ArticleCard article={item} locale={locale} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </article>
  );
}
