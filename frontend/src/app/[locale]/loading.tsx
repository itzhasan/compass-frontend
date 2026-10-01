import { Section } from "@/components/ui/Section";

export default function Loading() {
  return (
    <Section>
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 rounded bg-surface-2" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-[var(--radius-lg)] bg-surface-2" />
          ))}
        </div>
      </div>
    </Section>
  );
}
