import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BackLink, DetailSections, RelatedGrid } from "@/components/detail/DetailBlocks";
import { DetailHero } from "@/components/detail/DetailHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CtaBand, ctaCopy, ForwardArrow } from "@/components/ui/Editorial";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { listers, slugParams } from "@/lib/static-params";

// Prebuild known slugs; new CMS items still render on demand.
export const generateStaticParams = slugParams(listers.sectors);
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const sector = await api.sector(locale as Locale, slug);
  if (!sector) return {};
  return buildMetadata(sector.seo, sector.alternates, locale as Locale, {
    text: sector.definition,
    image: sector.cover,
  });
}

export default async function SectorDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const rtl = loc === "ar";

  const sector = await api.sector(loc, slug);
  if (!sector) notFound();

  const [t, ts, td, tc] = await Promise.all([
    getTranslations("nav"),
    getTranslations("sectors"),
    getTranslations("detail"),
    getTranslations("caseStudies"),
  ]);

  return (
    <>
      <DetailHero
        loc={loc}
        path={`/sectors/${sector.slug}`}
        crumbs={[
          { label: t("home"), href: "/" },
          { label: t("sectors"), href: "/sectors" },
        ]}
        label={td("labels.sector")}
        title={sector.name}
      >
        <ButtonLink
          href={{ pathname: "/book-consultation", query: { sector: sector.slug } }}
          variant="secondary"
          size="lg"
        >
          {ts("requestConsultation")}
          <ForwardArrow rtl={rtl} />
        </ButtonLink>
      </DetailHero>

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          <DetailSections
            sections={[
              { title: ts("definition"), html: sector.definition },
              { title: ts("currentState"), html: sector.current_state },
              { title: ts("challenges"), html: sector.key_challenges },
              { title: ts("servicesOffered"), html: sector.services_offered },
              { title: ts("sampleProjects"), html: sector.sample_projects },
            ]}
          />
          <div className="mt-12">
            <BackLink href="/sectors" label={td("backTo", { list: t("sectors") })} rtl={rtl} />
          </div>
        </Container>
      </section>

      <RelatedGrid
        title={td("relatedServices")}
        items={(sector.services ?? []).map((s) => ({
          href: `/services/${s.slug}`,
          title: s.title,
          category: t("services"),
          body: s.summary,
        }))}
        cta={td("viewService")}
        rtl={rtl}
        variant="card"
        surface
      />

      <RelatedGrid
        title={ts("relatedCaseStudies")}
        items={(sector.case_studies ?? []).map((c) => ({
          href: `/case-studies/${c.slug}`,
          title: c.title,
          category: tc("client"),
          meta: c.client_name,
          cover: c.cover,
        }))}
        cta={td("viewCase")}
        rtl={rtl}
      />

      <RelatedGrid
        title={ts("relatedArticles")}
        items={(sector.articles ?? []).map((a) => ({
          href: `/insights/${a.slug}`,
          title: a.title,
          category: a.type_label,
          meta: formatDate(a.published_at, loc),
          cover: a.cover,
        }))}
        cta={td("readArticle")}
        rtl={rtl}
        surface={(sector.case_studies ?? []).length > 0}
      />

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </>
  );
}
