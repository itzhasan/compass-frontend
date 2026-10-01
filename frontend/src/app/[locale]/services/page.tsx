import { getTranslations, setRequestLocale } from "next-intl/server";

import { ServiceCard } from "@/components/cards/ContentCards";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("services") };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [services, t, common] = await Promise.all([
    api.services(locale as Locale),
    getTranslations("nav"),
    getTranslations("common"),
  ]);

  return (
    <>
      <PageHeader
        title={t("services")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("services") }]} />}
      />
      <Container className="py-12">
        {services.length === 0 ? (
          <EmptyState message={common("emptyState")} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
