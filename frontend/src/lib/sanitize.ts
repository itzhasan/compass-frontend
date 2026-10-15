import sanitize from "sanitize-html";

/**
 * Defense-in-depth HTML sanitization. The API already sanitizes rich text on save; we
 * sanitize again before rendering with dangerouslySetInnerHTML.
 *
 * Uses sanitize-html (pure JS, no DOM) so it runs in serverless functions — the previous
 * isomorphic-dompurify/jsdom stack failed to load at runtime on Vercel.
 */
const OPTIONS: sanitize.IOptions = {
  allowedTags: [
    "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
    "h2", "h3", "h4", "blockquote", "code", "pre", "hr", "span", "table",
    "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: { "*": ["class"], a: ["href", "target", "rel", "class"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesAppliedToAttributes: ["href"],
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === "_blank") {
        return { tagName, attribs: { ...attribs, rel: "noopener noreferrer" } };
      }
      return { tagName, attribs };
    },
  },
};

export function sanitizeHtml(html: string): string {
  return sanitize(html, OPTIONS);
}
