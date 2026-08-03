import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/ArticleCard";
import {
  CorrectionHistory,
  MethodologyNote,
  ModelDisclosureBlock,
  TheFile,
} from "@/components/article/ArticleFile";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { DemoNotice } from "@/components/site/HomeModules";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { Chip, Container, SectionHeading } from "@/components/ui/primitives";
import { absoluteUrl, allowIndexing, siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { formatDateTime, formatStamp, readingTimeMinutes } from "@/lib/format";
import { Prose } from "@/lib/markdown";
import { routes } from "@/lib/paths";
import { articleCopy, getArticleBySlug, getArticlesIn, getRelatedArticles } from "@/lib/repository";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

export function generateStaticParams() {
  // Only the locales an article was actually written in. English is optional and on its way
  // out; prerendering /en for an article that has no English half would build a page whose
  // only honest content is a 404.
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
  // Demo stories are never indexable, regardless of the global switch.
  const indexable = allowIndexing && !article.isDemo;

  return {
    title: local.title,
    description: local.dek,
    alternates: {
      canonical: routes.article(locale, slug),
      languages: {
        cs: routes.article("cs", slug),
        "x-default": routes.article("cs", slug),
      },
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
      locale: locale === "cs" ? "cs_CZ" : "en_GB",
      ...(article.image ? { images: [{ url: article.image.src, alt: article.image.alt[locale] }] } : {}),
    },
  };
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

  // An article that was never written in this language does not exist at this URL. Serving the
  // Czech body under lang="en" would be worse than a 404: it reads as an English edition.
  const local = articleCopy(article, locale);
  if (!local) notFound();
  const related = getRelatedArticles(article);
  const minutes = readingTimeMinutes(local.body);

  const crumbs = [
    { href: routes.home(locale), label: dict.nav.home },
    article.organization
      ? {
          href: routes.organization(locale, article.organization),
          label: dict.organizationsShort[article.organization],
        }
      : { href: routes.latest(locale), label: dict.nav.latest },
    { label: dict.formats[article.format] },
  ];

  // Structured data is only emitted for real reporting. Marking fictional demo
  // content up as a NewsArticle would be a lie told to a machine.
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

      <header className="border-b border-rule-strong bg-white">
        <Container className="py-8 md:py-12">
          <Breadcrumbs items={crumbs} />

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Chip tone="ember">{dict.formats[article.format]}</Chip>
            {article.organization ? (
              <Chip tone="muted">{dict.organizations[article.organization]}</Chip>
            ) : null}
            {article.fileNumber ? (
              <span className="label-mono-sm text-muted">
                {dict.labels.file} {String(article.fileNumber).padStart(3, "0")}
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-4xl text-[2rem] leading-[1.06] tracking-[-0.04em] text-ink sm:text-[2.5rem] lg:text-[3.25rem]">
            {local.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted md:text-xl">
            {local.dek}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-5">
            <span className="label-mono text-ink">{siteConfig.byline[locale]}</span>
            <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
            <time dateTime={article.publishAt} className="label-mono-sm text-ink-muted">
              {dict.labels.published} {formatDateTime(article.publishAt, locale)}
            </time>
            {article.updatedAt ? (
              <>
                <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
                <time dateTime={article.updatedAt} className="label-mono-sm text-ember">
                  {dict.labels.updated} {formatStamp(article.updatedAt)}
                </time>
              </>
            ) : null}
            <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
            <span className="label-mono-sm text-muted">
              {minutes} {dict.labels.readingTime}
            </span>
          </div>

          {article.isDemo ? (
            <div className="mt-5">
              <DemoNotice locale={locale} />
            </div>
          ) : null}
        </Container>
      </header>

      <Container className="py-10 md:py-14">
        <HeroVisual
          article={article}
          locale={locale}
          className="aspect-[4/3] sm:aspect-[2/1] lg:aspect-[2.4/1]"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 xl:col-span-8">
            <Prose body={local.body} locale={locale} />

            {article.corrections && article.corrections.length > 0 ? (
              <div className="mt-12">
                <CorrectionHistory corrections={article.corrections} locale={locale} />
              </div>
            ) : null}
          </div>

          <aside className="space-y-6 lg:col-span-5 xl:col-span-4">
            <TheFile article={article} locale={locale} />
            {article.modelDisclosure ? (
              <ModelDisclosureBlock
                disclosure={article.modelDisclosure}
                locale={locale}
              />
            ) : null}
            <MethodologyNote locale={locale} />
          </aside>
        </div>
      </Container>

      {related.length > 0 ? (
        <section
          aria-labelledby="related"
          className="border-t border-rule-strong bg-white py-14 md:py-20"
        >
          <Container>
            <SectionHeading title={dict.labels.relatedStories} />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id} className="relative">
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
