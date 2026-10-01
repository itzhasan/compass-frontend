import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Container } from "./Container";

/** A vertical page section with consistent spacing and optional surface background. */
export function Section({
  children,
  className,
  surface = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  surface?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-14 sm:py-20", surface && "bg-surface", className)}>
      <Container>{children}</Container>
    </section>
  );
}

/** Section heading with an optional eyebrow and subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-bold text-fg sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-muted">{subtitle}</p> : null}
    </div>
  );
}
