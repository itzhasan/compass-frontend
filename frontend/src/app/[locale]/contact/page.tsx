import { getTranslations, setRequestLocale } from "next-intl/server";

import { DynamicForm } from "@/components/forms/DynamicForm";
import { Container } from "@/components/ui/Container";
import { EditorialHero } from "@/components/ui/Editorial";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("contact") };
}

const content = {
  ar: {
    hero: {
      label: "CONTACT COMPASS / 09",
      title: "لنحدّد اتجاه شركتك القادم",
      subtitle: "أخبرنا عن احتياجك؛ لنبدأ حوارًا حول نطاق التعاون المناسب.",
    },
    form: {
      title: "احجز استشارة",
      required: "الحقول المعلّمة بنجمة مطلوبة.",
      submit: "أرسل طلب الاستشارة",
      footnote: "بإرسال الطلب، توافق على التواصل معك بشأن الاستشارة.",
      unavailable: "تعذّر تحميل النموذج حاليًا. راسلنا مباشرة عبر البريد أو الهاتف.",
      placeholders: {
        name: "اكتب اسمك الكامل",
        company: "اسم مؤسستك",
        email: "name@company.com",
        phone: "+964 …",
        subject: "موضوع رسالتك",
        service: "اختر الخدمة أو اترك لنا تحديد الأنسب",
        sector: "قطاع عمل شركتك",
        message: "صف باختصار ما ترغب في تطويره داخل شركتك.",
        challenge: "صف باختصار ما ترغب في تطويره داخل شركتك.",
      },
    },
    direct: {
      title: "تواصل مباشرة",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      location: "الموقع",
      note: "نناقش موعد وآلية اللقاء عند التواصل.",
    },
    fallback: { email: "ceo@compass-iraq.net", phones: ["+964 785 339 9333", "+964 771 220 6847"], address: "بغداد، العراق" },
  },
  en: {
    hero: {
      label: "CONTACT COMPASS / 09",
      title: "Let's set your company's next direction",
      subtitle: "Tell us what you need, and let's start a conversation about the right scope.",
    },
    form: {
      title: "Book a consultation",
      required: "Fields marked with an asterisk are required.",
      submit: "Send consultation request",
      footnote: "By sending this request, you agree to be contacted about the consultation.",
      unavailable: "The form couldn't be loaded right now. Reach us directly by email or phone.",
      placeholders: {
        name: "Your full name",
        company: "Your organization",
        email: "name@company.com",
        phone: "+964 …",
        subject: "What's this about?",
        service: "Choose a service, or let us suggest the best fit",
        sector: "Your company's sector",
        message: "Briefly describe what you'd like to develop in your company.",
        challenge: "Briefly describe what you'd like to develop in your company.",
      },
    },
    direct: {
      title: "Contact us directly",
      email: "Email",
      phone: "Phone",
      location: "Location",
      note: "We'll agree on a meeting time and format when we talk.",
    },
    fallback: { email: "ceo@compass-iraq.net", phones: ["+964 785 339 9333", "+964 771 220 6847"], address: "Baghdad, Iraq" },
  },
} as const;

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = content[loc] ?? content.ar;

  // Contact details have a static fallback so the page stays useful if the API is down.
  const [form, settings] = await Promise.all([
    api.form(loc, "contact").catch(() => null),
    api.settings(loc).catch(() => null),
  ]);

  const email = settings?.contact.email || c.fallback.email;
  const phones = settings?.contact.phones.length
    ? settings.contact.phones.map((p) => p.number)
    : [...c.fallback.phones];
  const address = settings?.contact.address || c.fallback.address;

  return (
    <>
      <EditorialHero {...c.hero} />

      <section className="bg-surface py-16 sm:py-24">
        <Container className="grid items-start gap-8 lg:grid-cols-[1fr_minmax(0,27rem)] lg:gap-12">
          {/* Form */}
          <div className="reveal rounded-[var(--radius-lg)] border border-border bg-bg p-6 sm:p-8">
            <h2 className="display-heading text-3xl text-fg">{c.form.title}</h2>
            <p className="mb-8 mt-4 text-sm text-muted">{c.form.required}</p>
            {form ? (
              <DynamicForm
                schema={form}
                placeholders={c.form.placeholders}
                submitLabel={c.form.submit}
                footnote={c.form.footnote}
              />
            ) : (
              <p className="rounded-[var(--radius)] bg-surface p-4 text-sm text-muted">{c.form.unavailable}</p>
            )}
          </div>

          {/* Direct contact */}
          <aside className="reveal rounded-[var(--radius-lg)] bg-primary p-6 text-white dark:bg-ink-2 sm:p-8">
            <h2 className="display-heading text-3xl">{c.direct.title}</h2>

            <div className="mt-8 border-b border-white/10 pb-6">
              <p className="text-xs font-semibold text-accent">{c.direct.email}</p>
              <a href={`mailto:${email}`} dir="ltr" className="mt-4 block hover:text-accent">
                {email}
              </a>
            </div>

            <div className="border-b border-white/10 py-6">
              <p className="text-xs font-semibold text-accent">{c.direct.phone}</p>
              <ul className="mt-4 space-y-1 text-lg">
                {phones.map((p) => (
                  <li key={p}>
                    <a href={`tel:${p.replace(/\s/g, "")}`} dir="ltr" className="block text-end hover:text-accent ltr:text-start">
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <p className="text-xs font-semibold text-accent">{c.direct.location}</p>
              <p className="mt-4 text-xl font-bold">{address}</p>
              <p className="mt-4 text-sm text-white/60">{c.direct.note}</p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
