import { absoluteUrl, allowIndexing, siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import { getArticles } from "@/lib/repository";
import { LOCALES, isLocale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * The feed carries released reporting only. While the site is in demo mode it
 * publishes a valid but empty channel — syndicating fictional stories into
 * readers' feed clients would be exactly the wrong failure.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return new Response("Not found", { status: 404 });
  }

  const dict = getDictionary(raw);
  const articles = allowIndexing ? getArticles().filter((a) => !a.isDemo) : [];
  const self = absoluteUrl(routes.rss(raw));

  const items = articles
    .map((article) => {
      const local = article.localizations[raw];
      const url = absoluteUrl(routes.article(raw, article.slug));
      return `    <item>
      <title>${escapeXml(local.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(local.dek)}</description>
      <category>${escapeXml(dict.formats[article.format])}</category>
      <pubDate>${new Date(article.publishAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const description = articles.length
    ? siteConfig.description[raw]
    : `${siteConfig.description[raw]} — ${dict.latest.empty}`;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — ${escapeXml(dict.meta.localeShort)}</title>
    <link>${escapeXml(absoluteUrl(routes.home(raw)))}</link>
    <description>${escapeXml(description)}</description>
    <language>${raw}</language>
    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
