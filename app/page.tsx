import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

const description =
  "Aiden Rhaa turns business requirements into tested AI-assisted applications and cloud systems, with shared data contracts, AWS infrastructure, explicit decision boundaries and recovery paths.";
const title = "Aiden Rhaa — AI Applications & Cloud Engineer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
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
    title,
    description,
    images: ["/og.png"],
  },
};

export default function Home() {
  return <HomePage />;
}
