import { getTranslations, setRequestLocale } from "next-intl/server";

import { CoverImage } from "@/components/CoverImage";
import { CompassMark } from "@/components/ui/CompassMark";
import { Container } from "@/components/ui/Container";
import {
  ArrowBadge,
  CtaBand,
  ctaCopy,
  EditorialHeading,
  EditorialHero,
  editorialCard as cardClass,
  Eyebrow,
} from "@/components/ui/Editorial";
import { api } from "@/lib/api/client";
import type { Locale, TeamMember } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("about") };
}

interface AboutContent {
  hero: { label: string; title: string; subtitle: string };
  intro: { eyebrow: string; title: string; paragraphs: string[] };
  highlight: { eyebrow: string; title: string; body: string };
  pillars: string[];
  values: { eyebrow: string; title: string; items: { title: string; body: string }[] };
  founders: { eyebrow: string; title: string; items: { name: string; department: string; role: string }[] };
  team: { eyebrow: string; title: string };
}

const content: Record<Locale, AboutContent> = {
  ar: {
    hero: {
      label: "ABOUT COMPASS / 01",
      title: "معرفة محلية. رؤية أبعد.",
      subtitle: "نتعاون مع القيادات لصياغة اتجاه واضح، وبناء مؤسسة قادرة على تنفيذ خطتها.",
    },
    intro: {
      eyebrow: "من نحن",
      title: "شريك في رحلة التطوير",
      paragraphs: [
        "البوصلة شركة عراقية للاستشارات الإدارية والتجارية مقرّها بغداد. تجمع بين فهم بيئة الأعمال المحلية ومنهجيات التحليل والتخطيط والتطوير المؤسسي.",
        "مهمتنا تمكين الشركات من التأسيس السليم والنمو المستدام؛ عبر أنظمة تجارية واضحة، وهياكل تنظيمية تدعم التوسع، وقرارات مبنية على البيانات.",
      ],
    },
    highlight: {
      eyebrow: "بوصلتنا",
      title: "قيمة ملموسة بعد كل توصية.",
      body: "حلول تراعي السياق العراقي، وتبني قدرة الفريق على الاستمرار.",
    },
    pillars: ["مرافقة أثناء التنفيذ", "معرفة بالسوق العراقي", "أثر قابل للقياس"],
    values: {
      eyebrow: "قيم العمل",
      title: "ما يمكنك توقّعه من التعاون معنا",
      items: [
        { title: "وضوح", body: "نطاق محدد وأولويات متفق عليها ومسؤوليات واضحة." },
        { title: "تعاون", body: "نعمل مع فريقك، ونشارك المعرفة طوال المشروع." },
        { title: "متابعة", body: "مؤشرات قابلة للمراجعة تساعد على تقييم التقدّم." },
      ],
    },
    founders: {
      eyebrow: "القيادة",
      title: "المؤسسون",
      items: [
        { name: "د. ضياء قدو", department: "الاقتصاد والمالية", role: "الشريك المؤسس للاستشارات الاقتصادية والمالية." },
        { name: "قيصر الوردي", department: "الإدارة التنفيذية", role: "المؤسس والرئيس التنفيذي لشركة البوصلة." },
      ],
    },
    team: { eyebrow: "الفريق", title: "مستشارونا" },
  },
  en: {
    hero: {
      label: "ABOUT COMPASS / 01",
      title: "Local knowledge. A wider view.",
      subtitle: "We work with leadership to set a clear direction and build an organization able to deliver on its plan.",
    },
    intro: {
      eyebrow: "Who we are",
      title: "A partner on the path to growth",
      paragraphs: [
        "Compass is an Iraqi management and business consultancy based in Baghdad. We combine a deep understanding of the local business environment with proven methods for analysis, planning and organizational development.",
        "Our mission is to help companies build sound foundations and grow sustainably — through clear commercial systems, organizational structures that support expansion, and data-driven decisions.",
      ],
    },
    highlight: {
      eyebrow: "Our compass",
      title: "Tangible value after every recommendation.",
      body: "Solutions that fit the Iraqi context and build your team's ability to carry on.",
    },
    pillars: ["Support through execution", "Knowledge of the Iraqi market", "Measurable impact"],
    values: {
      eyebrow: "How we work",
      title: "What to expect when working with us",
      items: [
        { title: "Clarity", body: "A defined scope, agreed priorities and clear responsibilities." },
        { title: "Collaboration", body: "We work alongside your team and share knowledge throughout." },
        { title: "Follow-through", body: "Reviewable indicators that help you assess progress." },
      ],
    },
    founders: {
      eyebrow: "Leadership",
      title: "The founders",
      items: [
        { name: "Qaisar Al-Wardi", department: "Executive management", role: "Founder & CEO of Compass." },
        { name: "Dr. Dhiaa Qaddu", department: "Economics & finance", role: "Co-founder for economic & financial consulting." },
      ],
    },
    team: { eyebrow: "Our team", title: "Our consultants" },
  },
};

