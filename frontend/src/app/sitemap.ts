import type { MetadataRoute } from "next";

import { env } from "@/env";
import { api } from "@/lib/api/client";
import { routing } from "@/i18n/routing";

const SITE = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/**
 * Sitemap built from the API's /sitemap endpoint (all published URLs across both locales,
 * with lastModified and hreflang alternates). Static locale roots are prepended.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${SITE}/${locale}`,
    changeFrequency: "weekly",
    priority: 1,
  }));

  try {
    // The endpoint is locale-independent; it returns every locale's URLs.
    const urls = await api.sitemap(routing.defaultLocale);
    for (const entry of urls) {
      const languages: Record<string, string> = {};
      for (const [loc, path] of Object.entries(entry.alternates)) {
        if (path) languages[loc] = `${SITE}${path}`;
      }
      entries.push({
        url: `${SITE}${entry.path}`,
        lastModified: entry.lastmod ?? undefined,
        changeFrequency: "weekly",
        alternates: Object.keys(languages).length ? { languages } : undefined,
      });
    }
  } catch {
    // If the API is unreachable at build time, still emit the locale roots.
  }

  return entries;
}
