import type { Metadata } from "next";
import HomePageClient from "./home-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Tax Services in Saskatoon, Saskatchewan",
  description:
    "Trusted tax services in Saskatoon and across Saskatchewan for personal tax, corporate tax, and estate planning support.",
  path: "/",
});

export default function HomePage() {
  return <HomePageClient />;
}
