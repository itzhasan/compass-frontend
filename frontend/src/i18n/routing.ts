import { defineRouting } from "next-intl/routing";

/**
 * Bilingual routing: Arabic (default, RTL) and English (LTR). `localePrefix: "always"`
 * keeps every URL under /ar or /en; the middleware redirects "/" by Accept-Language,
 * falling back to /ar.
 */
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};
