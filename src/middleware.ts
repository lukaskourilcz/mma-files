import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/types";

/**
 * Every reader-facing route lives under `/[locale]`, which is what lets the document carry a
 * correct `lang` attribute. Anything arriving without one is redirected to Czech, the only
 * language the desk publishes — there is nothing left to negotiate.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  // A leftover /en path is stripped rather than prefixed. Blindly adding the locale turned
  // /en/articles/x into /cs/en/articles/x, which is a 404 wearing a redirect.
  const bare = pathname === "/en" ? "" : pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
  url.pathname = bare === "" || bare === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${bare}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, and anything with a file extension (robots.txt,
  // sitemap.xml, static assets).
  matcher: ["/((?!_next/|.*\\.).*)"],
};
