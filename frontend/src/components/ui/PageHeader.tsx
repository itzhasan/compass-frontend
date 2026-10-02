import type { ReactNode } from "react";

import { CompassMark } from "./CompassMark";
import { Container } from "./Container";

/**
 * Inner-page hero band — a dark "ink" band with a faint compass motif, a numbered
 * Latin eyebrow and a large display title. Mirrors the reference's section headers.
 */
export function PageHeader({
  title,
  subtitle,
  label,
  index,
  breadcrumbs,
  children,
}: {
  title: string;
  subtitle?: string | null;
  /** Latin section word for the numbered eyebrow, e.g. "SERVICES". */
  label?: string;
  /** Two-digit index shown after the label. */
  index?: string | number;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
}) {
  const marker = label
    ? `${label}${index != null ? ` — ${String(index).padStart(2, "0")}` : ""}`
    : undefined;

  return (
    <div className="ink-glow relative overflow-hidden">
      <CompassMark className="pointer-events-none absolute -top-24 start-1/2 h-[42rem] w-[42rem] -translate-x-1/2 text-white/[0.04] rtl:translate-x-1/2" />
      <Container className="relative pb-16 pt-28 sm:pb-24 sm:pt-36">
        {breadcrumbs}
        {marker ? <p className="section-label mb-4 mt-3">{marker}</p> : null}
        <h1 className="display-heading text-4xl text-[var(--color-ink-fg)] sm:text-5xl">{title}</h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-lg text-[var(--color-ink-muted)]">{subtitle}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </div>
  );
}
