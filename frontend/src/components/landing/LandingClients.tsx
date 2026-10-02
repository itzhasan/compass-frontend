import { CompassLogo } from "@/components/ui/CompassLogo";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { LandingContent } from "./content";

function Monogram({ name }: { name: string }) {
  const letter = name.trim().charAt(0);
  return (
    <div
      title={name}
      className="mx-3 grid h-16 w-16 shrink-0 place-items-center rounded-full border border-border bg-white/[0.02] text-lg font-bold text-fg/80"
    >
      {letter}
    </div>
  );
}

function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="marquee-mask overflow-hidden py-2">
      <div className={cn("w-max", reverse ? "marquee-track-rev" : "marquee-track")}>
        {/* Two copies for a seamless -50% loop. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1}>
            {items.map((name, i) => (
              <Monogram key={`${copy}-${i}`} name={name} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Clients & partners — intro, official-partner badge, three stats and two
 * continuously scrolling monogram marquees. */
export function LandingClients({ clients }: { clients: LandingContent["clients"] }) {
  return (
    <section id="clients" className="relative overflow-hidden border-t border-border py-20 sm:py-28">
      <Container>
        <div className="reveal mb-12 max-w-2xl text-start ms-auto lg:text-end">
          <p className="section-label mb-4">{`${clients.label} — ${clients.index}`}</p>
          <h2 className="display-heading text-3xl text-fg sm:text-4xl">{clients.title}</h2>
          <p className="mt-4 text-lg text-muted">{clients.subtitle}</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-1.5 text-sm text-accent">
            <CompassLogo className="h-4 w-4" />
            {clients.badge}
          </span>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {clients.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[var(--radius-lg)] border border-border bg-white/[0.02] px-6 py-8 text-end"
            >
              <p className="text-gradient-cool display-heading text-4xl sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>

      <div className="space-y-6">
        <div>
          <Container>
            <p className="mb-3 text-end text-sm text-muted">{clients.clientsLabel}</p>
          </Container>
          <Marquee items={clients.clients} />
        </div>
        <div>
          <Container>
            <p className="mb-3 text-end text-sm text-muted">{clients.partnersLabel}</p>
          </Container>
          <Marquee items={clients.partners} reverse />
        </div>
      </div>
    </section>
  );
}
