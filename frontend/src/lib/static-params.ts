import { api } from "@/lib/api/client";
import type { Locale, Paginated } from "@/lib/api/types";

/**
 * `generateStaticParams` helpers for the `[slug]` detail routes. The parent `[locale]`
 * layout supplies the locale; each resource lists its slugs for that locale. Any API
 * failure yields `[]` so `next build` never fails when the CMS is unreachable — pages
 * still render on demand because the routes keep `dynamicParams = true`.
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

export function slugParams(list: Lister) {
  return async function generateStaticParams({ params }: { params: { locale: string } }) {
    try {
      const items = await list(params.locale as Locale);
      return [...new Set(items.map((i) => i.slug))].map((slug) => ({ slug }));
    } catch {
      return [];
    }
  };
}
