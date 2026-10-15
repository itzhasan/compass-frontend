import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import {
  BackLink,
  ChipLink,
  DetailCover,
  DetailFooter,
  DetailSections,
  RelatedGrid,
} from "@/components/detail/DetailBlocks";
import { DetailHero, HeroBadge } from "@/components/detail/DetailHero";
import { Gallery } from "@/components/detail/Gallery";
import { ShareButtons } from "@/components/ShareButtons";
import { Container } from "@/components/ui/Container";
import { CtaBand, ctaCopy } from "@/components/ui/Editorial";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { listers, slugParams } from "@/lib/static-params";

// Prebuild known slugs; new CMS items still render on demand.
export const generateStaticParams = slugParams(listers.caseStudies);
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const cs = await api.caseStudy(locale as Locale, slug);
  if (!cs) return {};
  return buildMetadata(cs.seo, cs.alternates, locale as Locale, {
    text: cs.challenge ?? cs.results,
    image: cs.cover,
  });
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const rtl = loc === "ar";

  const cs = await api.caseStudy(loc, slug);
  if (!cs) notFound();

  const [t, tc, td, ts] = await Promise.all([
    getTranslations("nav"),
    getTranslations("caseStudies"),
    getTranslations("detail"),
    getTranslations("sectors"),
  ]);

  return (
    <article>
      <DetailHero
        loc={loc}
        path={`/case-studies/${cs.slug}`}
        crumbs={[
          { label: t("home"), href: "/" },
          { label: t("caseStudies"), href: "/case-studies" },
        ]}
        label={td("labels.caseStudy")}
        title={cs.title}
        subtitle={cs.client_name}
        badges={cs.sector ? <HeroBadge>{cs.sector.name}</HeroBadge> : null}
      />

      <DetailCover src={cs.cover} alt={cs.title} />

      {cs.metrics.length > 0 ? (
        <section className="pt-14 sm:pt-16">
          <Container>
            <p className="mb-6 text-xs font-semibold text-muted">{tc("metrics")}</p>
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {cs.metrics.map((m) => (
                // dt before dd for valid markup; flex-col-reverse shows the figure on top.
                <div key={m.label} className="reveal flex flex-col-reverse border-t border-accent/50 pt-5">
                  <dt className="mt-3 text-sm text-muted">{m.label}</dt>
                  <dd className="font-sans text-5xl font-extrabold leading-none text-accent sm:text-6xl">
                    <span dir="ltr" className="inline-block">
                      {m.value}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          <DetailSections
            sections={[
              { title: tc("challenge"), html: cs.challenge },
              { title: tc("approach"), html: cs.approach },
              { title: tc("results"), html: cs.results },
            ]}
          />

          {cs.sector ? (
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-muted">{tc("sector")}</span>
              <ChipLink href={`/sectors/${cs.sector.slug}`}>{cs.sector.name}</ChipLink>
            </div>
          ) : null}

          {cs.gallery && cs.gallery.length > 0 ? (
            <section className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-fg">{td("gallery")}</h2>
              <Gallery images={cs.gallery} title={cs.title} />
            </section>
          ) : null}

          <DetailFooter>
            <ShareButtons title={cs.title} />
            <BackLink href="/case-studies" label={td("backTo", { list: t("caseStudies") })} rtl={rtl} />
          </DetailFooter>
        </Container>
      </section>

      <RelatedGrid
        title={ts("relatedArticles")}
        items={(cs.articles ?? []).map((a) => ({
          href: `/insights/${a.slug}`,
          title: a.title,
          category: a.type_label,
          meta: formatDate(a.published_at, loc),
          cover: a.cover,
        }))}
        cta={td("readArticle")}
        rtl={rtl}
        surface
      />

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </article>
  );
}
