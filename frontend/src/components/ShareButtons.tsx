"use client";

import { Check, Copy, Globe, Link2, MessageCircle, Send, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

/** Social share row with native Web Share on mobile + copy-link fallback. */
export function ShareButtons({ title }: { title: string }) {
  const t = useTranslations("common");
  // Client component: window is available on first client render. Not rendered as text,
  // so lazy init causes no hydration mismatch.
  const [url] = useState(() => (typeof window !== "undefined" ? window.location.href : ""));
  const [copied, setCopied] = useState(false);

  const enc = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  // Generic icons until the brand kit arrives (lucide dropped brand marks).
  const targets = [
    { name: "WhatsApp", href: `https://wa.me/?text=${encTitle}%20${enc}`, icon: MessageCircle },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`, icon: Link2 },
    { name: "X", href: `https://twitter.com/intent/tweet?url=${enc}&text=${encTitle}`, icon: Share2 },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`, icon: Globe },
    { name: "Telegram", href: `https://t.me/share/url?url=${enc}&text=${encTitle}`, icon: Send },
  ];

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Uses the native share sheet when available (mobile), otherwise falls back to copy.
  const nativeShare = () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      void copy();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={t("sharePage")}>
      <span className="text-sm font-medium text-muted">{t("sharePage")}:</span>
      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface"
        aria-label={t("sharePage")}
      >
        <Share2 className="h-4 w-4" aria-hidden />
      </button>
      {targets.map((s) => (
        <a
          key={s.name}
          href={s.href}
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface"
          aria-label={s.name}
        >
          <s.icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface"
        aria-label={copied ? t("linkCopied") : t("copyLink")}
      >
        {copied ? <Check className="h-4 w-4 text-green-600" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  );
}
