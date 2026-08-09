import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleGrid } from "@/components/article/ArticleCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getArticles } from "@/lib/repository";
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

  return (
    <>
      <AdSlot name="masthead-billboard" locale={locale} />
      <PageHeader
        crumbs={[
          { href: routes.home(locale), label: dict.nav.home },
          { label: dict.latest.title },
        ]}
        kicker={`${dict.latest.title} · ${articles.length}`}
        title={dict.latest.title}
        dek={dict.latest.dek}
      />
      <Container className="py-10 md:py-14">
        <ArticleGrid
          articles={articles}
          locale={locale}
          emptyLabel={dict.latest.empty}
        />
      </Container>
    </>
  );
}
