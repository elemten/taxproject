import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about tax services in Saskatoon, Saskatchewan — personal tax, corporate tax, and estate management services.",
};

const faqs = [
  {
    q: "Are you Canada-only (CRA) or US/IRS as well?",
    a: "Canada-only. TrustEdge Tax Services is focused on Canadian tax needs and CRA-related workflows.",
  },
  {
    q: "Do you serve only Saskatoon?",
    a: `Saskatoon is the priority, but we also serve clients across ${site.province}.`,
  },
  {
    q: "How do I get started?",
    a: "Book a consultation (placeholder on the homepage) or use the contact form. We’ll reply with next steps and a simple checklist.",
  },
  {
    q: "Do you offer bookkeeping or payroll?",
    a: "This mockup focuses on personal tax, corporate tax, and estate management services. Optional add-ons can be added later if needed.",
  },
  {
    q: "Is this legal or financial advice?",
    a: "No. The website content is general information and does not constitute legal, financial, or tax advice.",
  },
] as const;

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="container-page py-14 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions"
          description="Quick answers to the questions we hear most often. (Mockup content — we can refine after approval.)"
        />

        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="surface-solid px-5 py-4"
              open={item.q === faqs[0].q}
            >
              <summary className="cursor-pointer select-none text-sm font-semibold">
                {item.q}
              </summary>
              <p className="mt-2 pt-2 text-sm leading-7 text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

