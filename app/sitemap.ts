import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { DOCS } from "@/lib/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified,
    },
    ...DOCS.map((doc) => ({
      url: `${SITE_URL}/docs/${doc.slug}`,
      lastModified,
    })),
  ];
}
