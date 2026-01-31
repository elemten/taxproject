import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";

export const metadata: Metadata = {
  title: "Personal Tax",
  description:
    "Personal tax services in Saskatoon, Saskatchewan — a clear checklist, careful review, and a calm filing process.",
};

export default function PersonalTaxPage() {
  return (
    <ServicePage
      title="Personal Tax"
      intro="A clean, organized approach to personal tax filing for individuals and families in Saskatoon and across Saskatchewan."
      imageSrc="/illustrations/personal-tax.svg"
      imageAlt="Vector illustration for personal tax services"
      whoFor={[
        "Individuals and families who want a straightforward filing process",
        "Newcomers to Canada who want clarity on what’s needed",
        "Clients with common slips and deductions who want an organized checklist",
      ]}
      included={[
        "Intake checklist and document review",
        "T1 preparation and filing (Canada)",
        "Review step before submission",
        "Post-filing guidance (next steps, records to keep)",
      ]}
      bring={[
        "Government-issued ID",
        "T4 / T4A / T5 and other slips (if applicable)",
        "Expense receipts relevant to your situation",
        "Prior-year return (if available)",
      ]}
      faqs={[
        {
          q: "Do you handle CRA communications?",
          a: "For the mockup, this is presented as a service option. Once the workflow is finalized, we can define exactly what CRA support is included.",
        },
        {
          q: "How long does it take?",
          a: "Timelines depend on document readiness. The process is designed to be clear and efficient, and we’ll confirm an expected timeline after intake.",
        },
      ]}
    />
  );
}
