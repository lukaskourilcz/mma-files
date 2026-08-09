import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { FeedPageHeader } from "@/components/article/ArticleFeed";
import { WeeklyArticleFeed } from "@/components/article/WeeklyArticleFeed";
import { Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getArticles, getLeadArticle } from "@/lib/repository";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = getDictionary(raw);
  return pageMetadata({
    locale: raw,
    path: routes.latest,
    title: dict.latest.title,
    description: dict.latest.dek,
  });
}

export default async function LatestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const articles = getArticles();
  const lead = getLeadArticle();

  return (
    <>
      <AdSlot name="masthead-billboard" locale={locale} />
      <FeedPageHeader title={dict.latest.title} dek={dict.latest.dek} />
      <Container className="py-10 md:py-14">
        <WeeklyArticleFeed
          articles={articles}
          locale={locale}
          emptyLabel={dict.latest.empty}
          anchor={lead?.publishAt}
          blockLimit={12}
        />
      </Container>
      <AdSlot name="footer-billboard" locale={locale} />
    </>
  );
}
