import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { CompassMark } from "./CompassMark";
import { ForwardArrow } from "./Editorial";

/**
 * Photo-topped card body used by the news and case-study listings. Wrap it in a
 * link that carries `mediaTileClass`.
 */

/** Navy stand-in for a story without a photo. */
export function ImagePlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#0d1424_0%,#16203a_55%,#22324f_100%)]">
      <CompassMark showNeedle className="h-36 w-36 text-accent/30" />
    </div>
  );
}

export function MediaTile({
  media,
  category,
  title,
  meta,
  body,
  cta,
  rtl,
  dimmed = false,
}: {
  media: ReactNode;
  category: string;
  title: string;
  meta: string;
  body?: string;
  cta: string;
  rtl: boolean;
  dimmed?: boolean;
}) {
  return (
    <>
      <div className={cn("relative aspect-[5/3] overflow-hidden", dimmed && "opacity-60")}>{media}</div>
      <div className="flex flex-1 flex-col p-6">
        {category ? <p className="mb-3 text-xs font-semibold text-accent-hover">{category}</p> : null}
        <h3 className="text-xl font-bold text-fg sm:text-2xl">{title}</h3>
        {meta ? <p className="mt-6 text-sm text-muted">{meta}</p> : null}
        {body ? <p className="mt-3 text-sm text-muted">{body}</p> : null}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-accent-hover">
          {cta}
          <ForwardArrow rtl={rtl} />
        </span>
      </div>
    </>
  );
}

export const mediaTileClass =
  "reveal group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-[0_10px_30px_-22px_rgba(20,25,36,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/50";
