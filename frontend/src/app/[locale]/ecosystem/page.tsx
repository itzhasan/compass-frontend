import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import {
  ArrowBadge,
  CtaBand,
  EditorialHeading,
  EditorialHero,
  editorialCard,
  Eyebrow,
  ForwardArrow,
} from "@/components/ui/Editorial";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { cn } from "@/lib/cn";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("ecosystem") };
}

interface Reference {
  tag: string;
  name: string;
  body: string;
  /** Internal path or absolute URL. */
  href: string;
}

interface EcosystemContent {
  hero: { label: string; title: string; subtitle: string };
  pathways: { eyebrow: string; title: string; items: { tag: string; title: string; body: string }[] };
  references: { eyebrow: string; title: string; subtitle: string; source: string; items: Reference[] };
  members: { eyebrow: string; title: string; more: string };
  cta: { label: string; title: string; subtitle: string; button: string };
}

const content: Record<Locale, EcosystemContent> = {
  ar: {
    hero: {
      label: "COMPASS ECOSYSTEM / 05",
      title: "شبكة خبرات. فرص أوسع.",
      subtitle: "التكامل بين الاستشارة والتدريب والمعرفة يفتح مسارات جديدة لتطوير الأعمال.",
    },
    pathways: {
      eyebrow: "مسارات التكامل",
      title: "منظومة ترتبط باحتياج المؤسسة",
      items: [
        { tag: "01 / CONSULTING", title: "الاستشارات والتطوير", body: "تخطيط وهيكلة وأنظمة عمل تدعم قرارات المؤسسة." },
        { tag: "02 / CAPABILITY", title: "التدريب وبناء القدرات", body: "تطوير المهارات ونقل المعرفة أثناء التطبيق." },
        { tag: "03 / KNOWLEDGE", title: "المعرفة والبيانات", body: "مصادر ودراسات تساعد على فهم السوق وفرصه." },
      ],
    },
    references: {
      eyebrow: "أمثلة مستقلة من العراق",
      title: "مبادرات وجهات يمكن التعلّم منها",
      subtitle: "مراجع من بيئة الأعمال؛ لا تمثّل إعلان شراكة أو تبعية للبوصلة.",
      source: "اقرأ المصدر",
      items: [
        {
          tag: "بيانات وريادة أعمال",
          name: "KAPITA / iDATA",
          body: "منصة عراقية للبيانات ولوحات تفاعلية لدعم فهم الاقتصاد وريادة الأعمال.",
          href: "https://kapita.iq",
        },
        {
          tag: "تنمية وبناء قدرات",
          name: "UNDP Iraq",
          body: "برامج ومراجع حول التنمية والحوكمة والعمل المناخي في العراق.",
          href: "https://www.undp.org/iraq",
        },
        {
          tag: "تمويل القطاع الخاص",
          name: "IFC",
          body: "مبادرات استثمار وتمويل مستدام لدعم القطاع الخاص العراقي.",
          href: "https://www.ifc.org",
        },
      ],
    },
    members: { eyebrow: "منظومة البوصلة", title: "جهات المنظومة", more: "اكتشف المزيد" },
    cta: {
      label: "LET'S TALK / لنتحدث",
      title: "لنبنِ تعاونًا يصنع قيمة",
      subtitle: "ناقش معنا فرص التعاون المهني والمؤسسي.",
      button: "احجز استشارة",
    },
  },
  en: {
    hero: {
      label: "COMPASS ECOSYSTEM / 05",
      title: "A network of expertise. Wider opportunities.",
      subtitle: "Bringing consulting, training and knowledge together opens new paths for business development.",
    },
    pathways: {
      eyebrow: "Integration pathways",
      title: "An ecosystem tied to what your organization needs",
      items: [
        { tag: "01 / CONSULTING", title: "Consulting & development", body: "Planning, structuring and operating systems that support decisions." },
        { tag: "02 / CAPABILITY", title: "Training & capability building", body: "Building skills and transferring knowledge during implementation." },
        { tag: "03 / KNOWLEDGE", title: "Knowledge & data", body: "Sources and studies that help you understand the market and its opportunities." },
      ],
    },
    references: {
      eyebrow: "Independent examples from Iraq",
      title: "Initiatives and organizations to learn from",
      subtitle: "References from the business environment; they do not imply a partnership with or affiliation to Compass.",
      source: "Read the source",
      items: [
        {
          tag: "Data & entrepreneurship",
          name: "KAPITA / iDATA",
          body: "An Iraqi data platform with interactive dashboards for understanding the economy and entrepreneurship.",
          href: "https://kapita.iq",
        },
        {
          tag: "Development & capacity",
          name: "UNDP Iraq",
          body: "Programs and resources on development, governance and climate action in Iraq.",
          href: "https://www.undp.org/iraq",
        },
        {
          tag: "Private-sector finance",
          name: "IFC",
          body: "Investment and sustainable-finance initiatives supporting Iraq's private sector.",
          href: "https://www.ifc.org",
        },
      ],
    },
    members: { eyebrow: "Compass ecosystem", title: "Ecosystem members", more: "Learn more" },
    cta: {
      label: "LET'S TALK",
      title: "Let's build a partnership that creates value",
      subtitle: "Talk to us about professional and institutional collaboration.",
      button: "Book a consultation",
    },
  },
};

