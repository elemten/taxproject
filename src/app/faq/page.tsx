import type { Metadata } from "next";
import { FAQPageClient } from "./client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Tax Services FAQ",
  description:
    "Frequently asked questions about personal tax, corporate tax, and estate planning services in Saskatoon and Saskatchewan.",
  path: "/faq",
});

export default function FAQPage() {
  return <FAQPageClient />;
}
