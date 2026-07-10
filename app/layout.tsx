import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aiden Rhaa — Cloud Platform & Reliability Engineer",
  description:
    "Cloud platform and reliability engineering portfolio focused on inspectable AWS systems, operating evidence, recovery, and handoff.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
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
