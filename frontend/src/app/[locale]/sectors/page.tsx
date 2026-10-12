import { getTranslations, setRequestLocale } from "next-intl/server";

import { CompassMark } from "@/components/ui/CompassMark";
import { Container } from "@/components/ui/Container";
import { CtaBand, ctaCopy, EditorialHeading, EditorialHero } from "@/components/ui/Editorial";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";
import { cn } from "@/lib/cn";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("sectors") };
}

interface SectorsContent {
  hero: { label: string; title: string; subtitle: string };
  intro: { label: string; titleLines: string[]; body: string; countLabel: string };
  panel: { label: string; title: string; center: string; footer: string };
  sectors: string[];
  process: {
    label: string;
    title: string;
    subtitle: string;
    outputLabel: string;
    steps: { title: string; body: string; output: string }[];
    note: string;
  };
}

const content: Record<Locale, SectorsContent> = {
  ar: {
    hero: {
      label: "SECTOR EXPERTISE / 04",
      title: "حلول تراعي طبيعة قطاعك",
      subtitle: "نربط منهجية الاستشارة بنموذج الأعمال والتحديات التشغيلية لكل قطاع.",
    },
    intro: {
      label: "EXPERTISE, CONNECTED / خبرة مترابطة",
      titleLines: ["خبرة واسعة.", "حلول تعرف قطاعك."],
      body: "من التشغيل إلى التوسع، نبدأ بفهم نشاطك ثم نوجّه الخبرة نحو التحدّي الصحيح.",
      countLabel: "قطاعًا، رؤية واحدة للنمو.",
    },
    panel: {
      label: "01 / EXPLORE",
      title: "قطاعات مختلفة. بوصلة تجمعها.",
      center: "اتجاه واضح لكل مرحلة",
      footer: "نربط المعرفة بالقطاع، والاستراتيجية بالتنفيذ.",
    },
    sectors: [
      "الطاقة والنفط",
      "الصناعة والتصنيع",
      "التجارة والوكالات",
      "النقل والخدمات اللوجستية",
      "التكنولوجيا والاتصالات",
      "المصارف والتمويل",
      "العقارات والإنشاءات",
      "التجزئة والسلع الاستهلاكية",
      "الصحة والخدمات الطبية",
      "التعليم والتدريب",
      "المنظمات التنموية",
      "الضيافة والصناعات الإبداعية",
      "الاستدامة والاقتصاد الأخضر",
      "الشركات الناشئة",
    ],
    process: {
      label: "03 / من الخبرة إلى التطبيق",
      title: "شلون نطوّر قطاعك؟",
      subtitle: "نحوّل فهم القطاع إلى مسار عمل واضح، بمخرجات محددة في كل مرحلة.",
      outputLabel: "المخرج المقترح",
      steps: [
        {
          title: "نشخّص التحدّي",
          body: "نراجع واقع التشغيل والسوق، ونحدّد نقاط التعطّل وفرص التحسين.",
          output: "تقرير تشخيص + فرص التحسين",
        },
        {
          title: "نصمّم الحل",
          body: "نربط احتياجات نشاطك بالأدوار والعمليات والأنظمة المناسبة.",
          output: "تصوّر للحل + خارطة أولويات",
        },
        {
          title: "نرافق التنفيذ",
          body: "نساند الفريق في تطبيق الحل، ونراجع التقدّم ونعدّل الأولويات حسب النتائج.",
          output: "خطة تنفيذ مرحلية + مؤشرات متابعة",
        },
      ],
      note: "يُحدَّد نطاق العمل والمخرجات النهائية بعد جلسة فهم احتياج شركتك.",
    },
  },
  en: {
    hero: {
      label: "SECTOR EXPERTISE / 04",
      title: "Solutions that fit your sector",
      subtitle: "We tie our consulting method to each sector's business model and operational challenges.",
    },
    intro: {
      label: "EXPERTISE, CONNECTED",
      titleLines: ["Broad expertise.", "Solutions that know your sector."],
      body: "From operations to expansion, we start by understanding your business, then aim our expertise at the right challenge.",
      countLabel: "sectors, one vision for growth.",
    },
    panel: {
      label: "01 / EXPLORE",
      title: "Different sectors. One compass.",
      center: "A clear direction for every stage",
      footer: "We connect sector knowledge with strategy, and strategy with execution.",
    },
    sectors: [
      "Energy & oil",
      "Industry & manufacturing",
      "Trade & agencies",
      "Transport & logistics",
      "Technology & telecom",
      "Banking & finance",
      "Real estate & construction",
      "Retail & consumer goods",
      "Healthcare",
      "Education & training",
      "Development organizations",
      "Hospitality & creative industries",
      "Sustainability & green economy",
      "Startups",
    ],
    process: {
      label: "03 / FROM EXPERTISE TO PRACTICE",
      title: "How do we develop your sector?",
      subtitle: "We turn sector understanding into a clear path of work, with defined outputs at every stage.",
      outputLabel: "Proposed output",
      steps: [
        {
          title: "We diagnose the challenge",
          body: "We review operations and the market, and pinpoint bottlenecks and improvement opportunities.",
          output: "Diagnostic report + opportunities",
        },
        {
          title: "We design the solution",
          body: "We match your business needs with the right roles, processes and systems.",
          output: "Solution concept + priority roadmap",
        },
        {
          title: "We support execution",
          body: "We help the team apply the solution, review progress and adjust priorities based on results.",
          output: "Phased delivery plan + tracking indicators",
        },
      ],
      note: "Final scope and deliverables are set after a session to understand your company's needs.",
    },
  },
};

