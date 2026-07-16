import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const baseUrl = SITE_URL;

const PRIVATE_APP_PATHS = ["/dashboard", "/tasks", "/habits", "/focus", "/stats", "/settings"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_APP_PATHS,
      },
      // Named explicitly so AI answer engines (ChatGPT, Claude, Perplexity, Google's
      // AI Overviews) can cite the public marketing/docs pages, same as any other bot.
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: PRIVATE_APP_PATHS,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
