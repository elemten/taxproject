import type { Metadata } from "next";
import { FAQPageClient } from "./client";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about tax services in Saskatoon, Saskatchewan — personal tax, corporate tax, and estate planning services.",
};

export default function FAQPage() {
  return <FAQPageClient />;
}
