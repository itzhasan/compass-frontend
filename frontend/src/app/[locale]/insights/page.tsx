import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArticleCard } from "@/components/cards/ContentCards";
import { SearchBox } from "@/components/SearchBox";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("articles") };
}

export default async function InsightsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [res, t, common] = await Promise.all([
    api.articles(loc, { q: sp.q, type: sp.type, page: sp.page }),
    getTranslations("nav"),
    getTranslations("common"),
  ]);

  return (
    <>
      <PageHeader
        title={t("articles")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("articles") }]} />}
      >
        <SearchBox pathname="/insights" defaultValue={sp.q ?? ""} />
      </PageHeader>

      <Container className="py-12">
        {res.data.length === 0 ? (
          <EmptyState message={common("noResults")} />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {res.data.map((a) => (
                <ArticleCard key={a.id} article={a} locale={loc} />
              ))}
            </div>
            <Pagination
              pathname="/insights"
              currentPage={res.meta.current_page}
              lastPage={res.meta.last_page}
              query={{ q: sp.q, type: sp.type }}
            />
          </>
        )}
      </Container>
    </>
  );
}
