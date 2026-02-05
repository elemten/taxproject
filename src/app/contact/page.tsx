import type { Metadata } from "next";
import { ContactPageClient } from "./client";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact TrustEdge Tax Services in Saskatoon, Saskatchewan to book a consultation for personal tax, corporate tax, or estate planning services.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
