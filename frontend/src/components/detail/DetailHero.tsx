import type { ReactNode } from "react";

import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { NavyBand } from "@/components/ui/Editorial";
import type { Locale } from "@/lib/api/types";
import { breadcrumbLd } from "@/lib/jsonld";

/**
 * Navy hero for detail pages: light breadcrumbs, gold Latin eyebrow, title, optional
 * subtitle, a "·"-separated meta row and a slot for badges/CTAs. Also emits the page's
 * BreadcrumbList JSON-LD, so every detail route gets it for free.
 */
export function DetailHero({
  loc,
  path,
  crumbs,
  label,
  title,
  subtitle,
  meta = [],
  badges,
  media,
  children,
}: {
  loc: Locale;
  /** Locale-less path of this page, e.g. "/news/news-1" (last crumb + JSON-LD). */
  path: string;
  /** Ancestor crumbs; the current page (title) is appended automatically. */
  crumbs: Crumb[];
  label: string;
  title: string;
  subtitle?: string | null;
  meta?: (string | null | undefined | false)[];
  badges?: ReactNode;
  /** Optional visual beside the title (e.g. an ecosystem logo tile). */
  media?: ReactNode;
  children?: ReactNode;
}) {
  const items: Crumb[] = [...crumbs, { label: title }];
  const metaItems = meta.filter((m): m is string => Boolean(m));
  const crumbUrl = (href?: string) => `/${loc}${href === undefined ? path : href === "/" ? "" : href}`;

  return (
    <>
      <JsonLd data={breadcrumbLd(items.map((c) => ({ name: c.label, url: crumbUrl(c.href) })))} />
      <NavyBand>
        <div className="max-w-3xl py-12 sm:py-16">
          <Breadcrumbs items={items} tone="light" />
          <div className="mt-8 flex items-start gap-5">
            {media}
            <div className="min-w-0">
              <p className="mb-4 font-sans text-[0.7rem] font-semibold tracking-wider text-accent">{label}</p>
              {badges ? <div className="mb-4 flex flex-wrap items-center gap-2">{badges}</div> : null}
              <h1 className="display-heading text-3xl text-white sm:text-5xl sm:leading-tight">{title}</h1>
              {subtitle ? <p className="mt-5 text-base text-white/70 sm:text-lg">{subtitle}</p> : null}
              {metaItems.length > 0 ? (
                <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
                  {metaItems.map((m, i) => (
                    <span key={i} className="flex items-center gap-3">
                      {i > 0 ? <span aria-hidden className="text-accent/70">·</span> : null}
                      {m}
                    </span>
                  ))}
                </p>
              ) : null}
              {children ? <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div> : null}
            </div>
          </div>
        </div>
      </NavyBand>
    </>
  );
}

/** Pill used in the hero's badge slot. */
export function HeroBadge({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "muted" | "warning" }) {
  const tones = {
    accent: "border-accent/50 text-accent",
    muted: "border-white/20 text-white/75",
    warning: "border-amber-400/60 text-amber-300",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
