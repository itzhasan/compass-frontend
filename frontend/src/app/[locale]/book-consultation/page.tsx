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
  return { title: t("bookConsultation") };
}

export default async function BookConsultationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sector?: string; package?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [form, t] = await Promise.all([api.form(loc, "consultation"), getTranslations("nav")]);

  // Preselect the sector/package the visitor arrived from.
  const presets: Record<string, string> = {};
  if (sp.sector) presets.sector = sp.sector;
  if (sp.package) presets.package = sp.package;

  return (
    <>
      <PageHeader
        title={t("bookConsultation")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("bookConsultation") }]} />}
      />
      <Container className="max-w-2xl py-12">
        {form ? <DynamicForm schema={form} presets={presets} /> : null}
      </Container>
    </>
  );
}
