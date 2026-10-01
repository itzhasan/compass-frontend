import { env } from "@/env";
import type { Article, Locale, News, Settings } from "./api/types";

const SITE = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/** Organization + ProfessionalService (with LocalBusiness address in Baghdad). */
export function organizationLd(settings: Settings, brandName: string, locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: brandName,
    url: `${SITE}/${locale}`,
    email: settings.contact.email ?? undefined,
    telephone: settings.contact.phones.map((p) => p.number),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Baghdad",
      addressCountry: "IQ",
      streetAddress: settings.contact.address ?? undefined,
    },
    sameAs: settings.socials.map((s) => s.url),
  };
}

/** WebSite with a SearchAction pointing at the on-site search. */
export function websiteLd(brandName: string, locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandName,
    url: `${SITE}/${locale}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.url}`,
    })),
  };
}

export function articleLd(article: Article, path: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.published_at ?? undefined,
    image: article.cover ?? undefined,
    author:
      article.authors && article.authors.length > 0
        ? article.authors.map((a) => ({ "@type": "Person", name: a.name }))
        : article.prepared_by
          ? { "@type": "Organization", name: article.prepared_by }
          : undefined,
    mainEntityOfPage: `${SITE}${path}`,
  };
}

export function newsLd(news: News, path: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    datePublished: news.published_at ?? undefined,
    image: news.cover ?? undefined,
    mainEntityOfPage: `${SITE}${path}`,
  };
}
