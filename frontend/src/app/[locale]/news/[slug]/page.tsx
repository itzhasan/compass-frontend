import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Attachments } from "@/components/detail/Attachments";
import { BackLink, DetailCover, DetailFooter, RelatedGrid } from "@/components/detail/DetailBlocks";
import { DetailHero, HeroBadge } from "@/components/detail/DetailHero";
import { Gallery } from "@/components/detail/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { ShareButtons } from "@/components/ShareButtons";
import { ButtonExternal } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CtaBand, ctaCopy, ForwardArrow } from "@/components/ui/Editorial";
import { RichText } from "@/components/ui/RichText";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { newsLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { listers, slugParams } from "@/lib/static-params";

// Prebuild known slugs; new CMS items still render on demand.
export const generateStaticParams = slugParams(listers.news);
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const news = await api.newsItem(locale as Locale, slug);
  if (!news) return {};
  return buildMetadata(news.seo, news.alternates, locale as Locale, { text: news.body, image: news.cover });
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const rtl = loc === "ar";

  const news = await api.newsItem(loc, slug);
  if (!news) notFound();

  const [t, tn, td, common, latest] = await Promise.all([
    getTranslations("nav"),
    getTranslations("news"),
    getTranslations("detail"),
    getTranslations("common"),
    api.news(loc, { page: 1 }).catch(() => ({ data: [] })),
  ]);

  const more = latest.data.filter((n) => n.slug !== news.slug).slice(0, 3);
  const expiresOn =
    news.expires_at && !news.is_expired ? td("expiresOn", { date: formatDate(news.expires_at, loc) }) : null;

  return (
    <article>
      <JsonLd data={newsLd(news, `/${loc}/news/${news.slug}`)} />
      <DetailHero
        loc={loc}
        path={`/news/${news.slug}`}
        crumbs={[
          { label: t("home"), href: "/" },
          { label: t("news"), href: "/news" },
        ]}
        label={td("labels.news")}
        title={news.title}
        badges={
          <>
            <HeroBadge>{news.category_label}</HeroBadge>
            {news.is_expired ? <HeroBadge tone="warning">{common("expired")}</HeroBadge> : null}
          </>
        }
        meta={[formatDate(news.published_at, loc), expiresOn]}
      >
        {/* The API drops `cta` once the item has expired. */}
        {news.cta ? (
          <ButtonExternal href={news.cta.url} target="_blank" variant="secondary">
            {news.cta.label || tn("register")}
            <ForwardArrow rtl={rtl} />
          </ButtonExternal>
        ) : null}
      </DetailHero>

      <DetailCover src={news.cover} alt={news.title} />

      <Container className="max-w-3xl py-14 sm:py-16">
        <RichText html={news.body} className="text-[1.05rem] leading-relaxed" />

        {news.gallery && news.gallery.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-fg">{td("gallery")}</h2>
            <Gallery images={news.gallery} title={news.title} />
          </section>
        ) : null}

        <Attachments title={td("attachments")} files={news.attachments ?? []} />

        <DetailFooter>
          <ShareButtons title={news.title} />
          <BackLink href="/news" label={td("backTo", { list: t("news") })} rtl={rtl} />
        </DetailFooter>
      </Container>

      <RelatedGrid
        title={td("moreNews")}
        items={more.map((n) => ({
          href: `/news/${n.slug}`,
          title: n.title,
          category: n.category_label,
          meta: formatDate(n.published_at, loc),
          cover: n.cover,
        }))}
        cta={td("readNews")}
        rtl={rtl}
        surface
      />

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </article>
  );
}
