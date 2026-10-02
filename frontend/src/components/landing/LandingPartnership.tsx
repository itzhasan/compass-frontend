import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { LandingContent } from "./content";

/** Partnership — invitation to open a Compass office, with four requirement
 * cards and a CTA. */
export function LandingPartnership({ partnership }: { partnership: LandingContent["partnership"] }) {
  return (
    <section className="relative border-t border-border py-20 sm:py-28">
      <Container>
        <div className="reveal rounded-[var(--radius-lg)] border border-border bg-white/[0.02] p-8 sm:p-12">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="section-label mb-4">{`${partnership.label} — ${partnership.index}`}</p>
            <h2 className="display-heading text-2xl text-fg sm:text-4xl">{partnership.title}</h2>
            <p className="mt-4 text-lg text-muted">{partnership.subtitle}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partnership.items.map((item) => (
              <div
                key={item.num}
                className="rounded-[var(--radius)] border border-border bg-[var(--color-ink-2)] p-6"
              >
                <span className="section-label">{item.num}</span>
                <h3 className="mt-3 text-base font-bold text-fg">{item.title}</h3>
                <p className="text-gradient-cool mt-2 text-2xl font-bold">{item.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ButtonLink href="#contact" variant="secondary" size="lg">
              {partnership.cta}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
