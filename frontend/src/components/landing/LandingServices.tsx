"use client";

import { Boxes, Check, Megaphone, Minus, Network, Plus, Target } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { LandingContent } from "./content";

const ICONS = [Boxes, Network, Target, Megaphone];

/** Core services — expandable accordion cards, each with an icon and a checklist.
 * The first card is open by default (as on the reference). */
export function LandingServices({ services }: { services: LandingContent["services"] }) {
  const [open, setOpen] = useState(0);

  return (
    <section id="services" className="relative border-t border-border py-20 sm:py-28">
      <Container>
        <div className="reveal mx-auto mb-12 max-w-2xl text-center">
          <p className="section-label mb-4">{`${services.label} — ${services.index}`}</p>
          <h2 className="display-heading text-3xl text-fg sm:text-4xl">{services.title}</h2>
          <p className="mt-4 text-lg text-muted">{services.subtitle}</p>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          {services.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            const isOpen = open === i;
            return (
              <div
                key={item.title}
                className={cn(
                  "rounded-[var(--radius-lg)] border transition-colors",
                  isOpen ? "border-accent/40 bg-white/[0.03]" : "border-border bg-white/[0.02]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-4 p-6 text-start"
                >
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius)] border border-border text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className="block text-lg font-bold text-fg">{item.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{item.tagline}</span>
                  </span>
                  <span className="mt-1 shrink-0 text-muted">
                    {isOpen ? <Minus className="h-5 w-5" aria-hidden /> : <Plus className="h-5 w-5" aria-hidden />}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-300",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <ul className="min-h-0 space-y-3 px-6 pb-6 ps-6 sm:ps-20">
                    {item.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-sm text-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
