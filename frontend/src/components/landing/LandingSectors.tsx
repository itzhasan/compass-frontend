import {
  Building2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Palette,
  Radio,
  ShoppingBag,
  Stethoscope,
  Truck,
  Zap,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import type { LandingContent } from "./content";

const ICONS = [
  Radio,
  Truck,
  Building2,
  ShoppingBag,
  Landmark,
  Stethoscope,
  HeartHandshake,
  GraduationCap,
  Zap,
  Palette,
];

/** Sectors — a grid of ten icon cards. */
export function LandingSectors({ sectors }: { sectors: LandingContent["sectors"] }) {
  return (
    <section className="relative border-t border-border py-20 sm:py-28">
      <Container>
        <div className="reveal mx-auto mb-12 max-w-2xl text-center">
          <p className="section-label mb-4">{`${sectors.label} — ${sectors.index}`}</p>
          <h2 className="display-heading text-3xl text-fg sm:text-4xl">{sectors.title}</h2>
          <p className="mt-4 text-lg text-muted">{sectors.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {sectors.items.map((name, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={name}
                className="reveal group flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-white/[0.02] px-4 py-8 text-center transition-colors hover:border-accent/40"
              >
                <span className="grid h-12 w-12 place-items-center rounded-[var(--radius)] border border-border text-accent transition-colors group-hover:bg-accent/10">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="text-sm font-medium text-fg">{name}</span>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
