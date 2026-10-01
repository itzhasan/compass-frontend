"use client";

import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Switches to the same page in the other locale. next-intl's router keeps the current
 * pathname and swaps the locale prefix; when the target page has no translation the
 * middleware/route falls back to that locale's section index.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const other = locale === "ar" ? "en" : "ar";
  const label = other === "ar" ? "العربية" : "English";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other })}
      className={cn(
        "rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium text-fg hover:bg-surface",
        className,
      )}
      aria-label={`Switch language to ${label}`}
      lang={other}
    >
      {label}
    </button>
  );
}
