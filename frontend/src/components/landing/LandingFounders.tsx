import { Container } from "@/components/ui/Container";
import type { LandingContent } from "./content";

function initials(name: string) {
  return name
    .replace(/^(د\.|Dr\.)\s*/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");
}

/** Founders — leadership cards with an avatar, name, role and short bio. */
export function LandingFounders({ founders }: { founders: LandingContent["founders"] }) {
  return (
    <section className="relative border-t border-border py-20 sm:py-28">
      <Container>
        <div className="reveal mx-auto mb-12 max-w-2xl text-center">
          <p className="section-label mb-4">{`${founders.label} — ${founders.index}`}</p>
          <h2 className="display-heading text-3xl text-fg sm:text-4xl">{founders.title}</h2>
          <p className="mt-4 text-lg text-muted">{founders.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {founders.items.map((f) => (
            <div
              key={f.name}
              className="reveal rounded-[var(--radius-lg)] border border-border bg-white/[0.02] p-8 text-center transition-colors hover:border-accent/40"
            >
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-accent/40 bg-[var(--color-ink-2)] text-xl font-bold text-accent">
                {initials(f.name)}
              </div>
              <h3 className="mt-5 text-xl font-bold text-fg">{f.name}</h3>
              <p className="mt-1 text-sm text-accent/90">{f.role}</p>
              <p className="mt-4 text-sm leading-loose text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
