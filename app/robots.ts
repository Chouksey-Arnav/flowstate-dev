import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flowstate.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/tasks", "/habits", "/focus", "/stats", "/settings"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
