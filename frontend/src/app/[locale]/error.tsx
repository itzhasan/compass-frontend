"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("common");
  return (
    <Section className="text-center">
      <h1 className="text-2xl font-bold text-fg">{t("error")}</h1>
      <div className="mt-6 flex justify-center">
        <Button onClick={reset}>{t("retry")}</Button>
      </div>
    </Section>
  );
}
