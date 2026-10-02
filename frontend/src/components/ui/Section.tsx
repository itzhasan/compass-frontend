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
    <section id={id} className={cn("py-16 sm:py-24", surface && "bg-surface", className)}>
      <Container>{children}</Container>
    </section>
  );
}

/**
 * Section heading in the reference's editorial style: a numbered Latin eyebrow
 * ("SERVICES — 04") above a large display title, with an optional subtitle.
 */
export function SectionHeading({
  eyebrow,
  label,
  index,
  title,
  subtitle,
  align = "start",
  className,
}: {
  /** Legacy free-text eyebrow (kept for back-compat). */
  eyebrow?: string;
  /** Latin section word shown in the numbered label, e.g. "SERVICES". */
  label?: string;
  /** Two-digit section index shown after the label, e.g. "04". */
  index?: string | number;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  className?: string;
}) {
  const marker = label
    ? `${label}${index != null ? ` — ${String(index).padStart(2, "0")}` : ""}`
    : eyebrow;

  return (
    <div
      className={cn(
        "reveal mb-10 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {marker ? <p className="section-label mb-4">{marker}</p> : null}
      <h2 className="display-heading text-3xl text-fg sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className={cn("mt-4 text-lg text-muted", align === "center" && "mx-auto")}>{subtitle}</p>
      ) : null}
    </div>
  );
}
