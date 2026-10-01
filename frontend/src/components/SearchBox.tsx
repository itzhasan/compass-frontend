"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";

/** Accessible search form that navigates to `pathname?q=…` (works with JS; degrades to a
 * normal submit). */
export function SearchBox({
  pathname,
  defaultValue = "",
}: {
  pathname: "/insights" | "/search";
  defaultValue?: string;
}) {
  const t = useTranslations("common");
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push({ pathname, query: value ? { q: value } : {} });
      }}
      className="flex w-full max-w-md items-center gap-2"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted start-3" aria-hidden />
        <input
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          className="h-11 w-full rounded-[var(--radius)] border border-border bg-bg ps-10 pe-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <button
        type="submit"
        className="h-11 rounded-[var(--radius)] bg-primary px-4 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
      >
        {t("search")}
      </button>
    </form>
  );
}
