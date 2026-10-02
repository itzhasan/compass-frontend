import { Container } from "@/components/ui/Container";
import type { LandingContent } from "./content";

/** Team — the "35+ consultants" band with a grid of nine specialty cards. */
export function LandingTeam({ team }: { team: LandingContent["team"] }) {
  return (
    <section id="team" className="relative border-t border-border py-20 sm:py-28">
      <Container>
        <div className="reveal mx-auto mb-12 max-w-2xl text-center">
          <p className="section-label mb-4">{`${team.label} — ${team.index}`}</p>
          <h2 className="display-heading text-3xl text-fg sm:text-4xl">{team.title}</h2>
          <p className="mt-4 text-lg text-muted">{team.subtitle}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.items.map((item) => (
            <div
              key={item.num}
              className="reveal rounded-[var(--radius-lg)] border border-border bg-white/[0.02] p-6 transition-colors hover:border-accent/40"
            >
              <span className="section-label">{item.num}</span>
              <h3 className="mt-3 text-lg font-bold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
