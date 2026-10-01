"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

type Consent = "accepted" | "declined" | null;
const STORAGE_KEY = "compass-consent";

/**
 * Bilingual cookie-consent banner. Analytics (GA4 / Plausible) load ONLY after the user
 * accepts, and only when IDs are configured in /settings.
 */
export function AnalyticsConsent({
  ga4Id,
  plausibleDomain,
  consentRequired,
}: {
  ga4Id: string | null;
  plausibleDomain: string | null;
  consentRequired: boolean;
}) {
  const t = useTranslations("consent");
  const hasAnalytics = Boolean(ga4Id || plausibleDomain);

  // Read stored choice during the first client render (client component → localStorage ok).
  const [consent, setConsent] = useState<Consent>(() =>
    typeof window === "undefined" ? null : (localStorage.getItem(STORAGE_KEY) as Consent),
  );

  // If consent isn't required, treat analytics as allowed.
  const allowed = !consentRequired || consent === "accepted";

  useEffect(() => {
    if (!allowed || !hasAnalytics) return;

    if (plausibleDomain && !document.querySelector("script[data-analytics=plausible]")) {
      const s = document.createElement("script");
      s.src = "https://plausible.io/js/script.js";
      s.defer = true;
      s.dataset.analytics = "plausible";
      s.setAttribute("data-domain", plausibleDomain);
      document.head.appendChild(s);
    }

    if (ga4Id && !document.querySelector("script[data-analytics=ga4]")) {
      const s = document.createElement("script");
      s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
      s.async = true;
      s.dataset.analytics = "ga4";
      document.head.appendChild(s);
      const inline = document.createElement("script");
      inline.dataset.analytics = "ga4-inline";
      inline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`;
      document.head.appendChild(inline);
    }
  }, [allowed, hasAnalytics, ga4Id, plausibleDomain]);

  const choose = (value: Exclude<Consent, null>) => {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  };

  if (!hasAnalytics || !consentRequired || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label={t("message")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/95 p-4 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{t("message")}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => choose("declined")}>
            {t("decline")}
          </Button>
          <Button size="sm" onClick={() => choose("accepted")}>
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
