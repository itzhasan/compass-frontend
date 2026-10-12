import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

import { CoverImage } from "@/components/CoverImage";
import { Container } from "@/components/ui/Container";
import { CtaBand, ctaCopy, EditorialHeading, EditorialHero } from "@/components/ui/Editorial";
import { ImagePlaceholder, MediaTile, mediaTileClass } from "@/components/ui/MediaTile";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("caseStudies") };
}

interface ReferenceCase {
  category: string;
  title: string;
  parties: string;
  lesson: string;
  href: string;
  /** Optional illustrative photo under /public (e.g. "/case-studies/undp.jpg"). */
  image?: string;
}

interface CaseStudiesContent {
  hero: { label: string; title: string; subtitle: string };
  reference: {
    title: string;
    subtitle: string;
    lessonPrefix: string;
    cta: string;
    note: string;
    imageNote: string;
    cases: ReferenceCase[];
  };
  own: { eyebrow: string; title: string; cta: string };
}

const content: Record<Locale, CaseStudiesContent> = {
  ar: {
    hero: {
      label: "REFERENCE CASES / 08",
      title: "أمثلة حقيقية. دروس قابلة للتطبيق.",
      subtitle: "حالات مرجعية من العراق، منشورة لدى جهاتها الأصلية؛ وليست مشاريع منفّذة من البوصلة.",
    },
    reference: {
      title: "حالات تستحق الاطلاع",
      subtitle: "أمثلة مرجعية من بيئة الأعمال العراقية، وليست مشاريع منفّذة من البوصلة.",
      lessonPrefix: "الدرس المستفاد:",
      cta: "اطّلع على التفاصيل",
      note: "تفاصيل كل حالة متاحة عبر مصدرها الأصلي.",
      imageNote: "الصور تعبيرية للتصميم؛",
      cases: [
        {
          category: "التنمية المؤسسية",
          title: "التنمية وبناء القدرات",
          parties: "التقرير السنوي 2025 / UNDP Iraq",
          lesson: "تكامل البرامج يدعم أثرًا مستدامًا.",
          href: "https://www.undp.org/iraq",
        },
        {
          category: "البيانات وريادة الأعمال",
          title: "بيانات محلية لقرارات أفضل",
          parties: "iDATA × KAPITA × UNDP",
          lesson: "البيانات القابلة للوصول تدعم فهم السوق.",
          href: "https://www.undp.org/iraq",
        },
        {
          category: "التمويل المستدام",
          title: "خارطة طريق للتمويل المستدام",
          parties: "IFC × البنك المركزي العراقي",
          lesson: "ربط الاستراتيجية بأطر تنفيذ وحوكمة واضحة.",
          href: "https://www.ifc.org",
        },
      ],
    },
    own: { eyebrow: "من البوصلة", title: "حالات من عملنا", cta: "اطّلع على الحالة" },
  },
  en: {
    hero: {
      label: "REFERENCE CASES / 08",
      title: "Real examples. Lessons you can apply.",
      subtitle: "Reference cases from Iraq, published by their original organizations — not projects delivered by Compass.",
    },
    reference: {
      title: "Cases worth reading",
      subtitle: "Reference examples from Iraq's business environment, not projects delivered by Compass.",
      lessonPrefix: "Lesson learned:",
      cta: "See the details",
      note: "Full details of each case are available at its original source.",
      imageNote: "Images are illustrative;",
      cases: [
        {
          category: "Institutional development",
          title: "Development and capacity building",
          parties: "2025 annual report / UNDP Iraq",
          lesson: "Integrated programs support lasting impact.",
          href: "https://www.undp.org/iraq",
        },
        {
          category: "Data & entrepreneurship",
          title: "Local data for better decisions",
          parties: "iDATA × KAPITA × UNDP",
          lesson: "Accessible data supports market understanding.",
          href: "https://www.undp.org/iraq",
        },
        {
          category: "Sustainable finance",
          title: "A roadmap for sustainable finance",
          parties: "IFC × Central Bank of Iraq",
          lesson: "Tie strategy to clear delivery and governance frameworks.",
          href: "https://www.ifc.org",
        },
      ],
    },
    own: { eyebrow: "From Compass", title: "Cases from our work", cta: "Read the case" },
  },
};

export default async function CaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = content[loc] ?? content.ar;
  const rtl = loc === "ar";

  // Reference cases are static, so keep the page up even if the API is down.
  const caseStudies = await api.caseStudies(loc).catch(() => []);
  const anyImage = c.reference.cases.some((r) => r.image);

  return (
    <>
      <EditorialHero {...c.hero} />

      {/* Reference cases */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <EditorialHeading title={c.reference.title} subtitle={c.reference.subtitle} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {c.reference.cases.map((r) => (
              <a key={r.title} href={r.href} target="_blank" rel="noopener noreferrer" className={mediaTileClass}>
                <MediaTile
                  media={
                    r.image ? (
                      <Image src={r.image} alt="" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                    ) : (
                      <ImagePlaceholder />
                    )
                  }
                  category={r.category}
                  title={r.title}
                  meta={r.parties}
                  body={`${c.reference.lessonPrefix} ${r.lesson}`}
                  cta={c.reference.cta}
                  rtl={rtl}
                />
              </a>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted">
            {anyImage ? `${c.reference.imageNote} ` : null}
            {c.reference.note}
          </p>
        </Container>
      </section>

      {/* Compass case studies from the CMS, when present */}
      {caseStudies.length > 0 ? (
        <section className="py-16 sm:py-24">
          <Container>
            <EditorialHeading eyebrow={c.own.eyebrow} title={c.own.title} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {caseStudies.map((cs) => (
                <Link key={cs.id} href={`/case-studies/${cs.slug}`} className={mediaTileClass}>
                  <MediaTile
                    media={cs.cover ? <CoverImage src={cs.cover} alt={cs.title} /> : <ImagePlaceholder />}
                    category={cs.sector?.name ?? ""}
                    title={cs.title}
                    meta={cs.client_name ?? ""}
                    cta={c.own.cta}
                    rtl={rtl}
                  />
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand rtl={rtl} {...ctaCopy[loc]} />
    </>
  );
}
