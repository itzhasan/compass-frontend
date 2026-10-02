import { getTranslations } from "next-intl/server";

import { CompassMark } from "@/components/ui/CompassMark";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import type { Settings } from "@/lib/api/types";

/** Site footer: quick links, legal, contact, socials, newsletter slot + placeholder notice. */
export async function Footer({ brand, settings }: { brand: string; settings: Settings }) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const year = new Date().getFullYear();

  const quickLinks = [
    { key: "services", href: "/services" },
    { key: "packages", href: "/packages" },
    { key: "sectors", href: "/sectors" },
    { key: "insights", href: "/insights" },
    { key: "ecosystem", href: "/ecosystem" },
  ] as const;

  return (
    <footer data-theme="dark" className="mt-auto border-t border-border bg-bg text-fg">
      {/* Thin geometric divider band (subtle brand motif). */}
      <div
        aria-hidden
        className="h-1 w-full opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-accent) 0 2px, transparent 2px 10px)",
        }}
      />
      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 text-lg font-bold text-fg">
              <CompassMark className="h-7 w-7 text-accent" />
              {brand}
            </p>
            <p className="mt-3 text-sm text-muted">{t("tagline")}</p>
          </div>

          <nav aria-label={t("quickLinks")}>
            <h2 className="mb-3 text-sm font-semibold text-fg">{t("quickLinks")}</h2>
            <ul className="space-y-2 text-sm text-muted">
              {quickLinks.map((l) => (
                <li key={l.key}>
                  <Link href={l.href} className="hover:text-fg">
                    {nav(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("legal")}>
            <h2 className="mb-3 text-sm font-semibold text-fg">{t("legal")}</h2>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/privacy" className="hover:text-fg">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-fg">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-fg">{t("contact")}</h2>
            <ul className="space-y-2 text-sm text-muted">
              {settings.contact.email ? (
                <li>
                  <a href={`mailto:${settings.contact.email}`} className="hover:text-fg">
                    {settings.contact.email}
                  </a>
                </li>
              ) : null}
              {settings.contact.phones.map((p) => (
                <li key={p.number} dir="ltr">
                  <a href={`tel:${p.number.replace(/\s/g, "")}`} className="hover:text-fg">
                    {p.number}
                  </a>
                </li>
              ))}
            </ul>
            {settings.socials.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-3 text-sm">
                {settings.socials.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.url}
                      rel="noopener noreferrer"
                      className="capitalize text-muted hover:text-fg"
                    >
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand}. {t("rights")}
          </p>
          <p className="opacity-80">{t("placeholderNotice")}</p>
        </div>
      </Container>
    </footer>
  );
}
