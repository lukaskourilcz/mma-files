import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container, Kicker, SectionHeading } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getCoverageStats } from "@/lib/repository";
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
    path: routes.howItWorks,
    title: dict.howItWorks.title,
    description: dict.howItWorks.dek,
  });
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const stats = getCoverageStats();

  return (
    <>
      <PageHeader
        crumbs={[
          { href: routes.home(locale), label: dict.nav.home },
          { label: dict.howItWorks.title },
        ]}
        kicker={siteConfig.utilityLine[locale]}
        title={dict.howItWorks.title}
        dek={dict.howItWorks.dek}
      />

      <section aria-labelledby="pipeline" className="py-12 md:py-16">
        <Container>
          <SectionHeading title={dict.howItWorks.pipelineTitle} />
          <ol className="mt-8 grid gap-px overflow-hidden rounded-[10px] border border-rule-strong bg-rule-strong">
            {dict.howItWorks.steps.map((step, i) => (
              <li key={step.title} className="bg-white p-5 md:p-6">
                <div className="grid gap-3 md:grid-cols-12 md:items-baseline md:gap-6">
                  <span className="label-mono text-ember md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold leading-snug tracking-[-0.02em] text-ink md:col-span-4">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-muted md:col-span-7">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        aria-labelledby="cadence"
        className="grid-rules border-y border-rule-dark bg-ink py-12 text-white md:py-16"
      >
        <Container>
          <SectionHeading
            title={dict.howItWorks.cadenceTitle}
            dek={dict.howItWorks.cadenceDek}
            tone="paper"
          />
          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.howItWorks.cadence.map((slot) => (
              <div key={slot.time} className="border-t border-rule-dark pt-4">
                <dt className="font-mono text-2xl font-medium text-ember">{slot.time}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-paper-muted">
                  {slot.body}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 grid gap-8 border-t border-rule-dark pt-10 md:grid-cols-2">
            <div>
              <Kicker tone="paper">{dict.howItWorks.killTitle}</Kicker>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper-muted">
                {dict.howItWorks.killBody}
              </p>
            </div>
            <div>
              <Kicker tone="paper">{dict.howItWorks.humanTitle}</Kicker>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper-muted">
                {dict.howItWorks.humanBody}
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-rule-dark pt-10">
            <Kicker tone="paper">{dict.howItWorks.socialTitle}</Kicker>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper-muted">
              {dict.howItWorks.socialBody(
                stats.socialTreatments,
                stats.storiesWithSocialTreatments,
              )}
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="roles" className="py-12 md:py-16">
        <Container>
          <SectionHeading
            title={dict.howItWorks.rolesTitle}
            dek={dict.howItWorks.rolesDek}
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dict.howItWorks.roles.map((role) => (
              <li key={role.name} className="sheet p-5">
                <h3 className="label-mono text-ember">{role.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {role.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
