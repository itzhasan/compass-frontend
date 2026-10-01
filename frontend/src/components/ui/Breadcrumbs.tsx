import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";

import { Link } from "@/i18n/navigation";

export interface Crumb {
  label: string;
  href?: string;
}

/** Accessible breadcrumb trail; the chevron flips direction in RTL. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const locale = useLocale();
  const Chevron = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 ? <Chevron className="h-4 w-4 opacity-60" aria-hidden /> : null}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-fg">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-fg">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
