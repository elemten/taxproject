import type { Metadata } from "next";
import { SaskatoonTaxServicesPageClient } from "./client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Saskatoon Tax Services",
  description:
    "Saskatoon tax services for personal tax, corporate tax, and estate planning services. A clear checklist-driven process for Saskatchewan clients.",
  path: "/saskatoon-tax-services",
});

export default function SaskatoonTaxServicesPage() {
  return <SaskatoonTaxServicesPageClient />;
}
