import type { MetadataRoute } from "next";
import { caseStudySlugs } from "@/content/case-studies";
import { absoluteUrl, requestOrigin } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await requestOrigin();
  return [
    {
      url: absoluteUrl(origin, "/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudySlugs.map((slug) => ({
      url: absoluteUrl(origin, `/case-studies/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
