import { getTranslations, setRequestLocale } from "next-intl/server";

import { PackageCard } from "@/components/cards/ContentCards";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import type { Locale, PricingType } from "@/lib/api/types";

const FILTERS: (PricingType | "all")[] = ["all", "fixed", "starting_from", "custom_quote"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("packages") };
}

export default async function PackagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ pricing_type?: string }>;
}) {
  const { locale } = await params;
  const { pricing_type } = await searchParams;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [packages, t, tp, common] = await Promise.all([
    api.packages(loc, pricing_type ? { pricing_type } : undefined),
    getTranslations("nav"),
    getTranslations("packages.pricing"),
    getTranslations("common"),
  ]);

  return (
    <>
      <PageHeader
        label="Packages"
        index={4}
        title={t("packages")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("packages") }]} />}
      />
      <Container className="py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = (pricing_type ?? "all") === f;
            return (
              <Link
                key={f}
                href={f === "all" ? "/packages" : { pathname: "/packages", query: { pricing_type: f } }}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm",
                  active ? "border-primary bg-primary text-primary-fg" : "border-border hover:bg-surface",
                )}
              >
                {f === "all" ? common("viewAll") : tp(f)}
              </Link>
            );
          })}
        </div>

        {packages.length === 0 ? (
          <EmptyState message={common("emptyState")} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <PackageCard key={p.id} pkg={p} pricingLabel={tp(p.pricing_type)} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
