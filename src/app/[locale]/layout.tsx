import type { Metadata } from "next";
import { Anton, Archivo, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/site/Masthead";
import { SiteFooter } from "@/components/site/SiteFooter";
import { absoluteUrl, allowIndexing, siteConfig, siteUrl } from "@/config/site";
import { getDictionary } from "@/i18n";
import "@/app/globals.css";
import { routes } from "@/lib/paths";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

// Anton ships one weight. Latin Extended is loaded because fighter and event
// names carry Czech and Slovak diacritics and the display face has to render
// them rather than falling back mid-headline.
const anton = Anton({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
  fallback: ["Impact", "sans-serif"],
});

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

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
  const locale: Locale = raw;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline[locale]}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description[locale],
    applicationName: siteConfig.name,
    alternates: {
      canonical: routes.home(locale),
      languages: {
        cs: routes.home("cs"),
        "x-default": routes.home("cs"),
      },
      types: {
        "application/rss+xml": [
          { url: routes.rss(locale), title: `${siteConfig.name} — ${locale.toUpperCase()}` },
        ],
      },
    },
    // Demo content is never indexable. See `allowIndexing` in src/config/site.ts.
    robots: allowIndexing
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "cs_CZ",
      title: `${siteConfig.name} — ${siteConfig.tagline[locale]}`,
      description: siteConfig.description[locale],
      url: routes.home(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description[locale],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteConfig.name,
    url: absoluteUrl(routes.home(locale)),
    slogan: siteConfig.tagline[locale],
    description: siteConfig.description[locale],
    knowsLanguage: ["cs"],
    publishingPrinciples: absoluteUrl(routes.standards(locale)),
    correctionsPolicy: absoluteUrl(routes.corrections(locale)),
    actionableFeedbackPolicy: absoluteUrl(routes.corrections(locale)),
    parentOrganization: { "@type": "Organization", name: siteConfig.engine.name },
  };

  return (
    <html
      lang={dict.meta.htmlLang}
      className={`${anton.variable} ${archivo.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <script
          type="application/ld+json"
          // Serialised from a literal above; no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <Masthead locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
