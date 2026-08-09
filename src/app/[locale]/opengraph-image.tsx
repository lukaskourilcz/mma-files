import { ImageResponse } from "next/og";
import { OgCard } from "@/components/brand/OgCard";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { getOgFonts } from "@/lib/og-fonts";
import { getArticles } from "@/lib/repository";
import { DEFAULT_LOCALE, isLocale } from "@/lib/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — titulní karta`;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const latestArticle = getArticles({ limit: 1 })[0];

  return new ImageResponse(
    (
      <OgCard
        date={latestArticle ? formatDate(latestArticle.publishAt, locale) : undefined}
        headline={dict.footer.blurb}
        kicker="UFC / OKTAGON"
        variant="default"
      />
    ),
    { ...size, fonts: await getOgFonts() },
  );
}
