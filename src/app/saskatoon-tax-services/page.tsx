import type { Metadata } from "next";
import { SaskatoonTaxServicesPageClient } from "./client";

export const metadata: Metadata = {
  title: "Saskatoon Tax Services",
  description:
    "Saskatoon tax services for personal tax, corporate tax, and estate planning services. A clear checklist-driven process for Saskatchewan clients.",
  alternates: { canonical: "/saskatoon-tax-services" },
};

export default function SaskatoonTaxServicesPage() {
  return <SaskatoonTaxServicesPageClient />;
}
