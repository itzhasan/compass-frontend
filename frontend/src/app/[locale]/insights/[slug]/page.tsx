import { Download } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/cards/ContentCards";
import { CoverImage } from "@/components/CoverImage";
import { JsonLd } from "@/components/JsonLd";
import { ShareButtons } from "@/components/ShareButtons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonExternal } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { articleLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const article = await api.article(locale as Locale, slug);
  if (!article) return {};
  return buildMetadata(article.seo, article.alternates, locale as Locale);
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [article, t, common] = await Promise.all([
    api.article(loc, slug),
    getTranslations("nav"),
    getTranslations("common"),
  ]);
  if (!article) notFound();

  const authorNames =
    article.authors && article.authors.length > 0
      ? article.authors.map((a) => a.name).join("، ")
      : article.prepared_by;

  return (
    <article>
      <JsonLd data={articleLd(article, `/${loc}/insights/${article.slug}`)} />
      <div className="border-b border-border bg-surface">
        <Container className="py-10">
          <Breadcrumbs
            items={[
              { label: t("home"), href: "/" },
              { label: t("articles"), href: "/insights" },
              { label: article.title },
            ]}
          />
          <Badge tone="accent" className="mt-4">
            {article.type_label}
          </Badge>
          <h1 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">{article.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            {authorNames ? <span>{authorNames}</span> : null}
            {article.published_at ? <span>{formatDate(article.published_at, loc)}</span> : null}
            {article.reading_time ? <span>{common("readingTime", { minutes: article.reading_time })}</span> : null}
          </div>
        </Container>
      </div>

      {article.cover ? (
        <div className="relative aspect-[21/9] w-full max-h-[420px]">
          <CoverImage src={article.cover} alt={article.title} sizes="100vw" priority />
        </div>
      ) : null}

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_260px]">
        <div>
          <RichText html={article.body} className="text-[1.05rem] leading-relaxed" />

          {article.sources && article.sources.length > 0 ? (
            <section className="mt-10 border-t border-border pt-6">
              <h2 className="mb-3 text-lg font-bold text-fg">Sources &amp; references</h2>
              <ul className="list-inside list-decimal space-y-1 text-sm text-muted">
                {article.sources.map((s, i) => (
                  <li key={i}>
                    <a href={s.url} rel="noopener noreferrer" className="text-primary underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-10 border-t border-border pt-6">
            <ShareButtons title={article.title} />
          </div>
        </div>

        <aside className="space-y-6">
          {article.pdf_url ? (
            <ButtonExternal href={article.pdf_url} variant="outline" className="w-full">
              <Download className="h-4 w-4" aria-hidden />
              {common("downloadPdf")}
            </ButtonExternal>
          ) : null}
          {article.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} tone="neutral">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </aside>
      </Container>

      {article.related_articles && article.related_articles.length > 0 ? (
        <Container className="pb-14">
          <h2 className="mb-6 text-xl font-bold text-fg">{t("articles")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {article.related_articles.map((a) => (
              <ArticleCard key={a.id} article={a} locale={loc} />
            ))}
          </div>
        </Container>
      ) : null}
    </article>
  );
}
