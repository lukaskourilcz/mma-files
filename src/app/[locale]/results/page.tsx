import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { ResultsArchive } from "@/components/event/ResultsArchive";
import { FeedPageHeader } from "@/components/article/ArticleFeed";
import { Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getCompletedEvents } from "@/lib/repository";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: routes.results, title: dict.results.title, description: dict.results.dek });
}

export default async function ResultsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  return (
    <>
      <AdSlot name="masthead-billboard" locale={locale} />
      <FeedPageHeader title={dict.results.title} dek={dict.results.dek} />
      <Container className="py-10 md:py-14">
        <ResultsArchive events={getCompletedEvents()} locale={locale} />
      </Container>
    </>
  );
}
