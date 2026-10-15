import { Download, ExternalLink } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import {
  BackLink,
  ChipLink,
  DetailAside,
  DetailCover,
  DetailFooter,
  RelatedGrid,
} from "@/components/detail/DetailBlocks";
import { DetailHero, HeroBadge } from "@/components/detail/DetailHero";
import { JsonLd } from "@/components/JsonLd";
import { ShareButtons } from "@/components/ShareButtons";
import { ButtonExternal } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CtaBand, ctaCopy } from "@/components/ui/Editorial";
import { RichText } from "@/components/ui/RichText";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { articleLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { listers, slugParams } from "@/lib/static-params";

// Prebuild known slugs; new CMS items still render on demand.
export const generateStaticParams = slugParams(listers.articles);
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const article = await api.article(locale as Locale, slug);
  if (!article) return {};
  return buildMetadata(article.seo, article.alternates, locale as Locale, {
    text: article.body,
    image: article.cover,
  });
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const rtl = loc === "ar";

  const article = await api.article(loc, slug);
  if (!article) notFound();

  const [t, td, common] = await Promise.all([
    getTranslations("nav"),
    getTranslations("detail"),
    getTranslations("common"),
  ]);

  const authorNames =
    article.authors && article.authors.length > 0
      ? article.authors.map((a) => a.name).join(rtl ? "، " : ", ")
      : article.prepared_by;
  const date = formatDate(article.published_at, loc);
  const readingTime = article.reading_time ? common("readingTime", { minutes: article.reading_time }) : null;
  const sources = article.sources ?? [];

  return (
    <article>
      <JsonLd data={articleLd(article, `/${loc}/insights/${article.slug}`)} />
      <DetailHero
        loc={loc}
        path={`/insights/${article.slug}`}
        crumbs={[
          { label: t("home"), href: "/" },
          { label: t("articles"), href: "/insights" },
        ]}
        label={td("labels.article")}
        title={article.title}
        badges={<HeroBadge>{article.type_label}</HeroBadge>}
        meta={[authorNames, date, readingTime]}
      />

      <DetailCover src={article.cover} alt={article.title} />

      <Container className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
        <div className="min-w-0">
          <RichText html={article.body} className="text-[1.05rem] leading-relaxed" />

          {sources.length > 0 ? (
            <section className="mt-12 rounded-[var(--radius-lg)] bg-surface p-6">
              <h2 className="mb-4 text-lg font-bold text-fg">{td("sources")}</h2>
              <ol className="space-y-2 text-sm">
                {sources.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-sans font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-fg underline decoration-accent/50 underline-offset-4 hover:text-accent"
                    >
                      {s.label}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <DetailFooter>
            <ShareButtons title={article.title} />
            <BackLink href="/insights" label={td("backTo", { list: t("articles") })} rtl={rtl} />
          </DetailFooter>
        </div>

        <DetailAside
          title={td("keyFacts")}
          facts={[
            { label: td("preparedBy"), value: authorNames },
            { label: td("published"), value: date },
            { label: td("readingTime"), value: readingTime },
          ]}
        >
          {article.pdf_url ? (
            <ButtonExternal href={article.pdf_url} target="_blank" variant="secondary" className="w-full">
              <Download className="h-4 w-4" aria-hidden />
              {common("downloadPdf")}
            </ButtonExternal>
          ) : null}
          {article.tags.length > 0 ? (
            <div>
              <p className="mb-3 mt-2 text-xs font-semibold text-muted">{td("tags")}</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <ChipLink key={tag} href={{ pathname: "/insights", query: { tag } }}>
                    #{tag}
                  </ChipLink>
                ))}
              </div>
            </div>
          ) : null}
        </DetailAside>
      </Container>

      <RelatedGrid
        title={td("relatedArticles")}
        items={(article.related_articles ?? []).map((a) => ({
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
