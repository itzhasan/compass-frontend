/**
 * Built-in values for the public (NEXT_PUBLIC_*) settings, so the site builds and runs
 * without any .env file or Vercel environment variables. A real environment variable
 * still wins when set (e.g. `.env.local` during development).
 *
 * Production builds (`next build`, Vercel) get the live values; `next dev` gets local
 * ones. Everything here is public by design — never put secrets in this file.
 * Imported by next.config.ts too, so keep it free of path aliases.
 */
const production = {
  NEXT_PUBLIC_API_URL: "http://207.180.201.45:1111",
  NEXT_PUBLIC_MEDIA_URL: "http://207.180.201.45:1111",
  NEXT_PUBLIC_SITE_URL: "https://frontend-pied-chi-60.vercel.app",
  // Cloudflare Turnstile is off (empty key → no widget), matching the backend's
  // TURNSTILE_ENABLED=false. To turn it on, put the real site key here and enable it there.
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
};

const development: typeof production = {
  NEXT_PUBLIC_API_URL: "http://localhost:8000",
  NEXT_PUBLIC_MEDIA_URL: "http://127.0.0.1:9100",
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
};

export const publicDefaults = process.env.NODE_ENV === "production" ? production : development;
