import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";

export const metadata: Metadata = {
  title: "Corporate Tax",
  description:
    "Corporate tax support for Saskatchewan businesses — structured intake, careful review, and CRA-ready documentation.",
};

export default function CorporateTaxPage() {
  return (
      <ServicePage
        title="Corporate Tax"
        intro="A structured process for business owners who want clarity, organization, and corporate filing support that feels premium and predictable."
        imageSrc="/images/site/corporate-tax.webp"
        imageAlt="Modern corporate desk scene for tax planning"
        whoFor={[
          "Small business owners looking for a cleaner year-end process",
          "Corporations that want CRA-ready document organization",
          "Teams that prefer a checklist-driven workflow",
        ]}
      included={[
        "Year-end intake checklist",
        "Document organization guidance",
        "Corporate filing support (Canada)",
        "Review step before filing",
      ]}
      bring={[
        "Corporate details and prior-year filings (if available)",
        "Financial statements / bookkeeping exports (if available)",
        "Payroll/GST/HST-related documents (if applicable)",
        "CRA notices received (if applicable)",
      ]}
      faqs={[
        {
          q: "Do you support GST/HST and payroll?",
          a: "For the mockup, we keep the focus on corporate tax. If you want, we can add optional add-ons later (GST/HST, payroll, bookkeeping coordination).",
        },
        {
          q: "Can you work with my accountant or bookkeeper?",
          a: "Yes — the process is designed to coordinate cleanly with other professionals when needed.",
        },
      ]}
    />
  );
}
