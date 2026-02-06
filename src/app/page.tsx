import type { Metadata } from "next";
import HomePageClient from "./home-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "TrustEdge Tax Services",
  description:
    "Tax services in Saskatoon, Saskatchewan focused on personal tax, corporate tax, and estate planning services.",
  path: "/",
});

export default function HomePage() {
  return <HomePageClient />;
}
