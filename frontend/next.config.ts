import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Hosts that serve remote images (the API + the S3/MinIO media bucket).
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000");
const mediaUrl = new URL(process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://127.0.0.1:9100");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Turnstile + inline hydration; analytics scripts load only after consent.
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://plausible.io",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: ${apiUrl.origin} ${mediaUrl.origin}`,
      "font-src 'self' data:",
      `connect-src 'self' ${apiUrl.origin} https://plausible.io https://www.google-analytics.com`,
      "frame-src https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: apiUrl.protocol.replace(":", "") as "http" | "https", hostname: apiUrl.hostname, port: apiUrl.port },
      { protocol: mediaUrl.protocol.replace(":", "") as "http" | "https", hostname: mediaUrl.hostname, port: mediaUrl.port },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
