import type { MetadataRoute } from "next";
import { absoluteUrl, requestOrigin } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await requestOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl(origin, "/sitemap.xml"),
  };
}
