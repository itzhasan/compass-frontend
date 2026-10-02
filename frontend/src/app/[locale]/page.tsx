import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  ArticleCard,
  CaseStudyCard,
  EcosystemCard,
  NewsCard,
  PackageCard,
  SectorCard,
  ServiceCard,
} from "@/components/cards/ContentCards";
import { HomeHero } from "@/components/HomeHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { api } from "@/lib/api/client";
import type {
  Article,
  CaseStudy,
  EcosystemEntity,
  Locale,
  News,
  Package,
  Sector,
  Service,
  Stat,
} from "@/lib/api/types";

type Data = Record<string, unknown> | null;
function items<T>(data: Data): T[] {
  return ((data?.items as T[]) ?? []) as T[];
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [sections, t, tp] = await Promise.all([
    api.home(loc),
    getTranslations("home"),
    getTranslations("packages.pricing"),
  ]);
  const common = await getTranslations("common");
  const Arrow = loc === "ar" ? ArrowLeft : ArrowRight;

  return (
    <>
      {sections.map(({ key, data }) => {
        switch (key) {
          case "hero":
            return (
              <HomeHero
                key={key}
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
                ctaLabel={t("hero.cta")}
                ctaHref="/book-consultation"
                secondaryLabel={t("hero.secondaryCta")}
                secondaryHref="/services"
              />
            );

          case "problems":
            return (
              <Section key={key} surface>
                <SectionHeading align="center" label="Challenges" title={t("problems.title")} subtitle={t("problems.subtitle")} />
              </Section>
            );

          case "about_summary":
            return (
              <Section key={key} className="text-center">
                <SectionHeading align="center" label="About" index={1} title={t("about.title")} />
                <ButtonLink href="/about" variant="outline">
                  {common("learnMore")} <Arrow className="h-4 w-4" aria-hidden />
                </ButtonLink>
              </Section>
            );

          case "services": {
            const list = items<Service>(data);
            if (list.length === 0) return null;
            return (
              <Section key={key}>
                <SectionHeading align="center" label="Services" index={3} title={t("services.title")} subtitle={t("services.subtitle")} />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </div>
              </Section>
            );
          }

          case "featured_packages": {
            const list = items<Package>(data);
            if (list.length === 0) return null;
            return (
              <Section key={key} surface>
                <SectionHeading align="center" label="Packages" index={4} title={t("featuredPackages.title")} subtitle={t("featuredPackages.subtitle")} />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((p) => (
                    <PackageCard key={p.id} pkg={p} pricingLabel={tp(p.pricing_type)} />
                  ))}
                </div>
              </Section>
            );
          }

          case "sectors": {
            const list = items<Sector>(data);
            if (list.length === 0) return null;
            return (
              <Section key={key}>
                <SectionHeading align="center" label="Sectors" index={5} title={t("sectors.title")} subtitle={t("sectors.subtitle")} />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <SectorCard key={s.id} sector={s} />
                  ))}
                </div>
              </Section>
            );
          }

          case "methodology":
            return (
              <Section key={key} surface>
                <SectionHeading align="center" label="Methodology" index={2} title={t("methodology.title")} subtitle={t("methodology.subtitle")} />
              </Section>
            );

          case "case_studies": {
            const list = items<CaseStudy>(data);
            const stats = ((data?.stats as Stat[]) ?? []) as Stat[];
            return (
              <Section key={key}>
                <SectionHeading align="center" label="Clients" index={6} title={t("caseStudies.title")} subtitle={t("caseStudies.subtitle")} />
                {stats.length > 0 ? (
                  <div className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-4">
                    {stats.map((s) => (
                      <div key={s.key} className="bg-bg px-6 py-8 text-center">
                        <p className="display-heading text-4xl text-accent sm:text-5xl">{s.value}</p>
                        <p className="mt-2 text-sm text-muted">{s.label}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {list.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((c) => (
                      <CaseStudyCard key={c.id} caseStudy={c} />
                    ))}
                  </div>
                ) : null}
              </Section>
            );
          }

          case "ecosystem": {
            const list = items<EcosystemEntity>(data);
            if (list.length === 0) return null;
            return (
              <Section key={key} surface>
                <SectionHeading align="center" label="Ecosystem" index={7} title={t("ecosystem.title")} subtitle={t("ecosystem.subtitle")} />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((e) => (
                    <EcosystemCard key={e.id} entity={e} />
                  ))}
                </div>
              </Section>
            );
          }

          case "latest_articles": {
            const list = items<Article>(data);
            if (list.length === 0) return null;
            return (
              <Section key={key}>
                <div className="flex items-end justify-between">
                  <SectionHeading title={t("latestArticles.title")} className="mb-0" />
                  <ButtonLink href="/insights" variant="ghost" size="sm">
                    {common("viewAll")}
                  </ButtonLink>
                </div>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((a) => (
                    <ArticleCard key={a.id} article={a} locale={loc} />
                  ))}
                </div>
              </Section>
            );
          }

          case "latest_news": {
            const list = items<News>(data);
            if (list.length === 0) return null;
            return (
              <Section key={key} surface>
                <div className="flex items-end justify-between">
                  <SectionHeading title={t("latestNews.title")} className="mb-0" />
                  <ButtonLink href="/news" variant="ghost" size="sm">
                    {common("viewAll")}
                  </ButtonLink>
                </div>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((n) => (
                    <NewsCard key={n.id} news={n} locale={loc} expiredLabel={common("expired")} />
                  ))}
                </div>
              </Section>
            );
          }

          case "consultation_cta":
            return (
              <section key={key} className="bg-accent text-accent-fg">
                <Container className="flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold sm:text-3xl">{t("consultationCta.title")}</h2>
                    <p className="mt-2 text-accent-fg/80">{t("consultationCta.subtitle")}</p>
                  </div>
                  <ButtonLink href="/book-consultation" variant="primary" size="lg">
                    {t("consultationCta.cta")}
                  </ButtonLink>
                </Container>
              </section>
            );

          case "contact":
            return (
              <Section key={key} className="text-center">
                <SectionHeading align="center" title={t("contact.title")} subtitle={t("contact.subtitle")} />
                <ButtonLink href="/contact" variant="outline">
                  {t("contact.title")} <Arrow className="h-4 w-4" aria-hidden />
                </ButtonLink>
              </Section>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
