import { getTranslations, setRequestLocale } from "next-intl/server";

import { SearchBox } from "@/components/SearchBox";
import { Container } from "@/components/ui/Container";
import { ArrowBadge, EditorialHeading, EditorialHero, editorialCard, ForwardArrow } from "@/components/ui/Editorial";
import { Pagination } from "@/components/ui/Pagination";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("articles") };
}

type Topic = "data" | "finance" | "development";
const TOPICS: Topic[] = ["data", "finance", "development"];

interface Read {
  topic: Topic;
  meta: string;
  title: string;
  body: string;
  href: string;
}

interface InsightsContent {
  hero: { label: string; title: string; subtitle: string };
  all: string;
  topics: Record<Topic, string>;
  searchPlaceholder: string;
  featured: Read & { label: string; cta: string; stat: string; statLabel: string; statSource: string };
  reads: Read[];
  readSource: string;
  noMatches: string;
  articles: { eyebrow: string; title: string; read: string };
}

const content: Record<Locale, InsightsContent> = {
  ar: {
    hero: {
      label: "INSIGHTS & RESEARCH / 06",
      title: "المعرفة التي تدعم قرارك",
      subtitle: "قراءات موثّقة حول بيئة الأعمال العراقية والبيانات والتمويل والتنمية.",
    },
    all: "الكل",
    topics: { data: "البيانات", finance: "التمويل", development: "التنمية" },
    searchPlaceholder: "ابحث بعنوان المقال أو الموضوع…",
    featured: {
      topic: "data",
      label: "قراءة مختارة / بيانات السوق",
      meta: "",
      title: "كيف تساعد البيانات المحلية على فهم السوق العراقي؟",
      body: "تعرّف على iDATA، وهي مبادرة محلية تجمع البيانات وتقدّمها عبر لوحات تفاعلية.",
      href: "https://www.undp.org/iraq",
      cta: "اقرأ المقال لدى UNDP",
      stat: "06",
      statLabel: "لوحات بيانات في المنصة",
      statSource: "وفق مقال UNDP • أبريل 2025",
    },
    reads: [
      {
        topic: "data",
        meta: "21 أبريل 2025 / UNDP",
        title: "بيانات محلية لقرارات أعمال أفضل",
        body: "منصة iDATA تجمع البيانات وتقدّمها عبر لوحات تفاعلية لفهم السوق العراقي.",
        href: "https://www.undp.org/iraq",
      },
      {
        topic: "finance",
        meta: "23 سبتمبر 2024 / IFC",
        title: "تمويل مستدام للقطاع المصرفي العراقي",
        body: "خارطة طريق تمتد سبع سنوات لإدماج الاستدامة في القطاع المالي.",
        href: "https://www.ifc.org",
      },
      {
        topic: "finance",
        meta: "13 سبتمبر 2025 / IFC",
        title: "عشرون عامًا من استثمارات IFC في العراق",
        body: "إعلان مليار دولار من الاستثمارات الجديدة خلال فعالية الشراكات في بغداد.",
        href: "https://www.ifc.org",
      },
      {
        topic: "development",
        meta: "تقرير 2025 / UNDP",
        title: "التنمية في العراق: التقرير السنوي 2025",
        body: "مرجع للاطلاع على برامج الحوكمة والعمل المناخي والتنمية الاقتصادية.",
        href: "https://www.undp.org/iraq",
      },
    ],
    readSource: "اقرأ المصدر",
    noMatches: "لا توجد قراءات مطابقة.",
    articles: { eyebrow: "من البوصلة", title: "مقالات ودراسات", read: "اقرأ المقال" },
  },
  en: {
    hero: {
      label: "INSIGHTS & RESEARCH / 06",
      title: "Knowledge that supports your decisions",
      subtitle: "Sourced reading on Iraq's business environment, data, finance and development.",
    },
    all: "All",
    topics: { data: "Data", finance: "Finance", development: "Development" },
    searchPlaceholder: "Search by article title or topic…",
    featured: {
      topic: "data",
      label: "Featured read / Market data",
      meta: "",
      title: "How can local data help you understand the Iraqi market?",
      body: "Meet iDATA, a local initiative that collects data and presents it through interactive dashboards.",
      href: "https://www.undp.org/iraq",
      cta: "Read the article on UNDP",
      stat: "06",
      statLabel: "data dashboards on the platform",
      statSource: "Per UNDP article • April 2025",
    },
    reads: [
      {
        topic: "data",
        meta: "21 April 2025 / UNDP",
        title: "Local data for better business decisions",
        body: "The iDATA platform collects data and presents it in interactive dashboards for understanding the Iraqi market.",
        href: "https://www.undp.org/iraq",
      },
      {
        topic: "finance",
        meta: "23 September 2024 / IFC",
        title: "Sustainable finance for Iraq's banking sector",
        body: "A seven-year roadmap for integrating sustainability into the financial sector.",
        href: "https://www.ifc.org",
      },
      {
        topic: "finance",
        meta: "13 September 2025 / IFC",
        title: "Twenty years of IFC investment in Iraq",
        body: "A billion dollars in new investment announced at a partnerships event in Baghdad.",
        href: "https://www.ifc.org",
      },
      {
        topic: "development",
        meta: "2025 report / UNDP",
        title: "Development in Iraq: 2025 annual report",
        body: "A reference on governance, climate action and economic development programs.",
        href: "https://www.undp.org/iraq",
      },
    ],
    readSource: "Read the source",
    noMatches: "No matching reads.",
    articles: { eyebrow: "From Compass", title: "Articles & studies", read: "Read the article" },
  },
};

