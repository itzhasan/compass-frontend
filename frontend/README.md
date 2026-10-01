# Compass Frontend — Next.js 16 public site

Bilingual (Arabic RTL / English LTR) App-Router site. All content comes from the Laravel
API; UI strings live in `messages/{ar,en}.json`.

## Stack

Next.js 16 (App Router, RSC, Turbopack) · TypeScript strict · Tailwind v4 (token layer) ·
next-intl · react-hook-form · lucide-react · isomorphic-dompurify.

## Structure

```
src/
  i18n/                 routing (ar default), request config, locale-aware navigation
  middleware.ts         next-intl locale routing + "/" → /ar by Accept-Language
  app/[locale]/         all pages (layout owns <html lang dir>, fonts, header/footer)
  app/api/revalidate/   HMAC-verified cache revalidation webhook target
  app/sitemap.ts        built from GET /sitemap · app/robots.ts
  lib/api/              typed fetch client + response types (cache tags per request)
  lib/{seo,jsonld,...}  metadata + JSON-LD builders
  components/           ui primitives, cards, layout, forms (DynamicForm), JsonLd, consent
```

## Swapping in the brand kit

- **Colors / fonts / radii**: edit the token block at the top of `src/app/globals.css`
  (CSS variables for light + dark). Fonts are loaded via `next/font` in the locale layout.
- **Logo / copy**: logo → header/footer; UI strings → `messages/*.json`; all page content
  is CMS-managed via the API.

## RTL / LTR

`<html dir>` is set from the locale. Components use **logical** utilities only
(`ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`), and directional icons flip in RTL — so one
component tree works in both directions.

## Revalidation

Laravel POSTs `{ tags: [...] }` to `/api/revalidate` with `X-Signature` =
HMAC-SHA256(body, `REVALIDATE_SECRET`). The route verifies it with `timingSafeEqual` and
calls `revalidateTag` for each tag. Cache tags match the backend's tag names.

## Environment

Public (safe in the bundle): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_MEDIA_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
Server-only: `REVALIDATE_SECRET`. Validated with zod at boot (`src/env.ts`).

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npx tsc --noEmit     # typecheck
npx eslint src       # lint
npm run build        # production build (standalone output)
```
