import { getTranslations } from "next-intl/server";

import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <Section className="text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold text-fg">{t("notFoundTitle")}</h1>
      <p className="mt-2 text-muted">{t("notFoundBody")}</p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/">{t("backHome")}</ButtonLink>
      </div>
    </Section>
  );
}