/** Internal links go through the locale-aware Link; absolute URLs open in a new tab. */
function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function ReferenceGrid({ items, linkLabel, rtl }: { items: Reference[]; linkLabel: string; rtl: boolean }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((r) => (
        <SmartLink key={r.href} href={r.href} className={cn("reveal flex flex-col", editorialCard)}>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-muted">{r.tag}</span>
            <ArrowBadge rtl={rtl} />
          </div>
          <h3 className="mt-5 text-2xl font-bold text-fg">{r.name}</h3>
          {r.body ? <p className="mt-3 text-sm text-muted">{r.body}</p> : null}
          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-bold text-fg">
            {linkLabel}
            <ForwardArrow rtl={rtl} className="h-3.5 w-3.5" />
          </span>
        </SmartLink>
      ))}
    </div>
  );
}

export default async function EcosystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = content[loc] ?? content.ar;
  const rtl = loc === "ar";

  const entities = await api.ecosystem(loc);
  const members: Reference[] = entities.map((e) => ({
    tag: e.field_of_work ?? e.type_label,
    name: e.name,
    body: e.short_bio ?? "",
    href: `/ecosystem/${e.slug}`,
  }));

  return (
    <>
      <EditorialHero {...c.hero} />

      {/* Pathways */}
      <section className="border-t border-accent/30 bg-[#0e1626] py-16 sm:py-24">
        <Container>
          <div className="reveal mb-10">
            <Eyebrow className="text-accent">{c.pathways.eyebrow}</Eyebrow>
            <h2 className="display-heading text-3xl text-white sm:text-4xl">{c.pathways.title}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {c.pathways.items.map((p, i) => {
              const featured = i === 0;
              return (
                <div
                  key={p.title}
                  className={cn(
                    "reveal",
                    editorialCard,
                    featured ? "border-accent/70 bg-primary dark:bg-ink-2" : "border-transparent bg-white",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className={cn("font-sans text-[0.65rem] font-semibold", featured ? "text-accent" : "text-[#5c6472]")}>
                      {p.tag}
                    </span>
                    <ArrowBadge rtl={rtl} inverted={featured} />
                  </div>
                  <h3 className={cn("mt-5 text-2xl font-bold", featured ? "text-white" : "text-[#141924]")}>{p.title}</h3>
                  <p className={cn("mt-3 text-sm", featured ? "text-white/70" : "text-[#5c6472]")}>{p.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Independent references */}
      <section className="py-16 sm:py-24">
        <Container>
          <EditorialHeading eyebrow={c.references.eyebrow} title={c.references.title} subtitle={c.references.subtitle} />
          <ReferenceGrid items={c.references.items} linkLabel={c.references.source} rtl={rtl} />
        </Container>
      </section>

      {/* Ecosystem members (from the CMS, when present) */}
      {members.length > 0 ? (
        <section className="bg-surface py-16 sm:py-24">
          <Container>
            <EditorialHeading eyebrow={c.members.eyebrow} title={c.members.title} />
            <ReferenceGrid items={members} linkLabel={c.members.more} rtl={rtl} />
          </Container>
        </section>
      ) : null}

      <CtaBand rtl={rtl} {...c.cta} />
    </>
  );
}
