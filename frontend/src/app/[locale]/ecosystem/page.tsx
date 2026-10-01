import { getTranslations, setRequestLocale } from "next-intl/server";

import { EcosystemCard } from "@/components/cards/ContentCards";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api/client";
import type { EcosystemEntity, Locale } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("ecosystem") };
}

export default async function EcosystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [entities, t, th, common] = await Promise.all([
    api.ecosystem(locale as Locale),
    getTranslations("nav"),
    getTranslations("home"),
    getTranslations("common"),
  ]);

  // Group by type so each category renders under its own heading.
  const groups = new Map<string, { label: string; items: EcosystemEntity[] }>();
  for (const e of entities) {
    const group = groups.get(e.type) ?? { label: e.type_label, items: [] };
    group.items.push(e);
    groups.set(e.type, group);
  }

  return (
    <>
      <PageHeader
        title={t("ecosystem")}
        subtitle={th("ecosystem.subtitle")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("ecosystem") }]} />}
      />
      <Container className="py-12">
        {entities.length === 0 ? (
          <EmptyState message={common("emptyState")} />
        ) : (
          <div className="space-y-12">
            {[...groups.values()].map((group) => (
              <section key={group.label}>
                <h2 className="mb-5 text-xl font-bold text-fg">{group.label}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((e) => (
                    <EcosystemCard key={e.id} entity={e} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
