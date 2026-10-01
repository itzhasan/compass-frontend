import { notFound } from "next/navigation";

/** Any unmatched path within a locale renders the localized 404. */
export default function CatchAll() {
  notFound();
}
