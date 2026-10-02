import { CompassMark } from "@/components/ui/CompassMark";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { LandingContent } from "./content";

type Point = LandingContent["strategy"]["points"][number];

// Six compass bearings around the hub (percentages of the square), clockwise
// from the top: N, NE, SE, S, SW, NW.
const POS = [
  { left: "50%", top: "9%" },
  { left: "85%", top: "30%" },
  { left: "85%", top: "70%" },
  { left: "50%", top: "91%" },
  { left: "15%", top: "70%" },
  { left: "15%", top: "30%" },
];

function Card({ point, highlight }: { point: Point; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "group/card rounded-[var(--radius-lg)] border p-5 text-start transition-colors",
        highlight
          ? "border-accent/50 bg-white/[0.04] shadow-[0_0_40px_-12px_var(--color-accent)]"
          : "border-border bg-white/[0.02] hover:border-accent/40",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-bold text-fg">{point.title}</h3>
        <span className="section-label shrink-0">{point.num}</span>
      </div>
      <p className="mt-1 text-sm text-accent/90">{point.tagline}</p>
      <p
        className={cn(
          "overflow-hidden text-sm leading-relaxed text-muted transition-all duration-300",
          highlight
            ? "mt-3 max-h-40 opacity-100"
            : "mt-0 max-h-0 opacity-0 group-hover/card:mt-3 group-hover/card:max-h-40 group-hover/card:opacity-100",
        )}
      >
        {point.body}
      </p>
    </div>
  );
}

/** Strategy — six points arranged radially around a compass hub (desktop) or a
 * simple two-column stack (mobile). */
export function LandingStrategy({ strategy }: { strategy: LandingContent["strategy"] }) {
  return (
    <section id="strategy" className="relative border-t border-border py-20 sm:py-28">
      <Container>
        <div className="reveal mx-auto mb-14 max-w-2xl text-center">
          <p className="section-label mb-4">{`${strategy.label} — ${strategy.index}`}</p>
          <h2 className="display-heading text-3xl text-fg sm:text-4xl">{strategy.title}</h2>
          <p className="mt-4 text-lg text-muted">{strategy.subtitle}</p>
        </div>

        {/* Desktop: radial compass */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-3xl lg:block">
          <CompassMark className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.06]" />
          {/* Hub */}
          <div className="absolute start-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-border bg-[var(--color-ink-2)] text-center rtl:translate-x-1/2">
            <span className="display-heading text-2xl text-fg">{strategy.centerTitle}</span>
            <span dir="ltr" className="section-label mt-1">{strategy.centerSub}</span>
          </div>
          {/* Point cards */}
          {strategy.points.map((p, i) => (
            <div
              key={p.num}
              className="absolute w-64 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2"
              style={{ left: POS[i].left, top: POS[i].top }}
            >
              <Card point={p} highlight={i === 0} />
            </div>
          ))}
        </div>

        {/* Mobile / tablet: stacked grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {strategy.points.map((p) => (
            <Card key={p.num} point={p} highlight />
          ))}
        </div>
      </Container>
    </section>
  );
}
