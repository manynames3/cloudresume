import type { CaseStudy } from "@/content/case-studies";
import { caseStudies, caseStudySlugs } from "@/content/case-studies";
import { profile } from "@/content/profile";
import { absoluteUrl, personId, websiteId } from "@/lib/site-url";

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        url: absoluteUrl("/"),
        jobTitle: profile.role,
        email: `mailto:${profile.email}`,
        image: absoluteUrl(profile.portrait.src),
        sameAs: [profile.linkedin, profile.github],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absoluteUrl("/"),
        name: `${profile.name} — ${profile.role}`,
        publisher: { "@id": personId },
      },
      {
        "@type": "ItemList",
        "@id": absoluteUrl("/#work"),
        name: "Selected cloud systems",
        itemListElement: caseStudySlugs.map((slug, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: caseStudies[slug].title,
          url: absoluteUrl(`/case-studies/${slug}`),
        })),
      },
    ],
  };
}

export function caseStructuredData(study: CaseStudy) {
  const caseUrl = absoluteUrl(`/case-studies/${study.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${caseUrl}#article`,
        url: caseUrl,
        headline: study.benefitHeading,
        description: study.summary,
        author: { "@id": personId },
        publisher: { "@id": personId },
        isPartOf: { "@id": websiteId },
        about: study.technologies,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${caseUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Work",
            item: absoluteUrl("/#work"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: study.title,
            item: caseUrl,
          },
        ],
      },
    ],
  };
}
