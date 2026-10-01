import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ArticleCard, CaseStudyCard } from "@/components/cards/ContentCards";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichText } from "@/components/ui/RichText";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const sector = await api.sector(locale as Locale, slug);
  if (!sector) return {};
  return buildMetadata(sector.seo, sector.alternates, locale as Locale);
}

function Block({ title, html }: { title: string; html: string | null }) {
  if (!html) return null;
  return (
    <section className="border-t border-border py-8 first:border-t-0">
      <h2 className="mb-3 text-xl font-bold text-fg">{title}</h2>
      <RichText html={html} />
    </section>
  );
}

export default async function SectorDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [sector, t, ts] = await Promise.all([
    api.sector(loc, slug),
    getTranslations("nav"),
    getTranslations("sectors"),
  ]);
  if (!sector) notFound();

  return (
    <>
      <PageHeader
        title={sector.name}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: t("home"), href: "/" },
              { label: t("sectors"), href: "/sectors" },
              { label: sector.name },
            ]}
          />
        }
      >
        <ButtonLink href={{ pathname: "/book-consultation", query: { sector: sector.slug } }}>
          {ts("requestConsultation")}
        </ButtonLink>
      </PageHeader>

      <Container className="py-6">
        <Block title={ts("definition")} html={sector.definition} />
        <Block title={ts("currentState")} html={sector.current_state} />
        <Block title={ts("challenges")} html={sector.key_challenges} />
        <Block title={ts("servicesOffered")} html={sector.services_offered} />
        <Block title={ts("sampleProjects")} html={sector.sample_projects} />

        {sector.case_studies && sector.case_studies.length > 0 ? (
          <section className="border-t border-border py-8">
            <h2 className="mb-6 text-xl font-bold text-fg">{ts("relatedCaseStudies")}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sector.case_studies.map((c) => (
                <CaseStudyCard key={c.id} caseStudy={c} />
              ))}
            </div>
          </section>
        ) : null}

        {sector.articles && sector.articles.length > 0 ? (
          <section className="border-t border-border py-8">
            <h2 className="mb-6 text-xl font-bold text-fg">{ts("relatedArticles")}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sector.articles.map((a) => (
                <ArticleCard key={a.id} article={a} locale={loc} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}
