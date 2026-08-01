import type { MetadataRoute } from "next";
import { absoluteUrl, allowIndexing } from "@/config/site";

/**
 * While the site carries demo content, every crawler is refused outright. The
 * switch is `allowIndexing` in `src/config/site.ts`, which demo mode forces off.
 */
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The newsletter form is not connected to anything.
        disallow: ["/en/newsletter", "/cs/newsletter"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