interface SectorItem {
  name: string;
  href: string;
}

const num = (i: number) => String(i + 1).padStart(2, "0");

/** One row in the side columns of the explore panel. */
function SectorRow({ item, index, active }: { item: SectorItem; index: number; active: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2 border-b py-3 text-sm font-bold transition-colors hover:border-accent hover:text-accent",
          active ? "border-accent text-accent" : "border-white/10 text-white",
        )}
      >
        <span>{item.name}</span>
        <span className="text-white/40">/</span>
        <span className="font-sans">{num(index)}</span>
      </Link>
    </li>
  );
}

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = content[loc] ?? content.ar;
  const rtl = loc === "ar";

  // CMS sectors win when the API has them; otherwise list the core fourteen.
  const apiSectors = await api.sectors(loc);
  const sectors: SectorItem[] =
    apiSectors.length > 0
      ? apiSectors.map((s) => ({ name: s.name, href: `/sectors/${s.slug}` }))
      : c.sectors.map((name) => ({ name, href: "/contact" }));

  const startCol = sectors.slice(0, 5);
  const endCol = sectors.slice(5, 10);
  const bottom = sectors.slice(10);

  return (
    <>
      <EditorialHero {...c.hero} />

      {/* Intro + count */}
      <section className="bg-surface pb-12 pt-16 sm:pt-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="reveal">
              <p className="mb-4 text-[0.7rem] font-semibold tracking-wider text-accent-hover">{c.intro.label}</p>
              <h2 className="display-heading text-4xl text-fg sm:text-5xl sm:leading-tight">
                {c.intro.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-6 text-muted">{c.intro.body}</p>
            </div>
            <div className="reveal text-center lg:px-10">
              <p className="font-sans text-8xl font-extrabold leading-none text-accent sm:text-9xl">{sectors.length}</p>
              <p className="mt-4 text-sm text-muted">{c.intro.countLabel}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Explore panel */}
      <section className="bg-surface pb-16 sm:pb-24">
        <Container>
          <div className="reveal overflow-hidden rounded-[var(--radius-lg)] bg-primary p-6 text-white dark:bg-ink-2 sm:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-6">
              <h2 className="display-heading text-2xl sm:text-3xl">{c.panel.title}</h2>
              <p className="font-sans text-[0.65rem] font-semibold text-accent">{c.panel.label}</p>
            </div>

            <div className="grid items-center gap-x-10 py-8 lg:grid-cols-[1fr_auto_1fr]">
              <ul>
                {startCol.map((s, i) => (
                  <SectorRow key={s.href + s.name} item={s} index={i} active={i === 0} />
                ))}
              </ul>
              <div className="hidden flex-col items-center lg:flex">
                <CompassMark showNeedle className="h-64 w-64 text-accent/30" />
                <p className="mt-4 text-xs text-accent">{c.panel.center}</p>
              </div>
              <ul>
                {endCol.map((s, i) => (
                  <SectorRow key={s.href + s.name} item={s} index={i + 5} active={false} />
                ))}
              </ul>
            </div>

            {bottom.length > 0 ? (
              <ul className="grid gap-6 border-b border-white/10 pb-8 sm:grid-cols-2 lg:grid-cols-4">
                {bottom.map((s, i) => (
                  <li key={s.href + s.name}>
                    <Link href={s.href} className="group block">
                      <span className="block font-sans text-[0.65rem] font-semibold text-accent">{num(i + 10)}</span>
                      <span className="mt-1 block text-sm font-bold transition-colors group-hover:text-accent">
                        {s.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-6 text-xs text-white/60">{c.panel.footer}</p>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-24">
        <Container>
          <EditorialHeading
            eyebrow={c.process.label}
            title={c.process.title}
            subtitle={c.process.subtitle}
          />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-6">
            {c.process.steps.map((step, i) => (
              <li key={step.title} className="reveal flex flex-col">
                <span className="block font-sans text-6xl font-extrabold leading-none text-accent sm:text-7xl">
                  {num(i)}
                </span>
                <div className="mt-6 h-px bg-accent/60" aria-hidden />
                <h3 className="mt-5 text-2xl font-bold text-fg">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
                <div className="mt-auto pt-5">
                  <div className="rounded-[var(--radius)] bg-surface-2 p-4">
                    <p className="text-[0.7rem] font-semibold text-accent-hover">{c.process.outputLabel}</p>
                    <p className="mt-1 text-sm font-bold text-fg">{step.output}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xs text-muted">{c.process.note}</p>
        </Container>
      </section>

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </>
  );
}
