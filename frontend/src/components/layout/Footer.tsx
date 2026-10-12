import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import type { Settings } from "@/lib/api/types";

const EXPLORE = [
  { key: "services", href: "/services" },
  { key: "packages", href: "/packages" },
  { key: "sectors", href: "/sectors" },
  { key: "ecosystem", href: "/ecosystem" },
] as const;

const KNOWLEDGE = [
  { key: "articles", href: "/insights" },
  { key: "news", href: "/news" },
  { key: "caseStudies", href: "/case-studies" },
] as const;

const linkClass = "text-white/60 transition-colors hover:text-accent";

/** Site footer: brand + tagline, two link columns, contact details and a legal row. */
export async function Footer({ brand, settings }: { brand: string; settings: Settings }) {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();
  const location = settings.contact.address || t("location");

  return (
    <footer className="mt-auto bg-[#0b1422] text-white">
      <Container className="pb-12 pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-16">
          <div>
            <p className="display-heading text-3xl">{brand}</p>
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-white/60">{t("tagline")}</p>
          </div>

          <nav aria-label={t("explore")}>
            <h2 className="mb-4 font-bold">{t("explore")}</h2>
            <ul className="space-y-1.5 text-sm">
              {EXPLORE.map((l) => (
                <li key={l.key}>
                  <Link href={l.href} className={linkClass}>
                    {t(`links.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("knowledge")}>
            <h2 className="mb-4 font-bold">{t("knowledge")}</h2>
            <ul className="space-y-2.5 text-sm">
              {KNOWLEDGE.map((l) => (
                <li key={l.key}>
                  <Link href={l.href} className={linkClass}>
                    {t(`links.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 font-bold">{t("contactUs")}</h2>
            <ul className="space-y-1.5 text-sm">
              {settings.contact.email ? (
                <li>
                  <a href={`mailto:${settings.contact.email}`} className={linkClass}>
                    {settings.contact.email}
                  </a>
                </li>
              ) : null}
              {settings.contact.phones.map((p) => (
                <li key={p.number}>
                  <a href={`tel:${p.number.replace(/\s/g, "")}`} dir="ltr" className={linkClass}>
                    {p.number}
                  </a>
                </li>
              ))}
              <li className="text-white/60">{location}</li>
            </ul>
            {settings.socials.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-3 text-sm">
                {settings.socials.map((s) => (
                  <li key={s.platform}>
                    <a href={s.url} rel="noopener noreferrer" className={`capitalize ${linkClass}`}>
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 text-xs text-white/50 sm:flex-row sm:items-center sm:gap-16">
          <p>
            © {year} {brand} · {location}
          </p>
          <p className="flex items-center gap-2">
            <Link href="/privacy" className="hover:text-accent">
              {t("privacy")}
            </Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="hover:text-accent">
              {t("terms")}
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
