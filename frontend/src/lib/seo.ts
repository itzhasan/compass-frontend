import type { Metadata } from "next";

import { env } from "@/env";
import type { Alternates, Locale, Seo } from "./api/types";

const SITE = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
const SITE_ORIGIN = new URL(SITE).origin;

/** Plain-text excerpt of (possibly HTML) content, cut on a word boundary. */
export function excerpt(html: string | null | undefined, max = 155): string {
  const text = (html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/** Only trust a CMS canonical that points at this site (the API may emit localhost URLs). */
function trustedCanonical(url: string | null): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).origin === SITE_ORIGIN ? url : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Builds Next Metadata from the API `seo` object + `alternates` map: canonical,
 * hreflang languages (omitting locales without a translation), OpenGraph and Twitter.
 * `fallback` supplies a description source (body/summary HTML) and a cover image for
 * items whose SEO fields were left empty in the CMS.
 */
export function buildMetadata(
  seo: Seo,
  alternates: Alternates,
  locale: Locale,
  fallback: { text?: string | null; image?: string | null } = {},
): Metadata {
  const languages: Record<string, string> = {};
  for (const [loc, path] of Object.entries(alternates)) {
    if (path) languages[loc] = `${SITE}${path}`;
  }
  if (alternates.ar) languages["x-default"] = `${SITE}${alternates.ar}`;

  const canonical =
    trustedCanonical(seo.canonical) ?? (alternates[locale] ? `${SITE}${alternates[locale]}` : undefined);
  const description = seo.description?.trim() || excerpt(fallback.text) || seo.title;
  const image = seo.og_image ?? fallback.image ?? undefined;

  return {
    title: seo.title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title: seo.title,
      description,
      url: canonical,
      locale: locale === "ar" ? "ar_IQ" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_IQ",
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