const isTopic = (v: string | undefined): v is Topic => !!v && (TOPICS as string[]).includes(v);

function matches(r: Read, topic: Topic | undefined, q: string) {
  if (topic && r.topic !== topic) return false;
  if (!q) return true;
  return `${r.title} ${r.body} ${r.meta}`.toLowerCase().includes(q.toLowerCase());
}

export default async function InsightsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string; page?: string; topic?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = content[loc] ?? content.ar;
  const rtl = loc === "ar";
  const topic = isTopic(sp.topic) ? sp.topic : undefined;
  const q = (sp.q ?? "").trim();

  // The curated reads are static, so keep the page up even if the articles API is down.
  const res = await api
    .articles(loc, { q: sp.q, type: sp.type, page: sp.page })
    .catch(() => ({ data: [], meta: { current_page: 1, last_page: 1 } }));

  const showFeatured = matches(c.featured, topic, q);
  const reads = c.reads.filter((r) => matches(r, topic, q));

  return (
    <>
      <EditorialHero {...c.hero} />

      <section className="bg-surface py-14 sm:py-20">
        <Container>
          {/* Topic chips + search */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <nav className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap" aria-label={c.all}>
              {([undefined, ...TOPICS] as (Topic | undefined)[]).map((t) => {
                const active = topic === t;
                return (
                  <Link
                    key={t ?? "all"}
                    href={t ? { pathname: "/insights", query: { topic: t } } : "/insights"}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "grid h-11 min-w-32 place-items-center rounded-[var(--radius)] px-6 text-sm font-bold transition-colors",
                      active
                        ? "bg-primary text-primary-fg"
                        : "bg-accent/15 text-fg hover:bg-accent/25",
                    )}
                  >
                    {t ? c.topics[t] : c.all}
                  </Link>
                );
              })}
            </nav>
            <SearchBox
              pathname="/insights"
              defaultValue={sp.q ?? ""}
              placeholder={c.searchPlaceholder}
              className="max-w-none lg:ms-auto lg:max-w-xl"
            />
          </div>

          {/* Featured read */}
          {showFeatured ? (
            <a
              href={c.featured.href}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group mt-10 grid items-center gap-8 rounded-[var(--radius-lg)] bg-primary p-6 text-white dark:bg-ink-2 sm:p-8 lg:grid-cols-[1fr_minmax(0,20rem)]"
            >
              <div>
                <p className="text-xs font-semibold text-accent">{c.featured.label}</p>
                <h2 className="display-heading mt-4 text-3xl leading-snug sm:text-4xl sm:leading-snug">
                  {c.featured.title}
                </h2>
                <p className="mt-4 text-white/70">{c.featured.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent">
                  {c.featured.cta}
                  <ForwardArrow rtl={rtl} />
                </span>
              </div>
              <div className="rounded-[var(--radius)] bg-white/[0.06] p-7 text-end">
                <p className="font-sans text-6xl font-extrabold leading-none text-accent">{c.featured.stat}</p>
                <p className="mt-5 font-bold">{c.featured.statLabel}</p>
                <p className="mt-2 text-xs text-white/60">{c.featured.statSource}</p>
              </div>
            </a>
          ) : null}

          {/* Curated reads */}
          {reads.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {reads.map((r) => (
                <a
                  key={r.title}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("reveal flex flex-col", editorialCard)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-muted">{r.meta}</span>
                    <ArrowBadge rtl={rtl} />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-fg">{r.title}</h3>
                  <p className="mt-3 text-sm text-muted">{r.body}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-bold text-fg">
                    {c.readSource}
                    <ForwardArrow rtl={rtl} className="h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
          ) : null}

          {!showFeatured && reads.length === 0 && (topic || res.data.length === 0) ? (
            <p className="mt-10 text-center text-muted">{c.noMatches}</p>
          ) : null}
        </Container>
      </section>

      {/* Compass articles from the CMS (hidden while a topic chip is active). */}
      {!topic && res.data.length > 0 ? (
        <section className="py-16 sm:py-24">
          <Container>
            <EditorialHeading eyebrow={c.articles.eyebrow} title={c.articles.title} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {res.data.map((a) => (
                <Link
                  key={a.id}
                  href={`/insights/${a.slug}`}
                  className={cn("reveal flex flex-col", editorialCard)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-muted">
                      {[formatDate(a.published_at, loc), a.type_label].filter(Boolean).join(" / ")}
                    </span>
                    <ArrowBadge rtl={rtl} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-fg">{a.title}</h3>
                  {a.prepared_by ? <p className="mt-3 text-sm text-muted">{a.prepared_by}</p> : null}
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-bold text-fg">
                    {c.articles.read}
                    <ForwardArrow rtl={rtl} className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
            <Pagination
              pathname="/insights"
              currentPage={res.meta.current_page}
              lastPage={res.meta.last_page}
              query={{ q: sp.q, type: sp.type }}
            />
          </Container>
        </section>
      ) : null}
    </>
  );
}
