import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

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
import { newsLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const news = await api.newsItem(locale as Locale, slug);
  if (!news) return {};
  return buildMetadata(news.seo, news.alternates, locale as Locale);
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [news, t, tn, common] = await Promise.all([
    api.newsItem(loc, slug),
    getTranslations("nav"),
    getTranslations("news"),
    getTranslations("common"),
  ]);
  if (!news) notFound();

  return (
    <article>
      <JsonLd data={newsLd(news, `/${loc}/news/${news.slug}`)} />
      <div className="border-b border-border bg-surface">
        <Container className="py-10">
          <Breadcrumbs
            items={[
              { label: t("home"), href: "/" },
              { label: t("news"), href: "/news" },
              { label: news.title },
            ]}
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{news.category_label}</Badge>
            {news.is_expired ? <Badge tone="warning">{common("expired")}</Badge> : null}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">{news.title}</h1>
          {news.published_at ? (
            <p className="mt-3 text-sm text-muted">{formatDate(news.published_at, loc)}</p>
          ) : null}
        </Container>
      </div>

      {news.cover ? (
        <div className="relative aspect-[21/9] max-h-[420px] w-full">
          <CoverImage src={news.cover} alt={news.title} sizes="100vw" priority />
        </div>
      ) : null}

      <Container className="py-12">
        <RichText html={news.body} />

        {/* CTA is hidden by the API once the item has expired. */}
        {news.cta ? (
          <div className="mt-8">
            <ButtonExternal href={news.cta.url}>{news.cta.label || tn("register")}</ButtonExternal>
          </div>
        ) : null}

        {news.gallery && news.gallery.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {news.gallery.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-[var(--radius)]">
                <CoverImage src={src} alt="" sizes="(max-width: 640px) 50vw, 33vw" />
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-10 border-t border-border pt-6">
          <ShareButtons title={news.title} />
        </div>
      </Container>
    </article>
  );
}
