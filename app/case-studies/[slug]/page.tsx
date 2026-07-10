import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study-page";
import { caseStudySlugs, getCaseStudy } from "@/content/case-studies";

type RouteProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.seo.title,
    description: study.seo.description,
    openGraph: {
      title: study.seo.title,
      description: study.seo.description,
      type: "article",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Editorial social card for Aiden Rhaa's cloud engineering portfolio.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: study.seo.title,
      description: study.seo.description,
      images: ["/og.png"],
    },
  };
}

export default async function CaseRoute({ params }: RouteProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return <CaseStudyPage study={study} />;
}
