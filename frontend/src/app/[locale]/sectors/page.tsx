import { getTranslations, setRequestLocale } from "next-intl/server";

import { SectorCard } from "@/components/cards/ContentCards";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("sectors") };
}

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [sectors, t, common] = await Promise.all([
    api.sectors(locale as Locale),
    getTranslations("nav"),
    getTranslations("common"),
  ]);

  return (
    <>
      <PageHeader
        title={t("sectors")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("sectors") }]} />}
      />
      <Container className="py-12">
        {sectors.length === 0 ? (
          <EmptyState message={common("emptyState")} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((s) => (
              <SectorCard key={s.id} sector={s} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
