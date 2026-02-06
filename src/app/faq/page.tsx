import type { Metadata } from "next";
import { FAQPageClient } from "./client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about tax services in Saskatoon, Saskatchewan — personal tax, corporate tax, and estate planning services.",
  path: "/faq",
});

export default function FAQPage() {
  return <FAQPageClient />;
}
