"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void }) => string;
      remove: (id: string) => void;
    };
  }
}

/**
 * Cloudflare Turnstile widget. Loads the CF script once and renders explicitly. When no
 * site key is configured it immediately yields an empty token (the API accepts it while
 * Turnstile is disabled server-side).
 */
export function Turnstile({ siteKey, onToken }: { siteKey?: string; onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey) {
      onToken("");
      return;
    }

    let widgetId: string | undefined;
    const scriptSrc = "https://challenges.cloudflare.com/turnstile/v0/api.js";

    const render = () => {
      if (ref.current && window.turnstile) {
        widgetId = window.turnstile.render(ref.current, { sitekey: siteKey, callback: onToken });
      }
    };

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector(`script[src="${scriptSrc}"]`);
      if (existing) {
        existing.addEventListener("load", render);
      } else {
        const script = document.createElement("script");
        script.src = scriptSrc;
        script.async = true;
        script.onload = render;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, onToken]);

  if (!siteKey) return null;
  return <div ref={ref} className="my-2" />;
}
