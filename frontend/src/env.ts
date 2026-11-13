import { z } from "zod";

import { publicDefaults as d } from "./config/public-env";

/**
 * Validates environment at boot. Only NEXT_PUBLIC_* values are safe in the client bundle;
 * server-only secrets (REVALIDATE_SECRET, TURNSTILE_SECRET_KEY) must never be prefixed.
 * Public defaults live in config/public-env.ts, so no .env file is needed to build.
 */
const schema = z.object({
  // Public — safe to expose to the browser.
  NEXT_PUBLIC_API_URL: z.string().url().default(d.NEXT_PUBLIC_API_URL),
  NEXT_PUBLIC_SITE_URL: z.string().url().default(d.NEXT_PUBLIC_SITE_URL),
  NEXT_PUBLIC_MEDIA_URL: z.string().url().default(d.NEXT_PUBLIC_MEDIA_URL),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().default(d.NEXT_PUBLIC_TURNSTILE_SITE_KEY),

  // Server-only.
  REVALIDATE_SECRET: z.string().default("local-dev-revalidate-secret-change-me"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}


export const env = parsed.data;
