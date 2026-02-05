import type { Metadata } from "next";
import { ServicesPageClient } from "./client";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Personal tax, corporate tax, and estate planning services for Saskatoon and Saskatchewan clients.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
