import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CoverImage } from "@/components/CoverImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichText } from "@/components/ui/RichText";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const cs = await api.caseStudy(locale as Locale, slug);
  if (!cs) return {};
  return buildMetadata(cs.seo, cs.alternates, locale as Locale);
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [cs, t, ts] = await Promise.all([
    api.caseStudy(loc, slug),
    getTranslations("nav"),
    getTranslations("sectors"),
  ]);
  if (!cs) notFound();

  const blocks = [
    { label: "Challenge", html: cs.challenge },
    { label: "Approach", html: cs.approach },
    { label: "Results", html: cs.results },
  ];

  return (
    <>
      <PageHeader
        title={cs.title}
        subtitle={cs.client_name}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: t("home"), href: "/" },
              { label: t("caseStudies"), href: "/case-studies" },
              { label: cs.title },
            ]}
          />
        }
      />
      {cs.cover ? (
        <div className="relative aspect-[21/9] max-h-[420px] w-full">
          <CoverImage src={cs.cover} alt={cs.title} sizes="100vw" priority />
        </div>
      ) : null}
      <Container className="py-12">
        {cs.metrics.length > 0 ? (
          <div className="mb-10 grid grid-cols-2 gap-6 rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:grid-cols-4">
            {cs.metrics.map((m) => (
              <div key={m.label}>
                <p className="text-2xl font-bold text-primary">{m.value}</p>
                <p className="text-sm text-muted">{m.label}</p>
              </div>
            ))}
          </div>
        ) : null}

        {blocks
          .filter((b) => b.html)
          .map((b) => (
            <section key={b.label} className="border-t border-border py-6 first:border-t-0">
              <h2 className="mb-3 text-xl font-bold text-fg">{b.label}</h2>
              <RichText html={b.html} />
            </section>
          ))}

        {cs.sector ? (
          <p className="mt-8 text-sm text-muted">
            {ts("definition")}: {cs.sector.name}
          </p>
        ) : null}
      </Container>
    </>
  );
}
