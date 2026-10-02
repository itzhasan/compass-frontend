import { getTranslations, setRequestLocale } from "next-intl/server";

import { CoverImage } from "@/components/CoverImage";
import { PageBlocks } from "@/components/PageBlocks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { api } from "@/lib/api/client";
import type { Locale, TeamMember } from "@/lib/api/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("about") };
}

function TeamGrid({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((m) => (
        <div key={m.id} className="text-center">
          <div className="relative mx-auto mb-3 h-28 w-28 overflow-hidden rounded-full">
            <CoverImage src={m.photo} alt={m.name} sizes="112px" />
          </div>
          <p className="font-semibold text-fg">{m.name}</p>
          {m.title ? <p className="text-sm text-muted">{m.title}</p> : null}
        </div>
      ))}
    </div>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [page, team, t] = await Promise.all([
    api.page(loc, "about"),
    api.team(loc),
    getTranslations("nav"),
  ]);

  const founders = team.filter((m) => m.is_founder);
  const consultants = team.filter((m) => !m.is_founder);

  return (
    <>
      <PageHeader
        label="About"
        index={1}
        title={page?.title ?? t("about")}
        breadcrumbs={<Breadcrumbs items={[{ label: t("home"), href: "/" }, { label: t("about") }]} />}
      />
      {page ? (
        <Container className="max-w-3xl py-12">
          <PageBlocks blocks={page.blocks} />
        </Container>
      ) : null}

      {founders.length > 0 ? (
        <Section surface>
          <SectionHeading title={t("about")} />
          <TeamGrid members={founders} />
        </Section>
      ) : null}

      {consultants.length > 0 ? (
        <Section>
          <SectionHeading title={t("about")} />
          <TeamGrid members={consultants} />
        </Section>
      ) : null}
    </>
  );
}
