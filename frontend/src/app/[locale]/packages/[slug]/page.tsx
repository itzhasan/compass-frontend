import { Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BackLink, DetailAside, DetailSections } from "@/components/detail/DetailBlocks";
import { DetailHero, HeroBadge } from "@/components/detail/DetailHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CtaBand, ctaCopy, editorialCard, ForwardArrow } from "@/components/ui/Editorial";
import { RichText } from "@/components/ui/RichText";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { listers, slugParams } from "@/lib/static-params";

// Prebuild known slugs; new CMS items still render on demand.
export const generateStaticParams = slugParams(listers.packages);
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const pkg = await api.package(locale as Locale, slug);
  if (!pkg) return {};
  return buildMetadata(pkg.seo, pkg.alternates, locale as Locale, {
    text: pkg.problem_solved ?? pkg.target_audience,
  });
}

export default async function PackageDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const rtl = loc === "ar";

  const pkg = await api.package(loc, slug);
  if (!pkg) notFound();

  const [t, tk, td] = await Promise.all([
    getTranslations("nav"),
    getTranslations("packages"),
    getTranslations("detail"),
  ]);

  const price = pkg.pricing_type === "custom_quote" ? null : formatPrice(pkg.price, pkg.currency) || null;
  const priceText = price ? (
    <span dir="ltr" className="inline-block">
      {price}
    </span>
  ) : (
    pkg.pricing_type_label
  );

  // The CTA opens the consultation form preselected with this package.
  const ctaHref = { pathname: "/book-consultation" as const, query: { package: pkg.slug } };
  const ctaLabel = pkg.cta === "request_service" ? tk("requestService") : tk("bookConsultation");

  return (
    <>
      <DetailHero
        loc={loc}
        path={`/packages/${pkg.slug}`}
        crumbs={[
          { label: t("home"), href: "/" },
          { label: t("packages"), href: "/packages" },
        ]}
        label={td("labels.package")}
        title={pkg.name}
        badges={<HeroBadge>{pkg.pricing_type_label}</HeroBadge>}
      >
        {price ? (
          <p className="font-sans text-3xl font-extrabold text-accent sm:text-4xl">
            {pkg.pricing_type === "starting_from" ? <span className="me-2 text-lg">{tk("pricing.starting_from")}</span> : null}
            <span dir="ltr" className="inline-block">
              {price}
            </span>
          </p>
        ) : null}
        <ButtonLink href={ctaHref} variant="secondary" size="lg">
          {ctaLabel}
          <ForwardArrow rtl={rtl} />
        </ButtonLink>
      </DetailHero>

      <section className="py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div className="min-w-0">
            {pkg.problem_solved ? (
              <RichText html={pkg.problem_solved} className="mb-12 text-[1.05rem] leading-relaxed" />
            ) : null}

            <DetailSections
              sections={[
                { title: tk("targetAudience"), html: pkg.target_audience },
                { title: tk("whatsIncluded"), html: pkg.scope_of_work },
                { title: tk("deliverables"), html: pkg.deliverables },
                { title: tk("clientResponsibilities"), html: pkg.client_responsibilities },
                { title: tk("paymentTerms"), html: pkg.payment_terms },
                { title: tk("exclusions"), html: pkg.exclusions },
              ]}
            />

            {pkg.faqs.length > 0 ? (
              <div className="mt-14">
                <h2 className="mb-5 text-2xl font-bold text-fg">{tk("faqs")}</h2>
                <div className="space-y-3">
                  {pkg.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className={cn(
                        editorialCard,
                        "p-0 hover:translate-y-0 open:border-accent/50 [&_summary::-webkit-details-marker]:hidden",
                      )}
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-bold text-fg">
                        {faq.question}
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/15 text-accent transition-transform group-open:rotate-45">
                          <Plus className="h-4 w-4" aria-hidden />
                        </span>
                      </summary>
                      <p className="px-5 pb-5 text-sm text-muted">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-12">
              <BackLink href="/packages" label={td("backTo", { list: t("packages") })} rtl={rtl} />
            </div>
          </div>

          <DetailAside
            title={td("keyFacts")}
            facts={[
              { label: td("price"), value: priceText },
              { label: tk("duration"), value: pkg.duration },
              { label: tk("sessions"), value: pkg.sessions_count },
              {
                label: td("service"),
                value: pkg.service ? (
                  <Link href={`/services/${pkg.service.slug}`} className="text-accent-hover hover:underline">
                    {pkg.service.title}
                  </Link>
                ) : null,
              },
            ]}
          >
            <ButtonLink href={ctaHref} variant="secondary" className="w-full">
              {ctaLabel}
              <ForwardArrow rtl={rtl} />
            </ButtonLink>
          </DetailAside>
        </Container>
      </section>

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </>
  );
}
