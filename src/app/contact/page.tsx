import type { Metadata } from "next";
import { ContactPageClient } from "./client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact TrustEdge Tax Services in Saskatoon, Saskatchewan to book a consultation for personal tax, corporate tax, or estate planning services.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}
