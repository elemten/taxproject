import type { Metadata } from "next";
import { AboutPageClient } from "./client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "TrustEdge Tax Services is a Saskatchewan-focused tax service built around a clear process and premium client experience.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageClient />;
}
