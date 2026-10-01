import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Page navigation that preserves existing query params. Direction arrows flip in RTL.
 */
export function Pagination({
  pathname,
  currentPage,
  lastPage,
  query = {},
}: {
  pathname: string;
  currentPage: number;
  lastPage: number;
  query?: Record<string, string | undefined>;
}) {
  const locale = useLocale();
  if (lastPage <= 1) return null;

  const Prev = locale === "ar" ? ChevronRight : ChevronLeft;
  const Next = locale === "ar" ? ChevronLeft : ChevronRight;
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  const hrefFor = (page: number) => ({
    pathname,
    query: { ...query, page: String(page) },
  });

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex h-10 min-w-10 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm",
      active ? "border-primary bg-primary text-primary-fg" : "border-border hover:bg-surface",
    );

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link href={hrefFor(currentPage - 1)} className={linkClass(false)} aria-label="Previous page">
          <Prev className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
      {pages.map((p) => (
        <Link key={p} href={hrefFor(p)} className={linkClass(p === currentPage)} aria-current={p === currentPage ? "page" : undefined}>
          {p}
        </Link>
      ))}
      {currentPage < lastPage ? (
        <Link href={hrefFor(currentPage + 1)} className={linkClass(false)} aria-label="Next page">
          <Next className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
