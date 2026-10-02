import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { LandingContent } from "./content";

/**
 * Landing hero — a full-height dark band with the graduated compass dial and
 * needle rotating slowly behind the headline (matching the reference), a badge
 * pill, gradient headline, subtitle, two CTAs and a three-figure stat row.
 */
export function LandingHero({ hero }: { hero: LandingContent["hero"] }) {
  return (
    <section id="top" className="ink-glow relative isolate overflow-hidden">
      {/* Rotating compass-logo motif. Centering lives on the wrapper so the spin
          (a rotate keyframe) never fights the translate; a radial mask fades the
          logo's square edges into the dark band. */}
      <div className="pointer-events-none absolute start-1/2 top-1/2 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 sm:h-[min(150vw,56rem)] sm:w-[min(150vw,56rem)] rtl:translate-x-1/2">
        <Image
          src="/logo.jpeg"
          alt=""
          fill
          sizes="(max-width: 640px) 70vw, 56rem"
          className="compass-spin object-contain opacity-[0.16]"
          style={{
            maskImage: "radial-gradient(circle, #000 52%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle, #000 52%, transparent 70%)",
          }}
        />
      </div>

      <Container className="relative flex min-h-[94vh] flex-col items-center justify-center py-28 text-center">
        <p className="reveal section-label rounded-full border border-[var(--color-ink-border)] px-4 py-1.5 text-[var(--color-ink-muted)]">
          {hero.badge}
        </p>

        <h1 className="display-heading mt-8 max-w-4xl text-balance text-4xl leading-[1.15] sm:text-6xl">
          {hero.titleLines.map((line, i) => (
            <span
              key={i}
              className={
                i === 0 && hero.highlightFirst
                  ? "block text-gradient-cool"
                  : "block text-glow text-[var(--color-ink-fg)]"
              }
            >
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)] sm:text-xl">
          {hero.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/book-consultation" variant="secondary" size="lg">
            {hero.primaryCta}
          </ButtonLink>
          <ButtonLink
            href="#services"
            variant="outline"
            size="lg"
            className="border-[var(--color-ink-border)] bg-transparent text-[var(--color-ink-fg)] hover:bg-white/5"
          >
            {hero.secondaryCta}
          </ButtonLink>
        </div>

        <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {hero.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[var(--radius-lg)] border border-[var(--color-ink-border)] bg-white/[0.02] px-6 py-8 backdrop-blur-sm"
            >
              <p className="text-gradient-cool display-heading text-4xl sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