function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((m) => (
        <div key={m.id} className={`${cardClass} text-center`}>
          <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-surface-2">
            <CoverImage src={m.photo} alt={m.name} sizes="96px" />
          </div>
          <p className="font-bold text-fg">{m.name}</p>
          {m.title ? <p className="mt-1 text-sm text-muted">{m.title}</p> : null}
        </div>
      ))}
    </div>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = content[loc] ?? content.ar;
  const rtl = loc === "ar";

  // Founders are fixed copy; the CMS team only feeds the consultants grid.
  const team = await api.team(loc);
  const consultants = team.filter((m) => !m.is_founder);
  const founders = c.founders.items;

  return (
    <>
      <EditorialHero {...c.hero} />

      {/* Who we are */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <div className="reveal">
              <Eyebrow>{c.intro.eyebrow}</Eyebrow>
              <h2 className="display-heading text-3xl text-fg sm:text-4xl">{c.intro.title}</h2>
              <div className="mt-6 space-y-4 text-muted">
                {c.intro.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            <div className="reveal relative overflow-hidden rounded-[var(--radius-lg)] bg-primary p-8 text-white shadow-[0_24px_50px_-28px_rgba(13,20,36,0.8)] dark:bg-ink-2 sm:p-10">
              <CompassMark className="pointer-events-none absolute -bottom-20 -end-20 h-64 w-64 text-white/[0.05]" />
              <p className="relative text-xs font-semibold text-accent">{c.highlight.eyebrow}</p>
              <p className="display-heading relative mt-4 text-3xl leading-snug sm:text-4xl sm:leading-snug">
                {c.highlight.title}
              </p>
              <p className="relative mt-5 text-sm text-white/70">{c.highlight.body}</p>
            </div>
          </div>

          <ul className="reveal mt-12 grid gap-3 rounded-[var(--radius)] bg-surface-2 p-5 sm:grid-cols-3 sm:gap-6 sm:px-6">
            {c.pillars.map((p) => (
              <li key={p} className="flex items-center gap-3 font-bold text-accent-hover sm:justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24">
        <Container>
          <EditorialHeading eyebrow={c.values.eyebrow} title={c.values.title} />
          <div className="grid gap-5 md:grid-cols-3">
            {c.values.items.map((v, i) => (
              <div key={v.title} className={`reveal ${cardClass}`}>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-semibold text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowBadge rtl={rtl} />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-fg">{v.title}</h3>
                <p className="mt-3 text-sm text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Founders */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <EditorialHeading eyebrow={c.founders.eyebrow} title={c.founders.title} />
          <div className="grid gap-5 md:grid-cols-2">
            {founders.map((f) => (
              <div key={f.name} className={`reveal ${cardClass}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-muted">{f.department}</span>
                  <ArrowBadge rtl={rtl} />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-fg">{f.name}</h3>
                {f.role ? <p className="mt-3 text-sm text-muted">{f.role}</p> : null}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Consultants (from the CMS, when present) */}
      {consultants.length > 0 ? (
        <section className="py-16 sm:py-24">
          <Container>
            <EditorialHeading eyebrow={c.team.eyebrow} title={c.team.title} />
            <TeamGrid members={consultants} />
          </Container>
        </section>
      ) : null}

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </>
  );
}
