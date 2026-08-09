import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedPageHeader } from "@/components/article/ArticleFeed";
import { FighterDirectory } from "@/components/fighter/FighterDirectory";
import { Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getFighters } from "@/lib/repository";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: routes.fighters, title: dict.fighters.title, description: dict.fighters.dek });
}

export default async function FightersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  return (
    <>
      <FeedPageHeader title={dict.fighters.title} dek={dict.fighters.dek} />
      <Container className="py-8 md:py-12">
        <FighterDirectory fighters={getFighters()} locale={locale} />
      </Container>
    </>
  );
}
