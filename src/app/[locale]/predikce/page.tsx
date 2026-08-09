import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PredictionBoardList } from "@/components/fightaiq/PredictionBoards";
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

function Disclaimer({ children }: { children: string }) {
  return (
    <p className="border border-rule-dark p-3 font-mono text-[12px] font-medium uppercase leading-relaxed tracking-[0.12em] text-accent-on-dark">
      {children}
    </p>
  );
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
    <div className="bg-chrome text-text-inverse">
      <Container className="py-12 md:py-16">
        <header>
          <h1 className="display text-[length:var(--text-d2)] text-text-inverse">
            {dict.predictions.title}
          </h1>
          <p className="mt-5 max-w-[68ch] text-[17px] leading-[1.6] text-text-inverse-muted">
            {dict.predictions.intro}
          </p>
          <div className="mt-6 max-w-[68ch]">
            <Disclaimer>{dict.predictions.disclaimer}</Disclaimer>
          </div>
        </header>

        <div className="mt-14 md:mt-16">
          <PredictionBoardList locale={locale} />
        </div>

        <div className="mt-16">
          <Disclaimer>{dict.predictions.disclaimer}</Disclaimer>
        </div>
      </Container>
    </div>
  );
}
