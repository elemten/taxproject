"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { AnimatedAccordion } from "@/components/animated-accordion";
import { site } from "@/lib/site";

const faqs = [
  {
    q: "Do you handle CRA (Canada) cases only, or US/IRS too?",
    a: "We focus on Canadian tax and CRA-related work, and we take on select CRA cases depending on scope and timelines. If your situation includes US/IRS or complex cross-border requirements, we'll help you confirm the right next step.",
  },
  {
    q: "Do you serve only Saskatoon?",
    a: `Saskatoon is the priority, but we also serve clients across ${site.province}.`,
  },
  {
    q: "How do I get started?",
    a: "Book a consultation (placeholder on the homepage) or use the contact form. We'll reply with next steps and a simple checklist.",
  },
  {
    q: "Do you offer GST/HST, bookkeeping, or payroll?",
    a: "GST/HST, bookkeeping, and payroll support is being added soon. In the meantime, we can work with the records you already have and keep the tax workflow organized — rest assured we'll guide the next step.",
  },
  {
    q: "Can you work with a third-party bookkeeper or payroll provider?",
    a: "Yes. We can coordinate with third-party bookkeeping and payroll providers to align records, timelines, and filing details.",
  },
  {
    q: "Do you provide financial guidance or advice?",
    a: "Yes — general financial guidance is often part of tax planning and helping you choose the next best step. For highly complicated situations, we may recommend speaking with a qualified professional (for example, a lawyer, CFP, or specialist) for comprehensive advice. Website content is shared as general information; recommendations become specific during an engagement.",
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
          description="Quick answers to the questions we hear most often. (Mockup content — we can refine after approval.)"
          level={1}
        />

        <AnimatedAccordion items={faqs} />
      </div>
    </motion.div>
  );
}
