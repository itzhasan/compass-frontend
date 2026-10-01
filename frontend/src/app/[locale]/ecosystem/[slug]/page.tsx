import { ExternalLink } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonExternal } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichText } from "@/components/ui/RichText";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const e = await api.ecosystemEntity(locale as Locale, slug);
  if (!e) return {};
  return buildMetadata(e.seo, e.alternates, locale as Locale);
}

export default async function EcosystemDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [entity, t] = await Promise.all([api.ecosystemEntity(locale as Locale, slug), getTranslations("nav")]);
  if (!entity) notFound();

  return (
    <>
      <PageHeader
        title={entity.name}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: t("home"), href: "/" },
              { label: t("ecosystem"), href: "/ecosystem" },
              { label: entity.name },
            ]}
          />
        }
      >
        <Badge tone="primary">{entity.type_label}</Badge>
      </PageHeader>
      <Container className="max-w-3xl py-12">
        {entity.field_of_work ? <p className="mb-4 text-muted">{entity.field_of_work}</p> : null}
        <RichText html={entity.short_bio} />
        {entity.relationship ? (
          <div className="mt-8">
            <RichText html={entity.relationship} />
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          {entity.website ? (
            <ButtonExternal href={entity.website} variant="outline">
              <ExternalLink className="h-4 w-4" aria-hidden />
              {entity.website.replace(/^https?:\/\//, "")}
            </ButtonExternal>
          ) : null}
          {entity.socials.map((s) => (
            <ButtonExternal key={s.platform} href={s.url} variant="ghost" className="capitalize">
              {s.platform}
            </ButtonExternal>
          ))}
        </div>
      </Container>
    </>
  );
}
