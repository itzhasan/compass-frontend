import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const cardBase =
  "group flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(cardBase, className)}>{children}</div>;
}

/** A card that is entirely a locale-aware link. */
export function CardLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(cardBase, "hover:border-primary", className)}>
      {children}
    </Link>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "primary" | "warning";
  className?: string;
}) {
  const tones = {
    neutral: "bg-surface-2 text-muted",
    accent: "bg-accent/15 text-accent",
    primary: "bg-primary/10 text-primary",
    warning: "bg-amber-100 text-amber-800",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
