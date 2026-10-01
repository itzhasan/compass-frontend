import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Cover image with a graceful branded placeholder when the API has no media yet
 * (common while the client is still supplying assets).
 */
export function CoverImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 text-primary/30",
          className,
        )}
      >
        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
