import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { HideOnHome } from "@/components/landing/HomeChrome";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { JsonLd } from "@/components/JsonLd";
import { env } from "@/env";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { organizationLd, websiteLd } from "@/lib/jsonld";
import { localeDirection, routing } from "@/i18n/routing";

import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brand" });
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: t("full"), template: `%s | ${t("short")}` },
    description: t("full"),
    icons: { icon: "/logo.jpeg", shortcut: "/logo.jpeg", apple: "/logo.jpeg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [settings, brand] = await Promise.all([
    api.settings(locale),
    getTranslations({ locale, namespace: "brand" }),
  ]);

  const whatsapp = settings.contact.phones.find((p) => p.is_whatsapp)?.number ?? null;

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={`${inter.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={[
            organizationLd(settings, brand("full"), locale as Locale),
            websiteLd(brand("short"), locale as Locale),
          ]}
        />
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg"
          >
            {brand("short")}
          </a>
          <Header brand={brand("short")} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <HideOnHome>
            <Footer brand={brand("short")} settings={settings} />
          </HideOnHome>
          <WhatsAppButton phone={whatsapp} />
          <AnalyticsConsent
            ga4Id={settings.analytics.ga4_id}
            plausibleDomain={settings.analytics.plausible_domain}
            consentRequired={settings.analytics.consent_required}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
