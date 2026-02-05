import type { Metadata } from "next";
import { AboutPageClient } from "./client";

export const metadata: Metadata = {
  title: "About",
  description:
    "TrustEdge Tax Services is a Saskatchewan-focused tax service built around a clear process and premium client experience.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
