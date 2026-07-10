import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

const description =
  "Aiden Rhaa builds inspectable AWS systems with explicit operating boundaries, evidence, recovery paths, and handoff artifacts.";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Aiden Rhaa — Cloud Platform & Reliability Engineer",
  description,
};

export default function Home() {
  return <HomePage />;
}
