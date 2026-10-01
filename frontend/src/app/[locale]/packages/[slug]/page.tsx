import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
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
  const pkg = await api.package(locale as Locale, slug);
  if (!pkg) return {};
  return buildMetadata(pkg.seo, pkg.alternates, locale as Locale);
}

export default async function PackageDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [pkg, t, tk] = await Promise.all([
    api.package(loc, slug),
    getTranslations("nav"),
    getTranslations("packages"),
  ]);
  if (!pkg) notFound();

  const detailRows: { label: string; html: string | null }[] = [
    { label: tk("targetAudience"), html: pkg.target_audience },
    { label: tk("whatsIncluded"), html: pkg.scope_of_work },
    { label: tk("deliverables"), html: pkg.deliverables },
    { label: tk("clientResponsibilities"), html: pkg.client_responsibilities },
    { label: tk("paymentTerms"), html: pkg.payment_terms },
    { label: tk("exclusions"), html: pkg.exclusions },
  ];

  // The CTA opens the consultation form preselected with this package.
  const ctaHref = { pathname: "/book-consultation" as const, query: { package: pkg.slug } };
  const ctaLabel = pkg.cta === "request_service" ? tk("requestService") : tk("bookConsultation");

  return (
    <>
      <PageHeader
        title={pkg.name}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: t("home"), href: "/" },
              { label: t("packages"), href: "/packages" },
              { label: pkg.name },
            ]}
          />
        }
      >
        <div className="flex flex-wrap items-center gap-4">
          <Badge tone={pkg.pricing_type === "custom_quote" ? "neutral" : "accent"}>{pkg.pricing_type_label}</Badge>
          {pkg.price && pkg.pricing_type !== "custom_quote" ? (
            <span className="text-2xl font-bold text-primary" dir="ltr">
              {pkg.price} {pkg.currency}
            </span>
          ) : null}
          <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
        </div>
      </PageHeader>

      <Container className="grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {pkg.problem_solved ? (
            <div className="mb-8">
              <RichText html={pkg.problem_solved} />
            </div>
          ) : null}

          <dl className="divide-y divide-border">
            {detailRows
              .filter((r) => r.html)
              .map((r) => (
                <div key={r.label} className="py-5">
                  <dt className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{r.label}</dt>
                  <dd>
                    <RichText html={r.html} />
                  </dd>
                </div>
              ))}
          </dl>

          {pkg.faqs.length > 0 ? (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-fg">{tk("faqs")}</h2>
              <div className="space-y-3">
                {pkg.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-[var(--radius)] border border-border p-4 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between font-medium text-fg">
                      {faq.question}
                      <span className="ms-4 transition-transform group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
            <dl className="space-y-4 text-sm">
              {pkg.duration ? (
                <div>
                  <dt className="text-muted">{tk("duration")}</dt>
                  <dd className="font-semibold text-fg">{pkg.duration}</dd>
                </div>
              ) : null}
              {pkg.sessions_count ? (
                <div>
                  <dt className="text-muted">{tk("sessions")}</dt>
                  <dd className="font-semibold text-fg">{pkg.sessions_count}</dd>
                </div>
              ) : null}
            </dl>
            <ButtonLink href={ctaHref} className="mt-6 w-full">
              {ctaLabel}
            </ButtonLink>
          </div>
        </aside>
      </Container>
    </>
  );
}
