import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { PackageCard, SectorCard } from "@/components/cards/ContentCards";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/Section";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const service = await api.service(locale as Locale, slug);
  if (!service) return {};
  return buildMetadata(service.seo, service.alternates, locale as Locale);
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [service, t, tp] = await Promise.all([
    api.service(loc, slug),
    getTranslations("nav"),
    getTranslations("packages.pricing"),
  ]);
  if (!service) notFound();

  return (
    <>
      <PageHeader
        title={service.title}
        subtitle={service.summary}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: t("home"), href: "/" },
              { label: t("services"), href: "/services" },
              { label: service.title },
            ]}
          />
        }
      >
        <ButtonLink href="/book-consultation">{t("bookConsultation")}</ButtonLink>
      </PageHeader>

      <Container className="py-12">
        <RichText html={service.body} />

        {service.sectors && service.sectors.length > 0 ? (
          <div className="mt-12">
            <SectionHeading title={t("sectors")} className="mb-6" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {service.sectors.map((s) => (
                <SectorCard key={s.id} sector={s} />
              ))}
            </div>
          </div>
        ) : null}

        {service.packages && service.packages.length > 0 ? (
          <div className="mt-12">
            <SectionHeading title={t("packages")} className="mb-6" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.packages.map((p) => (
                <PackageCard key={p.id} pkg={p} pricingLabel={tp(p.pricing_type)} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </>
  );
}
