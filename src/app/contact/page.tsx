import type { Metadata } from "next";
import { ContactPageClient } from "./client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Tax Office in Saskatoon",
  description:
    "Contact TrustEdge Tax Services in Saskatoon, Saskatchewan to book a consultation for personal tax, corporate tax, or estate planning.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}
