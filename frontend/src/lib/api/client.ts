import { env } from "@/env";

import type {
  Article,
  CaseStudy,
  Client,
  Collection,
  EcosystemEntity,
  FormSchema,
  HomeSection,
  Item,
  Locale,
  News,
  Package,
  Page,
  Paginated,
  SearchResults,
  Sector,
  Service,
  Settings,
  SitemapEntry,
  TeamMember,
} from "./types";

const BASE = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

/** Default ISR revalidation window (seconds). Webhook-driven tag revalidation is primary. */
const DEFAULT_REVALIDATE = 3600;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | number | boolean | undefined>;

interface FetchOptions {
  tags?: string[];
  revalidate?: number | false;
  query?: Query;
}

function buildUrl(locale: Locale, path: string, query?: Query): string {
  const url = new URL(`${BASE}/api/v1/${locale}/${path.replace(/^\//, "")}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function apiGet<T>(locale: Locale, path: string, options: FetchOptions = {}): Promise<T> {
  const res = await fetch(buildUrl(locale, path, options.query), {
    headers: { Accept: "application/json" },
    next: {
      tags: options.tags,
      revalidate: options.revalidate ?? DEFAULT_REVALIDATE,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API ${res.status} for ${path}`);
  }

  return (await res.json()) as T;
}

/** Returns null on 404 so pages can call notFound(); re-throws other errors. */
async function apiGetOrNull<T>(locale: Locale, path: string, options: FetchOptions = {}): Promise<T | null> {
  try {
    return await apiGet<T>(locale, path, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/* ─────────────────────────── typed endpoints ─────────────────────────── */

export const api = {
  settings: (locale: Locale) =>
    apiGet<Item<Settings>>(locale, "settings", { tags: ["settings"] }).then((r) => r.data),

  home: (locale: Locale) =>
    apiGet<Collection<HomeSection>>(locale, "home", { tags: ["home"] }).then((r) => r.data),

  services: (locale: Locale) =>
    apiGet<Collection<Service>>(locale, "services", { tags: ["services"] }).then((r) => r.data),
  service: (locale: Locale, slug: string) =>
    apiGetOrNull<Item<Service>>(locale, `services/${slug}`, { tags: [`service:${slug}`] }).then((r) => r?.data ?? null),

  packages: (locale: Locale, query?: Query) =>
    apiGet<Collection<Package>>(locale, "packages", { tags: ["packages"], query }).then((r) => r.data),
  package: (locale: Locale, slug: string) =>
    apiGetOrNull<Item<Package>>(locale, `packages/${slug}`, { tags: [`package:${slug}`] }).then((r) => r?.data ?? null),

  sectors: (locale: Locale) =>
    apiGet<Collection<Sector>>(locale, "sectors", { tags: ["sectors"] }).then((r) => r.data),
  sector: (locale: Locale, slug: string) =>
    apiGetOrNull<Item<Sector>>(locale, `sectors/${slug}`, { tags: [`sector:${slug}`] }).then((r) => r?.data ?? null),

  articles: (locale: Locale, query?: Query) =>
    apiGet<Paginated<Article>>(locale, "articles", { tags: ["articles"], query }),
  article: (locale: Locale, slug: string) =>
    apiGetOrNull<Item<Article>>(locale, `articles/${slug}`, { tags: [`article:${slug}`] }).then((r) => r?.data ?? null),

  news: (locale: Locale, query?: Query) =>
    apiGet<Paginated<News>>(locale, "news", { tags: ["news"], query }),
  newsItem: (locale: Locale, slug: string) =>
    apiGetOrNull<Item<News>>(locale, `news/${slug}`, { tags: [`news:${slug}`] }).then((r) => r?.data ?? null),

  caseStudies: (locale: Locale) =>
    apiGet<Collection<CaseStudy>>(locale, "case-studies", { tags: ["case-studies"] }).then((r) => r.data),
  caseStudy: (locale: Locale, slug: string) =>
    apiGetOrNull<Item<CaseStudy>>(locale, `case-studies/${slug}`, { tags: [`case_study:${slug}`] }).then((r) => r?.data ?? null),

  ecosystem: (locale: Locale, query?: Query) =>
    apiGet<Collection<EcosystemEntity>>(locale, "ecosystem", { tags: ["ecosystem"], query }).then((r) => r.data),
  ecosystemEntity: (locale: Locale, slug: string) =>
    apiGetOrNull<Item<EcosystemEntity>>(locale, `ecosystem/${slug}`, { tags: [`ecosystem:${slug}`] }).then((r) => r?.data ?? null),

  team: (locale: Locale) =>
    apiGet<Collection<TeamMember>>(locale, "team", { tags: ["team"] }).then((r) => r.data),

  clients: (locale: Locale, query?: Query) =>
    apiGet<Collection<Client>>(locale, "clients", { tags: ["clients"], query }).then((r) => r.data),

  page: (locale: Locale, slug: string) =>
    apiGetOrNull<Item<Page>>(locale, `pages/${slug}`, { tags: [`page:${slug}`] }).then((r) => r?.data ?? null),

  search: (locale: Locale, q: string) =>
    apiGet<Item<SearchResults>>(locale, "search", { query: { q }, revalidate: false }).then((r) => r.data),

  form: (locale: Locale, key: string) =>
    apiGetOrNull<Item<FormSchema>>(locale, `forms/${key}`, { tags: [`form:${key}`] }).then((r) => r?.data ?? null),

  sitemap: (locale: Locale) =>
    apiGet<Collection<SitemapEntry>>(locale, "sitemap", { tags: ["sitemap"] }).then((r) => r.data),
};
