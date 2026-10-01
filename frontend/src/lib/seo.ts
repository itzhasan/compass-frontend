import type { Metadata } from "next";

import { env } from "@/env";
import type { Alternates, Locale, Seo } from "./api/types";

const SITE = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/**
 * Builds Next Metadata from the API `seo` object + `alternates` map: canonical,
 * hreflang languages (omitting locales without a translation), OpenGraph and Twitter.
 */
export function buildMetadata(seo: Seo, alternates: Alternates, locale: Locale): Metadata {
  const languages: Record<string, string> = {};
  for (const [loc, path] of Object.entries(alternates)) {
    if (path) languages[loc] = `${SITE}${path}`;
  }
  if (alternates.ar) languages["x-default"] = `${SITE}${alternates.ar}`;

  const canonical = seo.canonical ?? (alternates[locale] ? `${SITE}${alternates[locale]}` : undefined);

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical, languages },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      locale: locale === "ar" ? "ar_IQ" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_IQ",
      images: seo.og_image ? [{ url: seo.og_image }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.og_image ? [seo.og_image] : undefined,
    },
  };
}
