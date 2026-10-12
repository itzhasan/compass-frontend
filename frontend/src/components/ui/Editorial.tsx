import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { ButtonLink } from "./Button";
import { CompassMark } from "./CompassMark";
import { Container } from "./Container";

/**
 * Building blocks for the editorial inner pages (about, services …): navy hero
 * and CTA bands with a gold-needled compass, small eyebrows and arrow cards.
 */

export const editorialCard =
  "group rounded-[var(--radius-lg)] border border-border bg-bg p-6 shadow-[0_10px_30px_-22px_rgba(20,25,36,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/50";

/** Navy gradient band with a gold-needled compass on the trailing side. */
export function NavyBand({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(135deg,#0d1424_0%,#16203a_55%,#22324f_100%)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute end-[4%] top-1/2 hidden h-72 w-72 -translate-y-1/2 md:block lg:h-80 lg:w-80">
        <CompassMark showNeedle className="h-full w-full text-accent/25" />
      </div>
      <Container className="relative">{children}</Container>
    </section>
  );
}

/** Inner-page hero: gold Latin label, large title and a muted subtitle. */
export function EditorialHero({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <NavyBand>
      <div className="max-w-2xl py-16 sm:py-20">
        <p className="mb-4 text-[0.7rem] font-semibold tracking-wider text-accent">{label}</p>
        <h1 className="display-heading text-4xl text-white sm:text-5xl">{title}</h1>
        <p className="mt-5 text-base text-white/70 sm:text-lg">{subtitle}</p>
      </div>
    </NavyBand>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mb-3 text-xs font-semibold tracking-wide text-muted", className)}>{children}</p>;
}

export function EditorialHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="reveal mb-10">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="display-heading text-3xl text-fg sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-muted">{subtitle}</p> : null}
    </div>
  );
}

/** Small round badge with a diagonal arrow, pointing toward the reading direction. */
export function ArrowBadge({ rtl, inverted = false }: { rtl: boolean; inverted?: boolean }) {
  const Icon = rtl ? ArrowUpLeft : ArrowUpRight;
  return (
    <span
      className={cn(
        "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors",
        inverted
          ? "bg-accent/90 text-accent-fg"
          : "bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-fg",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
    </span>
  );
}

/** Horizontal arrow pointing in the reading direction. */
export function ForwardArrow({ rtl, className }: { rtl: boolean; className?: string }) {
  const Icon = rtl ? ArrowLeft : ArrowRight;
  return <Icon className={cn("h-4 w-4", className)} aria-hidden />;
}

/** Closing "let's talk" band linking to the contact page. */
export function CtaBand({
  rtl,
  label,
  title,
  subtitle,
  button,
}: {
  rtl: boolean;
  label: string;
  title: string;
  subtitle: string;
  button: string;
}) {
  return (
    <NavyBand>
      <div className="max-w-2xl py-16 sm:py-20">
        <p className="mb-3 text-[0.7rem] font-semibold tracking-wider text-accent">{label}</p>
        <h2 className="display-heading text-3xl text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 text-white/70">{subtitle}</p>
        <ButtonLink href="/contact" variant="secondary" size="lg" className="mt-8">
          {button}
          <ForwardArrow rtl={rtl} />
        </ButtonLink>
      </div>
    </NavyBand>
  );
}

export const ctaCopy = {
  ar: {
    label: "LET'S TALK / لنتحدث",
    title: "خطوتك القادمة تبدأ باتجاه واضح",
    subtitle: "شاركنا تحدّي شركتك، ولنحدّد معًا نقطة البداية.",
    button: "احجز استشارة",
  },
  en: {
    label: "LET'S TALK",
    title: "Your next step starts with a clear direction",
    subtitle: "Tell us about your company's challenge, and let's find the starting point together.",
    button: "Book a consultation",
  },
} as const;
