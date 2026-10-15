import { ExternalLink, Globe } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BackLink, DetailSections } from "@/components/detail/DetailBlocks";
import { DetailHero, HeroBadge } from "@/components/detail/DetailHero";
import { ButtonExternal } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CtaBand, ctaCopy } from "@/components/ui/Editorial";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { buildMetadata } from "@/lib/seo";
import { listers, slugParams } from "@/lib/static-params";

// Prebuild known slugs; new CMS items still render on demand.
export const generateStaticParams = slugParams(listers.ecosystem);
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const e = await api.ecosystemEntity(locale as Locale, slug);
  if (!e) return {};
  return buildMetadata(e.seo, e.alternates, locale as Locale, { text: e.short_bio, image: e.logo });
}

/** Wraps plain-text CMS fields in a paragraph so they render like rich text. */
function asHtml(value: string | null): string | null {
  if (!value) return null;
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  const escaped = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<p>${escaped}</p>`;
}

export default async function EcosystemDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const rtl = loc === "ar";

  const entity = await api.ecosystemEntity(loc, slug);
  if (!entity) notFound();

  const [t, te, td] = await Promise.all([
    getTranslations("nav"),
    getTranslations("ecosystem"),
    getTranslations("detail"),
  ]);

  const hasLinks = Boolean(entity.website) || entity.socials.length > 0;

  return (
    <>
      <DetailHero
        loc={loc}
        path={`/ecosystem/${entity.slug}`}
        crumbs={[
          { label: t("home"), href: "/" },
          { label: t("ecosystem"), href: "/ecosystem" },
        ]}
        label={td("labels.ecosystem")}
        title={entity.name}
        subtitle={entity.field_of_work}
        badges={
          <>
            <HeroBadge>{entity.type_label}</HeroBadge>
            {entity.classification ? <HeroBadge tone="muted">{entity.classification}</HeroBadge> : null}
          </>
        }
        media={
          entity.logo ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-lg sm:h-20 sm:w-20">
              <Image src={entity.logo} alt={entity.name} fill sizes="80px" className="object-contain p-3" />
            </div>
          ) : null
        }
      />

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          <DetailSections
            sections={[
              { title: te("about"), html: entity.short_bio },
              { title: te("relationship"), html: asHtml(entity.relationship) },
            ]}
          />

          {hasLinks ? (
            <div className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-fg">{te("links")}</h2>
              <div className="flex flex-wrap gap-3">
                {entity.website ? (
                  <ButtonExternal href={entity.website} target="_blank" variant="secondary">
                    <Globe className="h-4 w-4" aria-hidden />
                    {te("website")}
                  </ButtonExternal>
                ) : null}
                {entity.socials.map((s) => (
                  <ButtonExternal key={s.platform + s.url} href={s.url} target="_blank" variant="outline" className="capitalize">
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    {s.platform}
                  </ButtonExternal>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-12">
            <BackLink href="/ecosystem" label={td("backTo", { list: t("ecosystem") })} rtl={rtl} />
          </div>
        </Container>
      </section>

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </>
  );
}
