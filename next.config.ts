import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Delivery rehosts every licensed image under public/images; remote hosts stay blocked.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The three the other two BoardlessAI sites already send and this one did not.
          // Without frame-ancestors and X-Frame-Options any page here could be framed and
          // clicked through; without a policy, an injected script would run unchallenged.
          // Everything this site loads is same-origin — delivery rehosts every image under
          // public/images and remotePatterns is empty — so the policy can be strict. Inline
          // styles and scripts are allowed because Next.js emits both.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "connect-src 'self'",
              "font-src 'self' data:",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "img-src 'self' data: blob:",
              "object-src 'none'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
