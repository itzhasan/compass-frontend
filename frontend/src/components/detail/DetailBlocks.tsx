import type { ComponentProps, ReactNode } from "react";

import { CoverImage } from "@/components/CoverImage";
import { ArrowBadge, EditorialHeading, editorialCard, ForwardArrow } from "@/components/ui/Editorial";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder, MediaTile, mediaTileClass } from "@/components/ui/MediaTile";
import { RichText } from "@/components/ui/RichText";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const num = (i: number) => String(i + 1).padStart(2, "0");

/** Wide cover image; a shorter navy compass panel when the item has no cover. */
export function DetailCover({ src, alt }: { src: string | null; alt: string }) {
  return (
    <Container className="relative z-10 -mt-6 sm:-mt-10">
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-lg)] shadow-[0_24px_50px_-30px_rgba(13,20,36,0.8)]",
          src ? "aspect-[21/9] max-h-[460px] w-full" : "h-32 sm:h-44",
        )}
      >
        {src ? <CoverImage src={src} alt={alt} sizes="(max-width: 1200px) 100vw, 1150px" priority /> : <ImagePlaceholder />}
      </div>
    </Container>
  );
}

/**
 * Numbered rich-text sections (01, 02 … in large gold digits over a gold rule). Empty
 * entries are dropped *before* numbering, so the sequence never has gaps.
 */
export function DetailSections({ sections }: { sections: { title: string; html: string | null | undefined }[] }) {
  const filled = sections.filter((s) => s.html && s.html.replace(/<[^>]+>/g, "").trim());
  if (filled.length === 0) return null;
  return (
    <div className="space-y-12">
      {filled.map((s, i) => (
        <section key={s.title} className="reveal">
          <span className="block font-sans text-5xl font-extrabold leading-none text-accent">{num(i)}</span>
          <div className="mt-5 h-px bg-accent/50" aria-hidden />
          <h2 className="mt-5 text-2xl font-bold text-fg">{s.title}</h2>
          <RichText html={s.html} className="mt-3 text-muted" />
        </section>
      ))}
    </div>
  );
}

/** Sticky side card for key facts and the primary CTA. */
export function DetailAside({
  title,
  facts = [],
  children,
}: {
  title?: string;
  facts?: { label: string; value: ReactNode }[];
  children?: ReactNode;
}) {
  const shown = facts.filter((f) => f.value !== null && f.value !== undefined && f.value !== "");
  if (!title && shown.length === 0 && !children) return null;
  return (
    <aside className="lg:sticky lg:top-24">
      <div className={cn(editorialCard, "hover:translate-y-0")}>
        {title ? <p className="mb-5 text-xs font-semibold text-accent-hover">{title}</p> : null}
        {shown.length > 0 ? (
          <dl className="divide-y divide-border text-sm">
            {shown.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-4 py-3 first:pt-0">
                <dt className="text-muted">{f.label}</dt>
                <dd className="text-end font-bold text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {children ? <div className={cn("flex flex-col gap-3", shown.length > 0 && "mt-6")}>{children}</div> : null}
      </div>
    </aside>
  );
}

export interface RelatedItem {
  href: string;
  title: string;
  category?: string | null;
  meta?: string | null;
  body?: string | null;
  cover?: string | null;
}

/**
 * Heading + grid of related items. `media` renders photo tiles (news, articles, cases);
 * `card` renders compact editorial cards (services, sectors). Renders nothing when empty.
 */
export function RelatedGrid({
  eyebrow,
  title,
  items,
  cta,
  rtl,
  variant = "media",
  surface = false,
}: {
  eyebrow?: string;
  title: string;
  items: RelatedItem[];
  cta: string;
  rtl: boolean;
  variant?: "media" | "card";
  surface?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section className={cn("py-16 sm:py-20", surface && "bg-surface")}>
      <Container>
        <EditorialHeading eyebrow={eyebrow} title={title} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) =>
            variant === "media" ? (
              <Link key={item.href} href={item.href} className={mediaTileClass}>
                <MediaTile
                  media={item.cover ? <CoverImage src={item.cover} alt={item.title} /> : <ImagePlaceholder />}
                  category={item.category ?? ""}
                  title={item.title}
                  meta={item.meta ?? ""}
                  body={item.body ?? undefined}
                  cta={cta}
                  rtl={rtl}
                />
              </Link>
            ) : (
              <Link key={item.href} href={item.href} className={cn("reveal flex flex-col", editorialCard)}>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-muted">{item.category}</span>
                  <ArrowBadge rtl={rtl} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-fg">{item.title}</h3>
                {item.body ? <p className="mt-3 text-sm text-muted">{item.body}</p> : null}
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-bold text-fg">
                  {cta}
                  <ForwardArrow rtl={rtl} className="h-3.5 w-3.5" />
                </span>
              </Link>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}

/** "← back to {list}" — the arrow points against the reading direction. */
export function BackLink({ href, label, rtl }: { href: string; label: string; rtl: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-sm font-bold text-fg hover:text-accent">
      <ForwardArrow rtl={!rtl} className="transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
      {label}
    </Link>
  );
}

/** Share row + back link, separated from the body by a hairline. */
export function DetailFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-12 flex flex-col gap-5 border-t border-border pt-6 first:mt-0 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
}

/** Rounded chip link (e.g. sectors served by a service, article tags). */
export function ChipLink({ href, children }: { href: ComponentProps<typeof Link>["href"]; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-border bg-bg px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </Link>
  );
}
