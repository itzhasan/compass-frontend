import { setRequestLocale } from "next-intl/server";

import { getLandingContent } from "@/components/landing/content";
import { ForceDarkTheme } from "@/components/landing/HomeChrome";
import { LandingAbout } from "@/components/landing/LandingAbout";
import { LandingClients } from "@/components/landing/LandingClients";
import { LandingContact } from "@/components/landing/LandingContact";
import { LandingFounders } from "@/components/landing/LandingFounders";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingPartnership } from "@/components/landing/LandingPartnership";
import { LandingSectors } from "@/components/landing/LandingSectors";
import { LandingServices } from "@/components/landing/LandingServices";
import { LandingStrategy } from "@/components/landing/LandingStrategy";
import { LandingTeam } from "@/components/landing/LandingTeam";
import type { Locale } from "@/lib/api/types";

/**
 * Homepage — a faithful replica of the Al-Bawsala reference landing page, built
 * as self-contained static sections. Always rendered in the dark "ink" palette.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getLandingContent(locale as Locale);

  return (
    <div data-theme="dark" className="bg-bg text-fg">
      <ForceDarkTheme />
      <LandingHero hero={c.hero} />
      <LandingAbout about={c.about} mission={c.mission} />
      <LandingStrategy strategy={c.strategy} />
      <LandingServices services={c.services} />
      <LandingSectors sectors={c.sectors} />
      <LandingTeam team={c.team} />
      <LandingClients clients={c.clients} />
      <LandingFounders founders={c.founders} />
      <LandingPartnership partnership={c.partnership} />
      <LandingContact contact={c.contact} brand={locale === "ar" ? "البوصلة" : "Compass"} />
    </div>
  );
}
