import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeskLinks } from "@/components/site/HomeModules";
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
    path: routes.standards,
    title: dict.standards.title,
    description: dict.standards.dek,
  });
}

export default async function StandardsPage({
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
          { label: dict.standards.title },
        ]}
        kicker={dict.labels.sourceChecked}
        title={dict.standards.title}
        dek={dict.standards.dek}
      />

      <Container className="py-12 md:py-16">
        <div className="max-w-3xl">
          <ol className="space-y-10">
            {dict.standards.sections.map((section, i) => (
              <li key={section.title} className="border-t border-rule-strong pt-6">
                <div className="grid gap-4 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-4">
                    <span className="label-mono-sm text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="mt-2 text-lg leading-snug tracking-[-0.025em] text-ink">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-3.5 md:col-span-8">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="text-[0.9375rem] leading-relaxed text-ink-muted"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 border-t border-rule-strong pt-6">
            <DeskLinks locale={locale} />
          </div>
        </div>
      </Container>
    </>
  );
}
