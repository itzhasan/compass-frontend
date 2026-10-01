import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  ArticleCard,
  NewsCard,
  PackageCard,
  SectorCard,
  ServiceCard,
} from "@/components/cards/ContentCards";
import { SearchBox } from "@/components/SearchBox";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";

export const metadata = { robots: { index: false } };

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [t, common, tp] = await Promise.all([
    getTranslations("nav"),
    getTranslations("common"),
    getTranslations("packages.pricing"),
  ]);

  const results = q ? await api.search(loc, q) : null;
  const total = results
    ? results.articles.length +
      results.news.length +
      results.services.length +
      results.sectors.length +
      results.packages.length
    : 0;

  return (
    <>
      <PageHeader
        title={common("search")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: common("search") }]} />}
      >
        <SearchBox pathname="/search" defaultValue={q ?? ""} />
      </PageHeader>

      <Container className="space-y-12 py-12">
        {!q ? null : total === 0 ? (
          <EmptyState message={common("noResults")} />
        ) : (
          <>
            {results!.services.length > 0 ? (
              <Group title={t("services")}>
                {results!.services.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </Group>
            ) : null}
            {results!.packages.length > 0 ? (
              <Group title={t("packages")}>
                {results!.packages.map((p) => (
                  <PackageCard key={p.id} pkg={p} pricingLabel={tp(p.pricing_type)} />
                ))}
              </Group>
            ) : null}
            {results!.sectors.length > 0 ? (
              <Group title={t("sectors")}>
                {results!.sectors.map((s) => (
                  <SectorCard key={s.id} sector={s} />
                ))}
              </Group>
            ) : null}
            {results!.articles.length > 0 ? (
              <Group title={t("articles")}>
                {results!.articles.map((a) => (
                  <ArticleCard key={a.id} article={a} locale={loc} />
                ))}
              </Group>
            ) : null}
            {results!.news.length > 0 ? (
              <Group title={t("news")}>
                {results!.news.map((n) => (
                  <NewsCard key={n.id} news={n} locale={loc} expiredLabel={common("expired")} />
                ))}
              </Group>
            ) : null}
          </>
        )}
      </Container>
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 text-xl font-bold text-fg">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
