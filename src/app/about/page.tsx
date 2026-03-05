import type { Metadata } from "next";
import { AboutPageClient } from "./client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About TrustEdge Tax Services",
  description:
    "Learn about TrustEdge Tax Services, a Saskatoon and Saskatchewan-focused office offering premium, checklist-driven tax support.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageClient />;
}
