import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { publicDefaults } from "./src/config/public-env";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Hosts that serve remote images (the API + the S3/MinIO media bucket).
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? publicDefaults.NEXT_PUBLIC_API_URL);
const mediaUrl = new URL(process.env.NEXT_PUBLIC_MEDIA_URL ?? publicDefaults.NEXT_PUBLIC_MEDIA_URL);

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
  // Form submissions go through this site and are forwarded server-side, so the browser
  // never calls the API directly: an https page can't post to the plain-http backend, and
  // no CORS is involved. Only the submission endpoint is forwarded.
  async rewrites() {
    const api = (process.env.NEXT_PUBLIC_API_URL ?? publicDefaults.NEXT_PUBLIC_API_URL).replace(/\/$/, "");
    return [
      {
        source: "/api/v1/:locale/forms/:key/submissions",
        destination: `${api}/api/v1/:locale/forms/:key/submissions`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
