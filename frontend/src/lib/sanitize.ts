import DOMPurify from "isomorphic-dompurify";

/**
 * Defense-in-depth HTML sanitization. The API already sanitizes rich text on save; we
 * sanitize again before rendering with dangerouslySetInnerHTML.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
      "h2", "h3", "h4", "blockquote", "code", "pre", "hr", "span", "table",
      "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}
