import { Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  ArrowBadge,
  CtaBand,
  ctaCopy,
  EditorialHeading,
  EditorialHero,
  editorialCard,
} from "@/components/ui/Editorial";
import { api } from "@/lib/api/client";
import type { Locale, Package } from "@/lib/api/types";
import { cn } from "@/lib/cn";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("packages") };
}

interface Plan {
  tag: string;
  name: string;
  /** Shown as-is; numbers render LTR. */
  price: string;
  pricePrefix?: string;
  summary: string;
  features: string[];
  featured: boolean;
  href: string;
  cta: string;
}

interface PackagesContent {
  hero: { label: string; title: string; subtitle: string };
  plans: { eyebrow: string; title: string; subtitle: string; tag: string; featuredTag: string; note: string; cta: string };
  from: string;
  customQuote: string;
  fallback: Omit<Plan, "tag" | "href" | "cta">[];
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
}

const content: Record<Locale, PackagesContent> = {
  ar: {
    hero: {
      label: "ENGAGEMENT PACKAGES / 03",
      title: "الباقة المناسبة لمرحلة شركتك",
      subtitle: "خيارات واضحة للبدء؛ من التشخيص المركّز إلى برنامج تحول مؤسسي.",
    },
    plans: {
      eyebrow: "باقات التعاون",
      title: "نطاق واضح قبل أن تبدأ",
      subtitle: "الأسعار استرشادية؛ يُؤكَّد العرض النهائي بعد تحديد النطاق.",
      tag: "باقة تعاون",
      featuredTag: "نطاق متوازن للنمو",
      note: "المخرجات المقترحة تخضع للاتفاق على النطاق.",
      cta: "اطلب تفاصيل الباقة",
    },
    from: "يبدأ من",
    customQuote: "عرض سعر مخصص",
    fallback: [
      {
        name: "التشخيص السريع",
        price: "1,500 USD",
        summary: "نقطة بداية لفهم التحدّي وتحديد ما يجب العمل عليه أولًا.",
        features: ["مراجعة واقع الشركة", "مقابلات مع أصحاب العلاقة", "تحديد الفجوات والأولويات", "تقرير توصيات وخطوات تالية"],
        featured: false,
      },
      {
        name: "باقة النمو",
        price: "USD 3,000",
        pricePrefix: "يبدأ من",
        summary: "للشركات التي تريد تحويل فرص النمو إلى خطة تجارية قابلة للتنفيذ.",
        features: ["تحليل فرص السوق والعملاء", "أولويات التسويق والمبيعات", "خطة عمل ومؤشرات قياس", "جلسات مراجعة التقدّم"],
        featured: true,
      },
      {
        name: "التحول المؤسسي",
        price: "عرض سعر مخصص",
        summary: "للمؤسسات التي تحتاج تطويرًا مترابطًا للهيكل والأنظمة والعمليات.",
        features: ["تشخيص الوضع المؤسسي", "إعادة تصميم العمليات والهياكل", "خطة تغيير مرحلية", "تمكين الفريق ومتابعة التنفيذ"],
        featured: false,
      },
    ],
    faq: {
      eyebrow: "قبل الاختيار",
      title: "أسئلة تساعدك على القرار",
      items: [
        { q: "هل يمكن تخصيص الباقة؟", a: "نعم، يُحدَّد نطاق التعاون بحسب احتياج شركتك وطبيعة التحدّي." },
        { q: "هل يشمل التعاون دعم التنفيذ؟", a: "يُوضَّح مستوى الدعم وآلية المتابعة في عرض العمل المتفق عليه." },
        { q: "كيف أختار نقطة البداية؟", a: "ابدأ بجلسة تعريفية لتحديد الحاجة والخيار الأنسب." },
      ],
    },
  },
  en: {
    hero: {
      label: "ENGAGEMENT PACKAGES / 03",
      title: "The right package for your company's stage",
      subtitle: "Clear ways to start — from a focused diagnostic to an institutional transformation program.",
    },
    plans: {
      eyebrow: "Engagement packages",
      title: "A clear scope before you begin",
      subtitle: "Prices are indicative; the final proposal is confirmed once the scope is defined.",
      tag: "Package",
      featuredTag: "Balanced scope for growth",
      note: "Proposed deliverables are subject to the agreed scope.",
      cta: "Request package details",
    },
    from: "From",
    customQuote: "Custom quote",
    fallback: [
      {
        name: "Quick diagnostic",
        price: "1,500 USD",
        summary: "A starting point to understand the challenge and decide what to tackle first.",
        features: ["Company review", "Stakeholder interviews", "Gaps and priorities", "Recommendations and next steps"],
        featured: false,
      },
      {
        name: "Growth package",
        price: "USD 3,000",
        pricePrefix: "From",
        summary: "For companies that want to turn growth opportunities into an actionable commercial plan.",
        features: ["Market and customer opportunity analysis", "Marketing and sales priorities", "Action plan and KPIs", "Progress review sessions"],
        featured: true,
      },
      {
        name: "Institutional transformation",
        price: "Custom quote",
        summary: "For organizations that need connected development of structure, systems and operations.",
        features: ["Organizational diagnostic", "Process and structure redesign", "Phased change plan", "Team enablement and delivery follow-up"],
        featured: false,
      },
    ],
    faq: {
      eyebrow: "Before you choose",
      title: "Questions to help you decide",
      items: [
        { q: "Can a package be customized?", a: "Yes — the scope is set around your company's needs and the nature of the challenge." },
        { q: "Does it include implementation support?", a: "The level of support and follow-up is set out in the agreed proposal." },
        { q: "How do I choose where to start?", a: "Start with an intro session to pin down the need and the best fit." },
      ],
    },
  },
};

