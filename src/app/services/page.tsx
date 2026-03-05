import type { Metadata } from "next";
import { ServicesPageClient } from "./client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Tax Services in Saskatoon",
  description:
    "Personal tax, corporate tax, and estate planning services for Saskatoon and Saskatchewan clients with a clear, checklist-driven process.",
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesPageClient />;
}
