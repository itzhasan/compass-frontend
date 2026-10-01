import type { Locale } from "./api/types";

/** Locale-aware date formatting with Western digits (per spec default). */
export function formatDate(iso: string | null, locale: Locale): string {
  if (!iso) return "";
  const localeTag = locale === "ar" ? "ar-IQ-u-nu-latn" : "en-US";
  return new Intl.DateTimeFormat(localeTag, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
