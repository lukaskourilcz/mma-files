import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { FightAiQFeed } from "@/components/fightaiq/FightAiQFeed";
import { ActionLink, Container, SectionHeading } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getCoverageStats, getFightAiQDelivery } from "@/lib/repository";
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
    path: routes.dataDesk,
    title: dict.dataDesk.title,
    description: dict.dataDesk.dek,
  });
}

export default async function DataDeskPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const stats = getCoverageStats();
  const fightAiQ = getFightAiQDelivery();

  const figures = [
    { label: dict.dataDesk.fighterFiles, value: stats.fighterFiles },
    { label: dict.dataDesk.eventFiles, value: stats.eventFiles },
    { label: dict.dataDesk.sourceRefs, value: stats.sourceRefs },
    { label: dict.dataDesk.fieldsTracked, value: stats.fieldsTracked },
  ];

  return (
    <>
      <PageHeader
        crumbs={[
          { href: routes.home(locale), label: dict.nav.home },
          { label: dict.dataDesk.title },
        ]}
        kicker={`${siteConfig.dataLayer.name} · ${siteConfig.dataLayer.mode}`}
        title={dict.dataDesk.title}
        dek={dict.dataDesk.dek}
      />

      <section
        aria-labelledby="coverage"
        className="border-b border-rule-dark bg-ink py-12 text-white md:py-16"
      >
        <Container>
          <SectionHeading
            title={dict.dataDesk.coverageTitle}
            dek={dict.dataDesk.coverageDek}
            tone="paper"
          />
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {figures.map((figure) => (
              <div key={figure.label} className="border-t border-rule-dark pt-4">
                <dd className="text-[2.5rem] font-bold leading-none tracking-[-0.045em] text-white md:text-[3rem]">
                  {figure.value}
                </dd>
                <dt className="label-mono-sm mt-3 text-paper-muted">{figure.label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <FightAiQFeed locale={locale} snapshot={fightAiQ} />

      <Container className="py-12 md:py-16">
        <section aria-labelledby="boundaries" className="max-w-3xl">
          <div className="border border-correction-rule bg-correction p-5 md:p-6">
            <h2 id="boundaries" className="label-mono text-text">
              {dict.dataDesk.boundaryTitle}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink">
              {dict.dataDesk.boundaryLead}
            </p>
            <ul className="mt-4 space-y-2.5">
              {dict.dataDesk.boundaries.map((item) => (
                <li key={item} className="relative pl-4 text-sm leading-relaxed text-ink-muted">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[0.62em] block h-[1px] w-2.5 bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-correction-rule pt-4 text-xs leading-relaxed text-ink-muted">
              {dict.dataDesk.boundaryFooter}
            </p>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink-muted">
            {dict.dataDesk.responsiblePlay}
          </p>

          <div className="mt-6">
            <ActionLink href={routes.howItWorks(locale)}>
              {dict.actions.howChecked}
            </ActionLink>
          </div>
        </section>
      </Container>
    </>
  );
}
