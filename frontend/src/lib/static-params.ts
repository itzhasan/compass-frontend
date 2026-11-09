import { env } from "@/env";
import { api } from "@/lib/api/client";
import type { Locale, Paginated } from "@/lib/api/types";

/**
 * `generateStaticParams` helpers for the `[slug]` detail routes. The parent `[locale]`
 * layout supplies the locale; each resource lists its slugs for that locale. Any API
 * failure yields `[]` so `next build` never fails when the CMS is unreachable — pages
 * still render on demand because the routes keep `dynamicParams = true`.
 *
 * Lists can come from the build's fetch cache (Vercel restores .next/cache) while a page's
 * own data can't, so reachability is checked live, uncached, before listing any slugs.
 */

type Lister = (locale: Locale) => Promise<{ slug: string }[]>;

/** Walk every page of a paginated endpoint (capped to keep builds bounded). */
async function allPages<T extends { slug: string }>(
  fetchPage: (page: number) => Promise<Paginated<T>>,
  maxPages = 20,
): Promise<T[]> {
  const first = await fetchPage(1);
  const items = [...first.data];
  const last = Math.min(first.meta.last_page, maxPages);
  for (let page = 2; page <= last; page++) {
    items.push(...(await fetchPage(page)).data);
  }
  return items;
}

export const listers = {
  news: async (loc) => [
    ...(await allPages((page) => api.news(loc, { state: "active", page }))),
    ...(await allPages((page) => api.news(loc, { state: "archived", page }))),
  ],
  articles: (loc) => allPages((page) => api.articles(loc, { page })),
  services: (loc) => api.services(loc),
  sectors: (loc) => api.sectors(loc),
  packages: (loc) => api.packages(loc),
  caseStudies: (loc) => api.caseStudies(loc),
  ecosystem: (loc) => api.ecosystem(loc),
} satisfies Record<string, Lister>;

async function apiIsReachable(locale: string): Promise<boolean> {
  const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/api/v1/${locale}/settings`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function slugParams(list: Lister) {
  return async function generateStaticParams({ params }: { params: { locale: string } }) {
    if (!(await apiIsReachable(params.locale))) return [];
    try {
      const items = await list(params.locale as Locale);
      return [...new Set(items.map((i) => i.slug))].map((slug) => ({ slug }));
    } catch {
      return [];
    }
  };
}
