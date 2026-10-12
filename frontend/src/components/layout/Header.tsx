"use client";

import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavItem {
  key: string;
  /** Shorter label for the desktop bar, when the full one is too long. */
  shortKey?: string;
  href: string;
  /** Drawer-only items are hidden from the desktop bar. */
  drawerOnly?: boolean;
  children?: { key: string; href: string }[];
}

const NAV: NavItem[] = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "packages", shortKey: "packagesShort", href: "/packages" },
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
  { key: "ecosystem", shortKey: "ecosystemShort", href: "/ecosystem" },
  { key: "partner", href: "/partner-sponsorship", drawerOnly: true },
  { key: "contact", href: "/contact" },
];

const isActive = (pathname: string, item: NavItem) =>
  pathname === item.href ||
  pathname.startsWith(`${item.href}/`) ||
  (item.children?.some((c) => pathname === c.href || pathname.startsWith(`${c.href}/`)) ?? false);

export function Header({ brand }: { brand: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const navLink = "rounded-[var(--radius-sm)] px-2.5 py-2 text-[0.8125rem] font-bold text-fg transition-colors hover:text-accent";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/95 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-extrabold text-fg"
          onClick={() => setDrawerOpen(false)}
        >
          <Image src="/logo.jpeg" alt="" width={32} height={32} className="h-8 w-8 rounded-[var(--radius-sm)]" priority />
          {brand}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV.filter((item) => !item.drawerOnly).map((item) => {
            const label = t(item.shortKey ?? item.key);
            const active = isActive(pathname, item);
            return item.children ? (
              <div key={item.key} className="group relative">
                <Link href={item.href} className={cn(navLink, "inline-block", active && "text-accent")} aria-haspopup="true">
                  {label}
                </Link>
                <div className="invisible absolute start-0 top-full min-w-52 rounded-[var(--radius)] border border-border bg-bg p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href}
                      className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm text-fg hover:bg-surface hover:text-accent"
                    >
                      {t(child.key)}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.key} href={item.href} className={cn(navLink, active && "text-accent")}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher short />
          <ButtonLink href="/book-consultation" variant="secondary" size="sm" className="px-5">
            {t("bookConsultation")}
            <Arrow className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-[var(--radius-sm)] p-2 text-fg transition-colors hover:bg-surface lg:hidden"
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
          <nav className="mx-auto flex max-h-[calc(100dvh-4rem)] max-w-6xl flex-col gap-1 overflow-y-auto px-4 py-4" aria-label="Mobile">
            {NAV.map((item) => (
              <div key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-[var(--radius-sm)] px-3 py-2 font-bold text-fg hover:bg-surface",
                    isActive(pathname, item) && "text-accent",
                  )}
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
              <ButtonLink href="/book-consultation" variant="secondary" size="sm" onClick={() => setDrawerOpen(false)}>
                {t("bookConsultation")}
                <Arrow className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
