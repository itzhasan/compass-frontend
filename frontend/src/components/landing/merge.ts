import type { LandingContent } from "./content";

/**
 * Lays the admin-edited home copy over the built-in copy. Edited values win; anything the
 * CMS leaves empty (blank text, empty list) or doesn't send falls back to the built-in
 * value, so the page never renders gaps. Lists are replaced as a whole.
 */
export function mergeLandingContent(base: LandingContent, edited: unknown): LandingContent {
  return mergeValue(base, edited) as LandingContent;
}

function mergeValue(base: unknown, edited: unknown): unknown {
  if (Array.isArray(base)) {
    return Array.isArray(edited) && edited.length > 0 ? edited : base;
  }
  if (base !== null && typeof base === "object") {
    if (edited === null || typeof edited !== "object" || Array.isArray(edited)) return base;
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(base)) {
      out[key] = mergeValue(value, (edited as Record<string, unknown>)[key]);
    }
    return out;
  }
  if (typeof base === "string") {
    return typeof edited === "string" && edited.trim() !== "" ? edited : base;
  }
  if (typeof base === "boolean") {
    return typeof edited === "boolean" ? edited : base;
  }
  return edited ?? base;
}
