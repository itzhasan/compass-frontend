import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/Editorial";
import type { Locale } from "@/lib/api/types";
import { cn } from "@/lib/cn";

/** "How we work" copy, shared by the services list page and every service detail page. */
export const processCopy: Record<Locale, { eyebrow: string; title: string; steps: { title: string; body: string }[] }> = {
  ar: {
    eyebrow: "كيف نبدأ؟",
    title: "رحلة تعاون واضحة",
    steps: [
      { title: "نفهم التحدّي", body: "جلسة تعريفية لمناقشة واقع شركتك واحتياجاتها." },
      { title: "نحدّد النطاق", body: "نتفق على الأهداف والمخرجات وآلية العمل." },
      { title: "ننطلق ونراجع", body: "تنفيذ مرحلي ومراجعة لما تحقق وما يحتاج تعديلًا." },
    ],
  },
  en: {
    eyebrow: "How do we start?",
    title: "A clear collaboration journey",
    steps: [
      { title: "We understand the challenge", body: "An intro session to discuss your company's situation and needs." },
      { title: "We define the scope", body: "We agree on goals, deliverables and ways of working." },
      { title: "We launch and review", body: "Phased delivery with reviews of what's achieved and what needs adjusting." },
    ],
  },
};

const num = (i: number) => String(i + 1).padStart(2, "0");

/** Three numbered steps with large gold digits over a gold rule. */
export function ProcessSteps({ loc, title, surface = true }: { loc: Locale; title?: string; surface?: boolean }) {
  const c = processCopy[loc] ?? processCopy.ar;
  return (
    <section className={cn("py-16 sm:py-24", surface && "bg-surface")}>
      <Container>
        <EditorialHeading eyebrow={c.eyebrow} title={title ?? c.title} />
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {c.steps.map((step, i) => (
            <li key={step.title} className="reveal">
              <span className="block font-sans text-6xl font-extrabold leading-none text-accent sm:text-7xl">
                {num(i)}
              </span>
              <div className="mt-6 h-px bg-accent/60" aria-hidden />
              <h3 className="mt-5 text-2xl font-bold text-fg">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
