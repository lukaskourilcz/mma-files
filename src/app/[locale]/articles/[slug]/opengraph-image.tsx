import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { articleTitle, getArticleBySlug, getArticles } from "@/lib/repository";
import { LOCALES, isLocale } from "@/lib/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — story card`;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getArticles().map((article) => ({ locale, slug: article.slug })),
  );
}

/**
 * Typographic share card built from the story's own metadata — the same rule
 * as the on-page heroes: no photography, no generated likeness.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  const article = getArticleBySlug(slug);

  const title = article ? articleTitle(article, locale) : siteConfig.name;
  const format = article ? dict.formats[article.format] : "";
  const fileTag = article?.fileNumber
    ? `${dict.labels.file} ${String(article.fileNumber).padStart(3, "0")}`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090B",
          padding: "64px 72px",
          borderTop: "10px solid #FF5A00",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            style={{
              fontSize: 22,
              letterSpacing: 4,
              color: "#FF5A00",
              textTransform: "uppercase",
            }}
          >
            {format}
          </span>
          {fileTag ? (
            <span style={{ fontSize: 22, letterSpacing: 4, color: "#94949C" }}>
              {fileTag}
            </span>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? 60 : 74,
            lineHeight: 1.08,
            letterSpacing: -2.5,
            color: "#FFFFFF",
            fontWeight: 700,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #27272A",
            paddingTop: 28,
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: -1.4,
              color: "#FFFFFF",
            }}
          >
            {siteConfig.wordmark}
          </span>
          <span style={{ fontSize: 20, letterSpacing: 3, color: "#94949C" }}>
            {article?.isDemo ? dict.demo.articleBadge : siteConfig.tagline[locale]}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
