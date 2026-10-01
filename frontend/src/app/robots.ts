import type { MetadataRoute } from "next";

import { env } from "@/env";

const SITE = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Don't index API routes or search-result pages.
      disallow: ["/api/", "/ar/search", "/en/search"],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
