import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrganizationPage } from "@/components/pages/OrganizationPage";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { LOCALES, isLocale } from "@/lib/types";

const ORGANIZATION = "ufc" as const;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: (l) => routes.organization(l, ORGANIZATION),
    title: dict.organizations[ORGANIZATION],
    description: dict.organizationPage.dek,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <OrganizationPage locale={locale} organization={ORGANIZATION} />;
}
