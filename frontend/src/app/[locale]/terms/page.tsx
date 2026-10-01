import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { PageBlocks } from "@/components/PageBlocks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const page = await api.page(locale as Locale, "terms");
  if (!page) return {};
  return buildMetadata(page.seo, page.alternates, locale as Locale);
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [page, t] = await Promise.all([api.page(locale as Locale, "terms"), getTranslations("footer")]);
  if (!page) notFound();

  return (
    <>
      <PageHeader title={page.title} breadcrumbs={<Breadcrumbs items={[{ label: t("terms") }]} />} />
      <Container className="max-w-3xl py-12">
        <PageBlocks blocks={page.blocks} />
      </Container>
    </>
  );
}
