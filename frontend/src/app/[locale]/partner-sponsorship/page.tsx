import { getTranslations, setRequestLocale } from "next-intl/server";

import { DynamicForm } from "@/components/forms/DynamicForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("partner") };
}

export default async function PartnerSponsorshipPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [form, t] = await Promise.all([api.form(loc, "sponsorship"), getTranslations("nav")]);

  return (
    <>
      <PageHeader
        title={t("partner")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("partner") }]} />}
      />
      <Container className="max-w-2xl py-12">
        {form ? <DynamicForm schema={form} /> : null}
      </Container>
    </>
  );
}
