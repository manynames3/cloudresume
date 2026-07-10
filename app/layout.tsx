import type { Metadata } from "next";
import { siteOrigin } from "@/lib/site-url";
import "./globals.css";

const title = "Aiden Rhaa — Cloud Platform & Reliability Engineer";
const description =
  "Cloud platform and reliability engineering portfolio focused on inspectable AWS systems, operating evidence, recovery, and handoff.";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title,
  description,
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
