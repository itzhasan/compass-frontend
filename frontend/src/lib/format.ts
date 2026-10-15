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

/** "1500.00" + "USD" → "1,500 USD" (Western digits; trailing .00 dropped). */
export function formatPrice(price: string | null, currency: string | null): string {
  if (!price) return "";
  const n = Number(price);
  const amount = Number.isFinite(n) ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n) : price;
  return [amount, currency].filter(Boolean).join(" ");
}
