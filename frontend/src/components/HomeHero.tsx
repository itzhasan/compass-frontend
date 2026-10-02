import { CompassLogo } from "@/components/ui/CompassLogo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Homepage hero — a tall dark "ink" band with the compass dial rotating faintly
 * behind the headline, a gold needle, and the primary CTAs. Always dark so the
 * reference's night look reads even when the rest of the site is in light mode.
 */
export function HomeHero({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  return (
    <section className="ink-glow relative isolate overflow-hidden">
      {/* Brand compass mark — large and faint, centred behind the content and
          rotating slowly. Centering lives on the wrapper; the spin (a `rotate`
          keyframe) lives on the SVG so the two transforms don't collide. */}
      <div className="pointer-events-none absolute start-1/2 top-1/2 h-[min(135vw,52rem)] w-[min(135vw,52rem)] -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2">
        <CompassLogo className="compass-spin h-full w-full text-white/[0.06]" />
      </div>

      <Container className="relative flex min-h-[82vh] flex-col items-center justify-center py-28 text-center">
        <p className="section-label rounded-full border border-[var(--color-ink-border)] px-4 py-1.5 text-[var(--color-ink-muted)]">
          {eyebrow}
        </p>
        <h1 className="display-heading mt-8 max-w-4xl text-balance text-4xl text-[var(--color-ink-fg)] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--color-ink-muted)] sm:text-xl">{subtitle}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={ctaHref} variant="secondary" size="lg">
            {ctaLabel}
          </ButtonLink>
          <ButtonLink
            href={secondaryHref}
            variant="outline"
            size="lg"
            className="border-[var(--color-ink-border)] bg-transparent text-[var(--color-ink-fg)] hover:bg-white/5"
          >
            {secondaryLabel}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
