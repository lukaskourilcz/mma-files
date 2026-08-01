import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/types";

/**
 * Every reader-facing route lives under `/[locale]`, which is what lets the
 * document carry a correct `lang` attribute. Anything arriving without a locale
 * prefix is redirected to one, negotiated from `Accept-Language` and defaulting
 * to English.
 */
function negotiate(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.split("=")[1] ?? "1") : 1;
      return { tag: tag.toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    const match = LOCALES.find((locale) => locale === base);
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = negotiate(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, and anything with a file extension (robots.txt,
  // sitemap.xml, static assets).
  matcher: ["/((?!_next/|.*\\.).*)"],
};
