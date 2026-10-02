"use client";

import { useEffect } from "react";

import { usePathname } from "@/i18n/navigation";

/**
 * The landing page carries its own contact/footer section, so the shared global
 * footer is suppressed on the home route only. `usePathname` from next-intl
 * returns the path without the locale prefix, so home is exactly "/".
 */
export function HideOnHome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <>{children}</>;
}

/**
 * Forces the dark ("ink") theme while the landing page is mounted, so the fixed
 * global header's scrolled state and the document background match the reference.
 * Restores the previous theme on unmount.
 */
export function ForceDarkTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute("data-theme");
    root.setAttribute("data-theme", "dark");
    return () => {
      if (prev === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", prev);
    };
  }, []);
  return null;
}
