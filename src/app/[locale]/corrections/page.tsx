import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Chip, Container, Kicker } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getCorrectionLog } from "@/lib/repository";
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
    path: routes.corrections,
    title: dict.corrections.title,
    description: dict.corrections.dek,
  });
}

export default async function CorrectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const log = getCorrectionLog();

  return (
    <>
      <PageHeader
        crumbs={[
          { href: routes.home(locale), label: dict.nav.home },
          { label: dict.corrections.title },
        ]}
        kicker={`${dict.corrections.title} · ${log.length}`}
        title={dict.corrections.title}
        dek={dict.corrections.dek}
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <section aria-labelledby="log" className="lg:col-span-7">
            <Kicker>{dict.corrections.logTitle}</Kicker>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {dict.corrections.logDek}
            </p>

            {log.length === 0 ? (
              <p className="sheet mt-6 px-5 py-10 text-center text-sm text-ink-muted">
                {dict.corrections.logEmpty}
              </p>
            ) : (
              <ol className="mt-6 space-y-5">
                {log.map(({ correction, article }) => (
                  <li key={`${article.id}-${correction.at}`} className="sheet p-5">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                      <Chip tone="warning">
                        {correction.kind === "correction"
                          ? dict.labels.correction
                          : dict.labels.update}
                      </Chip>
                      <time
                        dateTime={correction.at}
                        className="label-mono-sm text-ink-muted"
                      >
                        {formatDate(correction.at, locale)}
                      </time>
                    </div>

                    <h2 className="mt-3 text-base leading-snug tracking-[-0.02em] text-ink">
                      <Link
                        href={routes.article(locale, article.slug)}
                        className="headline-link"
                      >
                        {article.localizations[locale].title}
                      </Link>
                    </h2>

                    <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                      {correction.note[locale]}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <aside className="space-y-6 lg:col-span-5">
            <section aria-labelledby="policy" className="sheet p-5 md:p-6">
              <h2 id="policy" className="label-mono text-ink">
                {dict.corrections.policyTitle}
              </h2>
              <div className="mt-4 space-y-3.5">
                {dict.corrections.policyBody.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-sm leading-relaxed text-ink-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="report"
              className="rounded-[10px] border border-ember/30 bg-ember-soft p-5 md:p-6"
            >
              <h2 id="report" className="label-mono text-ember">
                {dict.corrections.reportTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                {dict.corrections.reportBody}
              </p>
              <p className="mt-4 font-mono text-sm text-ink">
                {siteConfig.contact.corrections}
              </p>
            </section>
          </aside>
        </div>
      </Container>
    </>
  );
}
