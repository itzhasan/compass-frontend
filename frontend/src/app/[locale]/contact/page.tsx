import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DynamicForm } from "@/components/forms/DynamicForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api/client";
import type { Locale } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("contact") };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [form, settings, t] = await Promise.all([
    api.form(loc, "contact"),
    api.settings(loc),
    getTranslations("nav"),
  ]);

  return (
    <>
      <PageHeader
        title={t("contact")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("contact") }]} />}
      />
      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_320px]">
        <div>{form ? <DynamicForm schema={form} /> : null}</div>
        <aside className="space-y-4 text-sm">
          {settings.contact.email ? (
            <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-3 text-fg hover:text-primary">
              <Mail className="h-5 w-5 text-accent" aria-hidden /> {settings.contact.email}
            </a>
          ) : null}
          {settings.contact.phones.map((p) => (
            <a
              key={p.number}
              href={`tel:${p.number.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-fg hover:text-primary"
              dir="ltr"
            >
              <Phone className="h-5 w-5 text-accent" aria-hidden /> {p.number}
            </a>
          ))}
          {settings.contact.address ? (
            <p className="flex items-start gap-3 text-muted">
              <MapPin className="h-5 w-5 shrink-0 text-accent" aria-hidden /> {settings.contact.address}
            </p>
          ) : null}
          <div className="mt-4 aspect-video w-full rounded-[var(--radius)] border border-dashed border-border bg-surface" aria-hidden />
        </aside>
      </Container>
    </>
  );
}
