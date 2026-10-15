"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Image grid with a click-to-enlarge lightbox. Keyboard: Esc closes, ←/→ step through
 * (mirrored in RTL). Focus moves into the dialog on open and back to the thumbnail on
 * close; body scroll is locked while open.
 */
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const t = useTranslations("detail");
  const rtl = useLocale() === "ar";
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);

  const count = images.length;
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + count) % count)), [count]);
  const close = useCallback(() => {
    if (open !== null) thumbs.current[open]?.focus();
    setOpen(null);
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(rtl ? -1 : 1);
      else if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, step, rtl]);

  if (count === 0) return null;
  const alt = (i: number) => `${title} – ${i + 1}`;
  const Prev = rtl ? ChevronRight : ChevronLeft;
  const Next = rtl ? ChevronLeft : ChevronRight;
  const ctrl =
    "grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent hover:text-accent-fg focus-visible:outline-2 focus-visible:outline-accent";

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((src, i) => (
          <button
            key={src + i}
            ref={(el) => {
              thumbs.current[i] = el;
            }}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-square overflow-hidden rounded-[var(--radius)] bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={t("openImage", { n: i + 1 })}
          >
            <Image
              src={src}
              alt={alt(i)}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt(open)}
          className="fixed inset-0 z-50 flex flex-col bg-[#070a12]/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex items-center justify-between text-sm text-white/70">
            <span className="font-sans" dir="ltr">
              {open + 1} / {count}
            </span>
            <button ref={closeRef} type="button" onClick={close} className={ctrl} aria-label={t("close")}>
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <div
            className="relative my-4 flex-1"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <Image src={images[open]} alt={alt(open)} fill sizes="100vw" className="object-contain" />
          </div>
          {count > 1 ? (
            <div className="flex items-center justify-center gap-4">
              <button type="button" onClick={() => step(-1)} className={ctrl} aria-label={t("previous")}>
                <Prev className="h-5 w-5" aria-hidden />
              </button>
              <button type="button" onClick={() => step(1)} className={ctrl} aria-label={t("next")}>
                <Next className="h-5 w-5" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
