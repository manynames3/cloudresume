import type { MetadataRoute } from "next";
import { caseStudySlugs } from "@/content/case-studies";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudySlugs.map((slug) => ({
      url: absoluteUrl(`/case-studies/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
