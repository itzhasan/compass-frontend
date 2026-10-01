/**
 * TypeScript shapes mirroring the Laravel API contract (see docs/SHARED_PROJECT_SPEC.md).
 * The API is the source of truth; these types describe what the frontend consumes.
 */

export type Locale = "ar" | "en";

export interface Seo {
  title: string;
  description: string;
  og_image: string | null;
  canonical: string | null;
}

export type Alternates = Record<Locale, string | null>;

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface Collection<T> {
  data: T[];
}

export interface Item<T> {
  data: T;
}

interface Translatable {
  id: number;
  slug: string;
  locale: Locale;
  seo: Seo;
  alternates: Alternates;
  published_at: string | null;
}

export interface Service extends Translatable {
  title: string;
  summary: string | null;
  icon: string | null;
  cover: string | null;
  body?: string | null;
  sectors?: Sector[];
  packages?: Package[];
}

export interface Sector extends Translatable {
  name: string;
  icon: string | null;
  cover: string | null;
  definition: string | null;
  current_state: string | null;
  key_challenges: string | null;
  services_offered: string | null;
  sample_projects: string | null;
  services?: Service[];
  case_studies?: CaseStudy[];
  articles?: Article[];
}

export type PricingType = "fixed" | "starting_from" | "custom_quote";

export interface PackageFaq {
  question: string;
  answer: string;
}

export interface Package extends Translatable {
  name: string;
  pricing_type: PricingType;
  pricing_type_label: string;
  price: string | null;
  currency: string | null;
  is_featured: boolean;
  cta: string;
  cta_form_key: string;
  problem_solved: string | null;
  target_audience: string | null;
  scope_of_work: string | null;
  deliverables: string | null;
  duration: string | null;
  sessions_count: string | null;
  client_responsibilities: string | null;
  payment_terms: string | null;
  exclusions: string | null;
  faqs: PackageFaq[];
  service?: Service | null;
}

export interface Article extends Translatable {
  title: string;
  type: string;
  type_label: string;
  category: string | null;
  reading_time: number | null;
  cover: string | null;
  prepared_by: string | null;
  tags: string[];
  body?: string | null;
  sources?: { label: string; url: string }[];
  pdf_url: string | null;
  authors?: TeamMember[];
  related_articles?: Article[];
}

export interface News extends Translatable {
  title: string;
  category: string;
  category_label: string;
  cover: string | null;
  body?: string | null;
  gallery?: string[];
  attachments?: { name: string; url: string }[];
  is_expired: boolean;
  state: "active" | "archived";
  cta: { label: string; url: string } | null;
  expires_at: string | null;
}

export interface CaseStudy extends Translatable {
  title: string;
  client_name: string | null;
  cover: string | null;
  challenge: string | null;
  approach: string | null;
  results: string | null;
  metrics: { label: string; value: string }[];
  gallery?: string[];
  sector?: Sector | null;
  articles?: Article[];
}

export type EcosystemType =
  | "sister_company"
  | "affiliated_brand"
  | "platform_program"
  | "strategic_initiative"
  | "long_term_institutional_partner";

export interface EcosystemEntity extends Translatable {
  name: string;
  type: EcosystemType;
  type_label: string;
  logo: string | null;
  short_bio: string | null;
  relationship: string | null;
  field_of_work: string | null;
  website: string | null;
  socials: { platform: string; url: string }[];
  classification: string | null;
}

export interface TeamMember {
  id: number;
  slug: string;
  locale: Locale;
  name: string;
  title: string | null;
  department: string | null;
  bio: string | null;
  is_founder: boolean;
  is_consultant: boolean;
  photo: string | null;
  socials: { platform: string; url: string }[];
}

export interface Page extends Translatable {
  title: string;
  blocks: { type: string; data: Record<string, unknown> }[];
}

export interface Client {
  id: number;
  name: string;
  kind: "client" | "partner";
  logo: string | null;
  website: string | null;
  testimonial: string | null;
}

export interface Stat {
  key: string;
  label: string;
  value: string;
}

export interface Settings {
  contact: {
    email: string | null;
    phones: { number: string; is_whatsapp: boolean }[];
    address: string | null;
    map_embed_url: string | null;
  };
  socials: { platform: string; url: string }[];
  stats: Stat[];
  analytics: {
    ga4_id: string | null;
    plausible_domain: string | null;
    consent_required: boolean;
  };
  home_sections: { key: string; is_enabled: boolean; sort: number }[];
  default_seo: { title: string | null; description: string | null; og_image: string | null };
}

export interface HomeSection {
  key: string;
  data: Record<string, unknown> | null;
}

export interface SearchResults {
  articles: Article[];
  news: News[];
  services: Service[];
  sectors: Sector[];
  packages: Package[];
}

// Dynamic forms
export type FormFieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "select"
  | "multiselect"
  | "checkbox"
  | "date"
  | "file";

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  key: string;
  type: FormFieldType;
  label: string;
  help: string | null;
  is_required: boolean;
  options: FormFieldOption[];
  rules: Record<string, unknown>;
}

export interface FormSchema {
  key: string;
  title: string;
  notice: string | null;
  fields: FormField[];
}

export interface SitemapEntry {
  locale: Locale;
  path: string;
  lastmod: string | null;
  alternates: Alternates;
}
