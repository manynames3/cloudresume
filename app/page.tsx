import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

const description =
  "Aiden Rhaa designs and builds product-minded AWS infrastructure and platform systems with Terraform, CI/CD, observability, recovery paths, and explicit operating boundaries.";
const title = "Aiden Rhaa — AWS Infrastructure & Platform Engineer";

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
