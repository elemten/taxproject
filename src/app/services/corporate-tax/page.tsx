import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Corporate Tax",
  description:
    "Corporate tax support for Saskatchewan businesses — structured intake, careful review, and CRA-ready documentation.",
  path: "/services/corporate-tax",
});

export default function CorporateTaxPage() {
  return (
      <ServicePage
        title="Corporate Tax"
        intro="A structured process for business owners who want clarity, organization, and corporate filing support that feels premium and predictable."
        imageSrc="/images/site/corporate-tax-4k.webp"
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
          a: "Yes. We support GST/HST workflows, payroll-related tax documentation, and bookkeeping coordination as part of corporate engagements.",
        },
        {
          q: "Can you work with my accountant or bookkeeper?",
          a: "Yes. We coordinate directly with your accountant or bookkeeper to keep records aligned and deadlines on track.",
        },
      ]}
    />
  );
}
