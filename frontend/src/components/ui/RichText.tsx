import { cn } from "@/lib/cn";
import { sanitizeHtml } from "@/lib/sanitize";

/** Renders API-provided rich-text HTML, sanitized, with prose styling. */
export function RichText({ html, className }: { html: string | null | undefined; className?: string }) {
  if (!html) return null;
  return (
    <div
      className={cn("prose-content max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
