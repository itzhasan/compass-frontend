import type { ReactNode } from "react";

import { Container } from "./Container";

/** Inner-page hero band with title, optional subtitle and breadcrumbs slot. */
export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  children,
}: {
  title: string;
  subtitle?: string | null;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface">
      <Container className="py-10 sm:py-14">
        {breadcrumbs}
        <h1 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-3 max-w-2xl text-muted">{subtitle}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </Container>
    </div>
  );
}
