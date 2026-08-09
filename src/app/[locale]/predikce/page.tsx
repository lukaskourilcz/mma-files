import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

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
    path: routes.predictions,
    title: dict.predictions.title,
    description: dict.predictions.intro,
  });
}

export default async function PredictionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader
        crumbs={[
          { href: routes.home(locale), label: dict.nav.home },
          { label: dict.predictions.title },
        ]}
        kicker={dict.predictions.earlyModel}
        title={dict.predictions.title}
        dek={dict.predictions.intro}
      />
      <Container className="py-10 md:py-14">
        <div className="max-w-3xl border-l-4 border-accent bg-surface-raised p-5 md:p-6">
          <p className="font-semibold text-ink">{dict.predictions.disclaimer}</p>
          <p className="mt-3 text-sm text-ink-muted">{dict.predictions.noModel}</p>
        </div>
      </Container>
    </>
  );
}
