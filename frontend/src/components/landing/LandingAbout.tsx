import { Container } from "@/components/ui/Container";
import type { LandingContent } from "./content";

function Block({ block }: { block: LandingContent["about"] }) {
  return (
    <div className="reveal relative">
      <span className="pointer-events-none absolute -top-10 end-0 select-none text-[7rem] font-bold leading-none text-white/[0.03] sm:text-[9rem]">
        {block.index}
      </span>
      <p className="section-label mb-4">{`${block.label} — ${block.index}`}</p>
      <h2 className="display-heading text-3xl text-fg sm:text-4xl">{block.title}</h2>
      <p className="mt-5 text-lg leading-loose text-muted">{block.body}</p>
    </div>
  );
}

/** About + Mission — two editorial blocks with large faint section numbers. */
export function LandingAbout({
  about,
  mission,
}: {
  about: LandingContent["about"];
  mission: LandingContent["mission"];
}) {
  return (
    <section className="relative border-t border-border py-20 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Block block={about} />
        <Block block={mission} />
      </Container>
    </section>
  );
}
