import { getTranslations, setRequestLocale } from "next-intl/server";

import { NewsCard } from "@/components/cards/ContentCards";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("news") };
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ state?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const state = sp.state === "archived" ? "archived" : "active";

  const [res, t, tn, common] = await Promise.all([
    api.news(loc, { state, page: sp.page }),
    getTranslations("nav"),
    getTranslations("news"),
    getTranslations("common"),
  ]);

  const tabs = [
    { key: "active", label: tn("active") },
    { key: "archived", label: tn("archive") },
  ] as const;

  return (
    <>
      <PageHeader
        label="News"
        title={t("news")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("news") }]} />}
      >
        <div role="tablist" className="inline-flex rounded-[var(--radius)] border border-border p-1">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              role="tab"
              aria-selected={state === tab.key}
              href={tab.key === "active" ? "/news" : { pathname: "/news", query: { state: "archived" } }}
              className={cn(
                "rounded-[var(--radius-sm)] px-4 py-1.5 text-sm font-medium",
                state === tab.key ? "bg-primary text-primary-fg" : "text-muted hover:text-fg",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </PageHeader>

      <Container className="py-12">
        {res.data.length === 0 ? (
          <EmptyState message={common("emptyState")} />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {res.data.map((n) => (
                <NewsCard key={n.id} news={n} locale={loc} expiredLabel={common("expired")} />
              ))}
            </div>
            <Pagination
              pathname="/news"
              currentPage={res.meta.current_page}
              lastPage={res.meta.last_page}
              query={{ state }}
            />
          </>
        )}
      </Container>
    </>
  );
}