const stripTags = (html: string | null) => (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/** Pull bullet items out of a rich-text field (its <li>s, else its lines). */
function listItems(html: string | null, max = 4): string[] {
  if (!html) return [];
  const lis = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => stripTags(m[1]));
  const items = lis.length > 0 ? lis : html.split(/<br\s*\/?>|<\/p>|\n/i).map(stripTags);
  return items.filter(Boolean).slice(0, max);
}

function fromApi(p: Package, i: number, all: Package[], c: PackagesContent): Plan {
  const anyFeatured = all.some((x) => x.is_featured);
  const featured = anyFeatured ? p.is_featured : all.length === 3 && i === 1;
  const amount = p.price ? `${p.price} ${p.currency ?? ""}`.trim() : "";
  return {
    tag: featured ? c.plans.featuredTag : c.plans.tag,
    name: p.name,
    price: p.pricing_type === "custom_quote" || !amount ? c.customQuote : amount,
    pricePrefix: p.pricing_type === "starting_from" && amount ? c.from : undefined,
    summary: stripTags(p.target_audience ?? p.problem_solved),
    features: listItems(p.deliverables ?? p.scope_of_work),
    featured,
    href: `/packages/${p.slug}`,
    cta: c.plans.cta,
  };
}

function PlanCard({ plan, note }: { plan: Plan; note: string }) {
  const f = plan.featured;
  return (
    <div
      className={cn(
        "reveal flex flex-col rounded-[var(--radius-lg)] border p-6 sm:p-7",
        f
          ? "border-accent bg-primary text-white shadow-[0_30px_60px_-30px_rgba(13,20,36,0.9)] dark:bg-ink-2 lg:-my-3 lg:py-10"
          : "border-border bg-bg shadow-[0_10px_30px_-22px_rgba(20,25,36,0.35)]",
      )}
    >
      <p className={cn("text-xs font-semibold", f ? "text-accent" : "text-muted")}>{plan.tag}</p>
      <h3 className={cn("mt-4 text-2xl font-bold", f ? "text-white" : "text-fg")}>{plan.name}</h3>
      <p className={cn("mt-5 text-2xl font-bold sm:text-3xl", f ? "text-accent" : "text-fg")}>
        {plan.pricePrefix ? `${plan.pricePrefix} ` : null}
        <span dir="ltr" className="inline-block">
          {plan.price}
        </span>
      </p>
      {plan.summary ? (
        <p className={cn("mt-4 text-sm", f ? "text-white/70" : "text-muted")}>{plan.summary}</p>
      ) : null}

      {plan.features.length > 0 ? (
        <ul className={cn("mt-6 space-y-3 border-t pt-6 text-sm", f ? "border-white/15" : "border-border")}>
          {plan.features.map((item) => (
            <li key={item} className={cn("flex items-start gap-2", f ? "text-white/90" : "text-fg")}>
              <Check className={cn("mt-1 h-4 w-4 shrink-0", f ? "text-accent" : "text-fg")} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto pt-7">
        <ButtonLink href={plan.href} variant="secondary" className="w-full sm:w-auto">
          {plan.cta}
        </ButtonLink>
        <p className={cn("mt-4 text-xs", f ? "text-white/60" : "text-muted")}>{note}</p>
      </div>
    </div>
  );
}

export default async function PackagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = content[loc] ?? content.ar;
  const rtl = loc === "ar";

  // CMS packages win when the API has them; otherwise show the three core packages.
  const apiPackages = await api.packages(loc);
  const plans: Plan[] =
    apiPackages.length > 0
      ? apiPackages.map((p, i, all) => fromApi(p, i, all, c))
      : c.fallback.map((p) => ({
          ...p,
          tag: p.featured ? c.plans.featuredTag : c.plans.tag,
          href: "/contact",
          cta: c.plans.cta,
        }));

  return (
    <>
      <EditorialHero {...c.hero} />

      {/* Plans */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <EditorialHeading eyebrow={c.plans.eyebrow} title={c.plans.title} subtitle={c.plans.subtitle} />
          <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} note={c.plans.note} />
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <Container>
          <EditorialHeading eyebrow={c.faq.eyebrow} title={c.faq.title} />
          <div className="grid gap-5 md:grid-cols-3">
            {c.faq.items.map((item, i) => (
              <div key={item.q} className={cn("reveal", editorialCard)}>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-semibold text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <ArrowBadge rtl={rtl} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-fg">{item.q}</h3>
                <p className="mt-3 text-sm text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </>
  );
}
