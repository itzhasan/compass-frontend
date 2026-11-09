import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BackLink, ChipLink, RelatedGrid } from "@/components/detail/DetailBlocks";
import { DetailHero } from "@/components/detail/DetailHero";
import { ProcessSteps } from "@/components/detail/ProcessSteps";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CtaBand, ctaCopy, ForwardArrow } from "@/components/ui/Editorial";
import { RichText } from "@/components/ui/RichText";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { listers, slugParams } from "@/lib/static-params";

// Prebuild known slugs; new CMS items still render on demand.
export const generateStaticParams = slugParams(listers.services);
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const service = await api.service(locale as Locale, slug);
  if (!service) return {};
  return buildMetadata(service.seo, service.alternates, locale as Locale, {
    text: service.summary ?? service.body,
    image: service.cover,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const rtl = loc === "ar";

  const service = await api.service(loc, slug);
  if (!service) notFound();

  const [t, td] = await Promise.all([getTranslations("nav"), getTranslations("detail")]);
  const sectors = service.sectors ?? [];
  const packages = service.packages ?? [];
  // Skip the body when it only repeats the summary shown in the hero.
  const bodyText = (service.body ?? "").replace(/<[^>]+>/g, "").trim();
  const showBody = bodyText !== "" && bodyText !== (service.summary ?? "").trim();

  return (
    <>
      <DetailHero
        loc={loc}
        path={`/services/${service.slug}`}
        crumbs={[
          { label: t("home"), href: "/" },
          { label: t("services"), href: "/services" },
        ]}
        label={td("labels.service")}
        title={service.title}
        subtitle={service.summary}
      >
        <ButtonLink
          href={{ pathname: "/book-consultation", query: { service: service.slug } }}
          variant="secondary"
          size="lg"
        >
          {t("bookConsultation")}
          <ForwardArrow rtl={rtl} />
        </ButtonLink>
      </DetailHero>

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          {showBody ? <RichText html={service.body} className="text-[1.05rem] leading-relaxed" /> : null}

          {sectors.length > 0 ? (
            <div className={showBody ? "mt-12" : undefined}>
              <h2 className="mb-5 text-xl font-bold text-fg">{td("sectorsServed")}</h2>
              <div className="flex flex-wrap gap-2">
                {sectors.map((s) => (
                  <ChipLink key={s.slug} href={`/sectors/${s.slug}`}>
                    {s.name}
                  </ChipLink>
                ))}
              </div>
            </div>
          ) : null}

          <div className={showBody || sectors.length > 0 ? "mt-12" : undefined}>
            <BackLink href="/services" label={td("backTo", { list: t("services") })} rtl={rtl} />
          </div>
        </Container>
      </section>

      <RelatedGrid
        title={td("relatedPackages")}
        items={packages.map((p) => ({
          href: `/packages/${p.slug}`,
          title: p.name,
          category: p.pricing_type_label,
          body: p.pricing_type === "custom_quote" ? null : formatPrice(p.price, p.currency),
        }))}
        cta={td("viewPackage")}
        rtl={rtl}
        variant="card"
      />

      <ProcessSteps loc={loc} title={td("howWeWork")} />

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </>
  );
}
