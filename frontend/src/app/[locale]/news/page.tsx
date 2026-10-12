import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

import { CoverImage } from "@/components/CoverImage";
import { Container } from "@/components/ui/Container";
import { EditorialHeading, EditorialHero } from "@/components/ui/Editorial";
import { ImagePlaceholder, MediaTile, mediaTileClass } from "@/components/ui/MediaTile";
import { Pagination } from "@/components/ui/Pagination";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("news") };
}

interface Story {
  category: string;
  title: string;
  meta: string;
  body: string;
  href: string;
  /** Optional illustrative photo under /public (e.g. "/news/ifc.jpg"). */
  image?: string;
}

interface NewsContent {
  hero: { label: string; title: string; subtitle: string };
  market: { title: string; subtitle: string; cta: string; imageNote: string; stories: Story[] };
  own: { eyebrow: string; title: string; cta: string };
}

const content: Record<Locale, NewsContent> = {
  ar: {
    hero: {
      label: "MARKET NEWS / 07",
      title: "مستجدات من بيئة الأعمال",
      subtitle: "أخبار موثّقة من جهات مستقلة؛ لتكوين صورة أوضح عن السوق العراقي.",
    },
    market: {
      title: "أخبار ومبادرات من العراق",
      subtitle: "أخبار منشورة من مصادرها الأصلية، مع تاريخ واضح لكل خبر.",
      cta: "اقرأ الخبر من المصدر",
      imageNote: "الصور تعبيرية للتصميم، وليست صورًا توثيقية للأحداث.",
      stories: [
        {
          category: "استثمارات",
          title: "تعلن IFC استثمارات جديدة بالعراق",
          meta: "13 سبتمبر 2025 / IFC",
          body: "إعلان مليار دولار خلال فعالية الشراكات في بغداد.",
          href: "https://www.ifc.org",
        },
        {
          category: "التحول الرقمي",
          title: "بيانات عراقية بواجهات تفاعلية",
          meta: "21 أبريل 2025 / UNDP",
          body: "تعرّف على منصة iDATA التي طوّرتها KAPITA.",
          href: "https://www.undp.org/iraq",
        },
        {
          category: "القطاع المالي",
          title: "خارطة طريق للتمويل المستدام",
          meta: "23 سبتمبر 2024 / IFC",
          body: "تعاون مع البنك المركزي العراقي لتطوير التمويل المستدام.",
          href: "https://www.ifc.org",
        },
      ],
    },
    own: { eyebrow: "من البوصلة", title: "أخبار وإعلانات البوصلة", cta: "اقرأ الخبر" },
  },
  en: {
    hero: {
      label: "MARKET NEWS / 07",
      title: "Updates from the business environment",
      subtitle: "Sourced news from independent organizations, for a clearer picture of the Iraqi market.",
    },
    market: {
      title: "News and initiatives from Iraq",
      subtitle: "News published by its original sources, with a clear date on every item.",
      cta: "Read at the source",
      imageNote: "Images are illustrative and do not document the events.",
      stories: [
        {
          category: "Investment",
          title: "IFC announces new investments in Iraq",
          meta: "13 September 2025 / IFC",
          body: "A billion dollars announced at a partnerships event in Baghdad.",
          href: "https://www.ifc.org",
        },
        {
          category: "Digital transformation",
          title: "Iraqi data through interactive dashboards",
          meta: "21 April 2025 / UNDP",
          body: "Meet iDATA, the platform developed by KAPITA.",
          href: "https://www.undp.org/iraq",
        },
        {
          category: "Financial sector",
          title: "A roadmap for sustainable finance",
          meta: "23 September 2024 / IFC",
          body: "Working with the Central Bank of Iraq to develop sustainable finance.",
          href: "https://www.ifc.org",
        },
      ],
    },
    own: { eyebrow: "From Compass", title: "Compass news & announcements", cta: "Read more" },
  },
};

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ state?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = content[loc] ?? content.ar;
  const rtl = loc === "ar";
  const state = sp.state === "archived" ? "archived" : "active";

  // Market stories are static, so keep the page up even if the news API is down.
  const [res, tn, common] = await Promise.all([
    api
      .news(loc, { state, page: sp.page })
      .catch(() => ({ data: [], meta: { current_page: 1, last_page: 1 } })),
    getTranslations("news"),
    getTranslations("common"),
  ]);

  const stories = c.market.stories;
  const anyImage = stories.some((s) => s.image);
  const tabs = [
    { key: "active", label: tn("active") },
    { key: "archived", label: tn("archive") },
  ] as const;

  return (
    <>
      <EditorialHero {...c.hero} />

      {/* Market news */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <EditorialHeading title={c.market.title} subtitle={c.market.subtitle} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {stories.map((s) => (
              <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" className={mediaTileClass}>
                <MediaTile
                  media={
                    s.image ? (
                      <Image src={s.image} alt="" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                    ) : (
                      <ImagePlaceholder />
                    )
                  }
                  category={s.category}
                  title={s.title}
                  meta={s.meta}
                  body={s.body}
                  cta={c.market.cta}
                  rtl={rtl}
                />
              </a>
            ))}
          </div>
          {anyImage ? <p className="mt-8 text-xs text-muted">{c.market.imageNote}</p> : null}
        </Container>
      </section>

      {/* Compass news from the CMS — shown when there is any, or when browsing the archive. */}
      {res.data.length > 0 || state === "archived" ? (
        <section className="py-16 sm:py-24">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <EditorialHeading eyebrow={c.own.eyebrow} title={c.own.title} />
              <div role="tablist" className="mb-10 inline-flex rounded-[var(--radius)] bg-surface-2 p-1">
                {tabs.map((tab) => (
                  <Link
                    key={tab.key}
                    role="tab"
                    aria-selected={state === tab.key}
                    href={tab.key === "active" ? "/news" : { pathname: "/news", query: { state: "archived" } }}
                    className={cn(
                      "rounded-[var(--radius-sm)] px-5 py-2 text-sm font-bold transition-colors",
                      state === tab.key ? "bg-primary text-primary-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </div>

            {res.data.length === 0 ? (
              <p className="text-center text-muted">{common("emptyState")}</p>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {res.data.map((n) => (
                    <Link key={n.id} href={`/news/${n.slug}`} className={mediaTileClass}>
                      <MediaTile
                        media={n.cover ? <CoverImage src={n.cover} alt={n.title} /> : <ImagePlaceholder />}
                        category={n.is_expired ? `${n.category_label} · ${common("expired")}` : n.category_label}
                        title={n.title}
                        meta={formatDate(n.published_at, loc)}
                        cta={c.own.cta}
                        rtl={rtl}
                        dimmed={n.is_expired}
                      />
                    </Link>
                  ))}
                </div>
                <Pagination
                  pathname="/news"
                  currentPage={res.meta.current_page}
                  lastPage={res.meta.last_page}
                  query={{ state }}
                />
              </>
            )}
          </Container>
        </section>
      ) : null}
    </>
  );
}
