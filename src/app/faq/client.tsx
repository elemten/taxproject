"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { AnimatedAccordion } from "@/components/animated-accordion";
import { site } from "@/lib/site";

const faqs = [
  {
    q: "Do you serve only Saskatoon?",
    a: `Saskatoon is our primary market, and we also support clients across ${site.province} and other Canadian locations through remote-first coordination.`,
  },
  {
    q: "How do I get started?",
    a: "Call, email, or submit the contact form. We respond with next steps, timeline guidance, and your appointment time.",
  },
  {
    q: "Do you offer GST/HST, bookkeeping, or payroll?",
    a: "GST/HST, bookkeeping, and payroll support is coming soon. In the meantime, we can coordinate your tax file and keep everything organized for a smooth transition.",
  },
  {
    q: "Can you work with a third-party bookkeeper or payroll provider?",
    a: "Yes. We can coordinate with third-party bookkeeping and payroll providers to align records, timelines, and filing details.",
  },
  {
    q: "Do you provide financial guidance or advice?",
    a: "Yes. We provide tax-focused planning guidance and, when needed, coordinate directly with legal and financial specialists so recommendations stay aligned with your goals.",
  },
];

export function FAQPageClient() {
  const shouldReduceMotion = useReducedMotion();
  
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
    <motion.div
      className="container-page py-14 sm:py-20"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions"
          description="Clear answers to the questions we hear most often from individuals, families, and business owners."
          level={1}
        />

        <AnimatedAccordion items={faqs} />
      </div>
    </motion.div>
  );
}
