import { z } from "zod";

/**
 * Validates environment at boot. Only NEXT_PUBLIC_* values are safe in the client bundle;
 * server-only secrets (REVALIDATE_SECRET, TURNSTILE_SECRET_KEY) must never be prefixed.
 */
const schema = z.object({
  // Public — safe to expose to the browser.
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8000"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_MEDIA_URL: z.string().url().default("http://127.0.0.1:9100"),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().default("1x00000000000000000000AA"),

  // Server-only.
  REVALIDATE_SECRET: z.string().default("local-dev-revalidate-secret-change-me"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
