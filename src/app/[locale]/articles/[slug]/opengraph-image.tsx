import { ImageResponse } from "next/og";
import { OgCard } from "@/components/brand/OgCard";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { getOgFonts } from "@/lib/og-fonts";
import { articleTitle, getArticleBySlug, getArticles } from "@/lib/repository";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — karta článku`;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getArticles().map((article) => ({ locale, slug: article.slug })),
  );
}

/**
 * Typographic share card built from the story's own metadata — the same rule
 * as the on-page heroes: no photography, no generated likeness.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const article = getArticleBySlug(slug);

  const title = article ? articleTitle(article, locale) : siteConfig.name;
  const organization = article?.organization
    ? dict.organizationsShort[article.organization]
    : undefined;

  return new ImageResponse(
    (
      <OgCard
        date={article ? formatDate(article.publishAt, locale) : undefined}
        headline={title}
        kicker={organization}
        variant="article"
      />
    ),
    { ...size, fonts: await getOgFonts() },
  );
}
