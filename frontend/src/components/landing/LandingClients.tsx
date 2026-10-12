import { Activity, Box, ChevronsRight, Orbit, Sparkle, X } from "lucide-react";
import type { ReactNode } from "react";

import { CompassLogo } from "@/components/ui/CompassLogo";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { LandingContent } from "./content";

const iconClass = "h-6 w-6";

/** Small marks for the sample brands; unknown names fall back to their initial. */
const MARKS: Record<string, ReactNode> = {
  NOVA: (
    <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
      <path d="M10 3h4l7 18h-4.3l-1.4-4H8.7l-1.4 4H3L10 3Zm-.1 10.5h4.2L12 7.6l-2.1 5.9Z" />
    </svg>
  ),
  ORBIT: <Orbit className={iconClass} strokeWidth={2.5} aria-hidden />,
  VERTEX: (
    <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
      <path d="M3 4h4.5L12 14.5 16.5 4H21l-7 16h-4L3 4Z" />
    </svg>
  ),
  ATLAS: <Box className={iconClass} strokeWidth={2.25} aria-hidden />,
  PULSE: <Activity className={iconClass} strokeWidth={2.5} aria-hidden />,
  NEXA: <X className={iconClass} strokeWidth={3} aria-hidden />,
  FORMA: (
    <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
      <path d="M5 3h14v4H9.5v3.5H17v4H9.5V21H5V3Z" />
    </svg>
  ),
  LUMEN: <Sparkle className={iconClass} fill="currentColor" strokeWidth={1.5} aria-hidden />,
  MOTION: <ChevronsRight className={iconClass} strokeWidth={3} aria-hidden />,
  ARC: (
    <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
      <path d="M4 21v-9a8 8 0 0 1 16 0v9h-4.5v-9a3.5 3.5 0 0 0-7 0v9H4Z" />
    </svg>
  ),
  KINETIC: (
    <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
      <path d="M4 3h4.5v7.2L14.8 3h5.5l-7.4 8.2L21 21h-5.6l-5.4-6.7-1.5 1.6V21H4V3Z" />
    </svg>
  ),
  TERRA: (
    <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
      <path d="M3 3h18v4H3V3Zm0 6h4v12H3V9Zm7 0h4v12h-4V9Zm7 4h4v8h-4v-8Z" />
    </svg>
  ),
};

function LogoTile({ name, tone }: { name: string; tone: "ink" | "sage" }) {
  return (
    <div
      className={cn(
        "flex h-20 items-center justify-center gap-3 rounded-[var(--radius-sm)] bg-bg/70 px-4 transition-colors hover:bg-bg",
        tone === "ink" ? "text-primary" : "text-[#5f786d] dark:text-[#9db5aa]",
      )}
      dir="ltr"
    >
      {MARKS[name] ?? <span className="text-2xl font-black">{name.charAt(0)}</span>}
      <span className="font-sans text-lg font-bold tracking-[0.12em]">{name}</span>
    </div>
  );
}

function LogoRow({ label, names, tone }: { label: string; names: string[]; tone: "ink" | "sage" }) {
  return (
    <div className="reveal">
      <p className="mb-3 text-end text-xs text-muted">{label}</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {names.map((name) => (
          <LogoTile key={name} name={name} tone={tone} />
        ))}
      </div>
    </div>
  );
}

/** Clients & partners — intro, official-partner badge, three stats and two rows of
 * sample brand logos. */
export function LandingClients({ clients }: { clients: LandingContent["clients"] }) {
  return (
    <section id="clients" className="relative overflow-hidden bg-surface py-20 sm:py-28">
      <Container>
        <div className="reveal mb-12 max-w-2xl">
          <p className="section-label mb-4">{`${clients.label} — ${clients.index}`}</p>
          <h2 className="display-heading text-3xl text-fg sm:text-4xl">{clients.title}</h2>
          <p className="mt-4 text-lg text-muted">{clients.subtitle}</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/60 px-4 py-1.5 text-sm text-accent-hover">
            <CompassLogo className="h-4 w-4" />
            {clients.badge}
          </span>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {clients.stats.map((s) => (
            <div
              key={s.label}
              className="reveal rounded-[var(--radius-lg)] border border-border bg-bg px-6 py-8 text-end shadow-[0_10px_30px_-22px_rgba(20,25,36,0.35)]"
            >
              <p className="font-sans text-5xl font-extrabold leading-none text-primary">
                <span dir="ltr" className="inline-block">
                  {s.value}
                </span>
              </p>
              <p className="mt-4 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <LogoRow label={clients.clientsLabel} names={clients.clients} tone="ink" />
          <LogoRow label={clients.partnersLabel} names={clients.partners} tone="sage" />
        </div>
      </Container>
    </section>
  );
}
