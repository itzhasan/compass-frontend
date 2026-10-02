"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { CompassLogo } from "@/components/ui/CompassLogo";
import { cn } from "@/lib/cn";

import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavItem {
  key: string;
  href: string;
  children?: { key: string; href: string }[];
}

const NAV: NavItem[] = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "packages", href: "/packages" },
  { key: "sectors", href: "/sectors" },
  {
    key: "insights",
    href: "/insights",
    children: [
      { key: "articles", href: "/insights" },
      { key: "news", href: "/news" },
      { key: "caseStudies", href: "/case-studies" },
    ],
  },
  { key: "ecosystem", href: "/ecosystem" },
  { key: "partner", href: "/partner-sponsorship" },
  { key: "contact", href: "/contact" },
];

export function Header({ brand }: { brand: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent with light text over the dark hero/header band; solid light bar once scrolled.
  const solid = scrolled || drawerOpen;
  const navLink = solid ? "text-fg hover:bg-surface" : "text-white/90 hover:bg-white/10";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        solid
          ? "border-b border-border bg-bg/90 backdrop-blur"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 text-lg font-bold transition-colors",
            solid ? "text-fg" : "text-white",
          )}
          onClick={() => setDrawerOpen(false)}
        >
          <CompassLogo className="h-7 w-7 text-accent" />
          {brand}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.key} className="group relative">
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors",
                    navLink,
                  )}
                  aria-haspopup="true"
                >
                  {t(item.key)}
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" aria-hidden />
                </button>
                <div className="invisible absolute start-0 top-full min-w-48 rounded-[var(--radius)] border border-border bg-bg p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href}
                      className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm text-fg hover:bg-surface"
                    >
                      {t(child.key)}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors",
                  navLink,
                  pathname === item.href && "text-accent",
                )}
              >
                {t(item.key)}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher className={solid ? undefined : "text-white/90 hover:bg-white/10"} />
          <ButtonLink href="/book-consultation" size="sm" variant="secondary">
            {t("bookConsultation")}
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className={cn("rounded-[var(--radius-sm)] p-2 transition-colors lg:hidden", navLink)}
          onClick={() => setDrawerOpen((o) => !o)}
          aria-expanded={drawerOpen}
          aria-label={drawerOpen ? t("close") : t("menu")}
        >
          {drawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="border-t border-border bg-bg lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {NAV.map((item) => (
              <div key={item.key}>
                <Link
                  href={item.href}
                  className="block rounded-[var(--radius-sm)] px-3 py-2 font-medium text-fg hover:bg-surface"
                  onClick={() => setDrawerOpen(false)}
                >
                  {t(item.key)}
                </Link>
                {item.children ? (
                  <div className="ms-4 flex flex-col">
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm text-muted hover:bg-surface"
                        onClick={() => setDrawerOpen(false)}
                      >
                        {t(child.key)}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between">
              <LanguageSwitcher />
              <ButtonLink href="/book-consultation" size="sm" onClick={() => setDrawerOpen(false)}>
                {t("bookConsultation")}
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
