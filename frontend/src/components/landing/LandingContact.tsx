"use client";

import { Globe, Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { LandingContent } from "./content";

function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}

/* Brand glyphs — lucide (this build) ships no social brand icons. */
function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h2.5l.5-3H14V9.5c0-.3.2-.5.5-.5z" />
    </svg>
  );
}
function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 7.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88zM5 9h4v11H5zM11 9h3.8v1.5h.05c.53-1 1.82-2.05 3.75-2.05C22.3 8.45 23 10.9 23 14.08V20h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V20h-4z" />
    </svg>
  );
}

/** Contact + footer — mirrors the reference's CONTACT section: details and
 * socials alongside a consultation form, over a large brand watermark. */
export function LandingContact({
  contact,
  brand,
}: {
  contact: LandingContent["contact"];
  brand: string;
}) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`${contact.label}: ${form.name}`);
    const body = encodeURIComponent(`${form.name} <${form.email}>\n\n${form.message}`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const socials = [
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Facebook, href: "#", label: "Facebook" },
    { Icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <section id="contact" className="relative isolate overflow-hidden border-t border-border pt-20 sm:pt-28">
      {/* Brand watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-6 select-none text-center text-[22vw] font-extrabold leading-none text-white/[0.03]"
      >
        {brand}
      </span>

      <Container className="relative grid gap-12 lg:grid-cols-2">
        {/* Details */}
        <div className="order-1 lg:border-s lg:border-border lg:ps-12">
          <p className="section-label mb-4">{`${contact.label} — ${contact.index}`}</p>
          <h2 className="display-heading text-3xl text-fg sm:text-4xl">{contact.title}</h2>
          <p className="mt-4 max-w-md text-lg text-muted">{contact.subtitle}</p>

          <div className="mt-8 space-y-4">
            {contact.phones.map((phone) => (
              <div key={phone} className="flex items-center justify-end gap-3">
                <a
                  href={waLink(phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                  {contact.whatsapp}
                </a>
                <span dir="ltr" className="text-fg">{phone}</span>
                <Phone className="h-5 w-5 shrink-0 text-accent" aria-hidden />
              </div>
            ))}
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center justify-end gap-3 text-fg transition-colors hover:text-accent"
            >
              <span dir="ltr">{contact.email}</span>
              <Mail className="h-5 w-5 shrink-0 text-accent" aria-hidden />
            </a>
            <a
              href={`https://${contact.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-end gap-3 text-fg transition-colors hover:text-accent"
            >
              <span dir="ltr">{contact.website}</span>
              <Globe className="h-5 w-5 shrink-0 text-accent" aria-hidden />
            </a>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="order-2 rounded-[var(--radius-lg)] border border-border bg-white/[0.02] p-6 sm:p-8">
          <label className="block">
            <span className="mb-2 block text-sm text-muted">{contact.form.name}</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={contact.form.namePlaceholder}
              className="h-12 w-full rounded-[var(--radius)] border border-border bg-[var(--color-ink-2)] px-4 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
            />
          </label>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm text-muted">{contact.form.email}</span>
            <input
              required
              type="email"
              dir="ltr"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={contact.form.emailPlaceholder}
              className="h-12 w-full rounded-[var(--radius)] border border-border bg-[var(--color-ink-2)] px-4 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
            />
          </label>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm text-muted">{contact.form.message}</span>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={contact.form.messagePlaceholder}
              className="w-full rounded-[var(--radius)] border border-border bg-[var(--color-ink-2)] px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
            />
          </label>
          <Button type="submit" variant="secondary" size="lg" className="mt-6 w-full">
            {contact.form.submit}
          </Button>
          {sent ? <p className="mt-3 text-center text-sm text-accent">{contact.form.sent}</p> : null}
        </form>
      </Container>

      <div className="relative mt-16 border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted sm:flex-row">
          <span className="section-label">{contact.tagline}</span>
          <span>{contact.copyright}</span>
        </Container>
      </div>
    </section>
  );
}
