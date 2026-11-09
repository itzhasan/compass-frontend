import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProcessSteps } from "@/components/detail/ProcessSteps";
import { Container } from "@/components/ui/Container";
import {
  ArrowBadge,
  CtaBand,
  ctaCopy,
  EditorialHeading,
  EditorialHero,
  editorialCard,
  ForwardArrow,
} from "@/components/ui/Editorial";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { cn } from "@/lib/cn";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("services") };
}

interface CardItem {
  tag: string;
  title: string;
  body: string;
  href: string;
}

interface ServicesContent {
  hero: { label: string; title: string; subtitle: string };
  services: { eyebrow: string; title: string; subtitle: string; tags: string[]; items: { title: string; body: string }[] };
  deliverables: { eyebrow: string; title: string; tag: string; items: { title: string; body: string }[] };
  more: string;
}

const content: Record<Locale, ServicesContent> = {
  ar: {
    hero: {
      label: "OUR SERVICES / 02",
      title: "من التحدّي إلى الحل المناسب",
      subtitle: "أربع خدمات مترابطة، تُقدَّم منفردة أو ضمن برنامج تطوير متكامل.",
    },
    services: {
      eyebrow: "اختر نقطة البداية",
      title: "ماذا تحتاج شركتك اليوم؟",
      subtitle: "لكل خدمة نطاق واضح ومخرجات عملية يمكن البناء عليها.",
      tags: ["COMMERCIAL SYSTEMS", "ORGANIZATIONAL DESIGN", "BUSINESS STRATEGY", "GROWTH & MARKETING"],
      items: [
        { title: "تطوير الأنظمة التجارية", body: "نبني دورة تجارية مترابطة: من التسعير وإدارة العملاء إلى المخزون والتحصيل." },
        { title: "الهيكلة التنظيمية", body: "أدوار واضحة، صلاحيات متوازنة، ومسارات عمل تدعم النمو وتقلّل التداخل." },
        { title: "التخطيط الاستراتيجي", body: "نحوّل الأهداف إلى مبادرات محددة ومسؤوليات ومؤشرات متابعة قابلة للقياس." },
        { title: "التسويق والمبيعات", body: "تموضع أدق للعلامة، قنوات بيع مناسبة، وربط التسويق بنتائج الأعمال." },
      ],
    },
    deliverables: {
      eyebrow: "مخرجات التعاون",
      title: "حلول جاهزة للانتقال إلى التنفيذ",
      tag: "مخرجات",
      items: [
        { title: "النظام التجاري", body: "سياسات التسعير، مسار المبيعات، إدارة العملاء، متابعة المخزون والتحصيل." },
        { title: "الهيكل التنظيمي", body: "الهيكل، توصيف الوظائف، الصلاحيات، ومسارات التنسيق والمساءلة." },
        { title: "الخطة الاستراتيجية", body: "تحليل واقع الشركة، أولويات النمو، المبادرات، ومؤشرات المتابعة." },
        { title: "خطة التسويق والمبيعات", body: "تموضع العلامة، فهم الجمهور، القنوات، والقياس المرتبط بالإيراد." },
      ],
    },
    more: "استكشف التفاصيل",
  },
  en: {
    hero: {
      label: "OUR SERVICES / 02",
      title: "From challenge to the right solution",
      subtitle: "Four connected services, delivered on their own or as part of an integrated development program.",
    },
    services: {
      eyebrow: "Choose your starting point",
      title: "What does your company need today?",
      subtitle: "Every service has a clear scope and practical deliverables you can build on.",
      tags: ["COMMERCIAL SYSTEMS", "ORGANIZATIONAL DESIGN", "BUSINESS STRATEGY", "GROWTH & MARKETING"],
      items: [
        { title: "Commercial systems", body: "A connected commercial cycle — from pricing and customer management to inventory and collections." },
        { title: "Organizational design", body: "Clear roles, balanced authority and workflows that support growth and reduce overlap." },
        { title: "Strategic planning", body: "We turn goals into defined initiatives, responsibilities and measurable indicators." },
        { title: "Marketing & sales", body: "Sharper brand positioning, the right sales channels, and marketing tied to business results." },
      ],
    },
    deliverables: {
      eyebrow: "What you get",
      title: "Solutions ready for execution",
      tag: "Deliverable",
      items: [
        { title: "Commercial system", body: "Pricing policies, sales pipeline, customer management, inventory and collections tracking." },
        { title: "Organizational structure", body: "Structure, job descriptions, authorities, and coordination and accountability paths." },
        { title: "Strategic plan", body: "Company assessment, growth priorities, initiatives and tracking indicators." },
        { title: "Marketing & sales plan", body: "Brand positioning, audience insight, channels and revenue-linked measurement." },
      ],
    },
    more: "Explore details",
  },
};

const num = (i: number) => String(i + 1).padStart(2, "0");

function DetailsLink({ label, rtl, featured }: { label: string; rtl: boolean; featured?: boolean }) {
  return (
    <span className={cn("mt-6 inline-flex items-center gap-2 text-xs font-bold", featured ? "text-accent" : "text-fg")}>
      {label}
      <ForwardArrow rtl={rtl} className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
    </span>
  );
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = content[loc] ?? content.ar;
  const rtl = loc === "ar";

  // CMS services win when the API has them; otherwise fall back to the core four.
  const apiServices = await api.services(loc);
  const services: CardItem[] =
    apiServices.length > 0
      ? apiServices.map((s, i) => ({
          tag: num(i),
          title: s.title,
          body: s.summary ?? "",
          href: `/services/${s.slug}`,
        }))
      : c.services.items.map((s, i) => ({
          ...s,
          tag: `${num(i)} / ${c.services.tags[i]}`,
          href: "/contact",
        }));

  return (
    <>
      <EditorialHero {...c.hero} />

      {/* Services */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <EditorialHeading eyebrow={c.services.eyebrow} title={c.services.title} subtitle={c.services.subtitle} />
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((s, i) => {
              const featured = i === 0;
              return (
                <Link
                  key={s.title}
                  href={s.href}
                  className={cn(
                    "reveal",
                    editorialCard,
                    featured && "border-transparent bg-primary text-white dark:bg-ink-2",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={cn(
                        "font-sans text-[0.65rem] font-semibold",
                        featured ? "text-accent" : "text-muted",
                      )}
                    >
                      {s.tag}
                    </span>
                    <ArrowBadge rtl={rtl} inverted={featured} />
                  </div>
                  <h3 className={cn("mt-5 text-2xl font-bold", featured ? "text-white" : "text-fg")}>{s.title}</h3>
                  {s.body ? (
                    <p className={cn("mt-3 text-sm", featured ? "text-white/70" : "text-muted")}>{s.body}</p>
                  ) : null}
                  <DetailsLink label={c.more} rtl={rtl} featured={featured} />
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Deliverables */}
      <section className="py-16 sm:py-24">
        <Container>
          <EditorialHeading eyebrow={c.deliverables.eyebrow} title={c.deliverables.title} />
          <div className="grid gap-5 md:grid-cols-2">
            {c.deliverables.items.map((d, i) => (
              <Link key={d.title} href="/packages" className={cn("reveal", editorialCard)}>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[0.65rem] font-semibold text-muted">{`${num(i)} / ${c.deliverables.tag}`}</span>
                  <ArrowBadge rtl={rtl} />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-fg">{d.title}</h3>
                <p className="mt-3 text-sm text-muted">{d.body}</p>
                <DetailsLink label={c.more} rtl={rtl} />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <ProcessSteps loc={loc} />

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </>
  );
}
