import { ArrowUpRight } from "lucide-react";

import { CoverImage } from "@/components/CoverImage";
import { Badge, CardLink } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import type {
  Article,
  CaseStudy,
  EcosystemEntity,
  Locale,
  News,
  Package,
  Sector,
  Service,
} from "@/lib/api/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <CardLink href={`/services/${service.slug}`}>
      <ArrowUpRight className="mb-4 h-6 w-6 text-accent rtl:-scale-x-100" aria-hidden />
      <h3 className="text-lg font-semibold text-fg">{service.title}</h3>
      {service.summary ? <p className="mt-2 text-sm text-muted">{service.summary}</p> : null}
    </CardLink>
  );
}

export function SectorCard({ sector }: { sector: Sector }) {
  return (
    <CardLink href={`/sectors/${sector.slug}`} className="p-5">
      <h3 className="text-base font-semibold text-fg">{sector.name}</h3>
    </CardLink>
  );
}

export function PackageCard({ pkg, pricingLabel }: { pkg: Package; pricingLabel: string }) {
  return (
    <CardLink href={`/packages/${pkg.slug}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge tone={pkg.pricing_type === "custom_quote" ? "neutral" : "accent"}>{pricingLabel}</Badge>
        {pkg.is_featured ? <Badge tone="primary">★</Badge> : null}
      </div>
      <h3 className="text-lg font-semibold text-fg">{pkg.name}</h3>
      {pkg.price && pkg.pricing_type !== "custom_quote" ? (
        <p className="mt-2 text-xl font-bold text-primary" dir="ltr">
          {pkg.price} {pkg.currency}
        </p>
      ) : null}
      {pkg.problem_solved ? (
        <p
          className="mt-2 line-clamp-3 text-sm text-muted"
          // problem_solved is short rich text; strip tags for the teaser.
          dangerouslySetInnerHTML={{ __html: pkg.problem_solved.replace(/<[^>]+>/g, " ") }}
        />
      ) : null}
    </CardLink>
  );
}

export function ArticleCard({ article, locale }: { article: Article; locale: Locale }) {
  return (
    <CardLink href={`/insights/${article.slug}`} className="overflow-hidden p-0">
      <div className="relative aspect-[16/9] w-full">
        <CoverImage src={article.cover} alt={article.title} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge tone="accent" className="mb-2 self-start">
          {article.type_label}
        </Badge>
        <h3 className="text-base font-semibold text-fg">{article.title}</h3>
        <p className="mt-auto pt-3 text-xs text-muted">{formatDate(article.published_at, locale)}</p>
      </div>
    </CardLink>
  );
}

export function NewsCard({ news, locale, expiredLabel }: { news: News; locale: Locale; expiredLabel: string }) {
  return (
    <CardLink href={`/news/${news.slug}`} className="overflow-hidden p-0">
      <div className="relative aspect-[16/9] w-full">
        <CoverImage src={news.cover} alt={news.title} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="neutral">{news.category_label}</Badge>
          {news.is_expired ? <Badge tone="warning">{expiredLabel}</Badge> : null}
        </div>
        <h3 className="text-base font-semibold text-fg">{news.title}</h3>
        <p className="mt-auto pt-3 text-xs text-muted">{formatDate(news.published_at, locale)}</p>
      </div>
    </CardLink>
  );
}

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <CardLink href={`/case-studies/${caseStudy.slug}`} className="overflow-hidden p-0">
      <div className="relative aspect-[16/9] w-full">
        <CoverImage src={caseStudy.cover} alt={caseStudy.title} />
      </div>
      <div className="p-5">
        {caseStudy.client_name ? (
          <p className="mb-1 text-xs font-medium text-accent">{caseStudy.client_name}</p>
        ) : null}
        <h3 className="text-base font-semibold text-fg">{caseStudy.title}</h3>
        {caseStudy.metrics.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-3">
            {caseStudy.metrics.slice(0, 3).map((m) => (
              <div key={m.label}>
                <p className="text-lg font-bold text-primary">{m.value}</p>
                <p className="text-xs text-muted">{m.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </CardLink>
  );
}

export function EcosystemCard({ entity }: { entity: EcosystemEntity }) {
  return (
    <CardLink href={`/ecosystem/${entity.slug}`}>
      <Badge tone="primary" className="mb-3 self-start">
        {entity.type_label}
      </Badge>
      <h3 className="text-base font-semibold text-fg">{entity.name}</h3>
      {entity.field_of_work ? <p className="mt-1 text-sm text-muted">{entity.field_of_work}</p> : null}
    </CardLink>
  );
}
