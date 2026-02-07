import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Estate Planning",
  description:
    "Estate planning and estate-related tax support in Saskatchewan — structured coordination and careful handling during a sensitive time.",
  path: "/services/estate-planning",
});

export default function EstatePlanningPage() {
  return (
      <ServicePage
        title="Estate Planning Services"
        intro="A calm, structured approach to estate planning and estate-related tax needs, designed to reduce stress and keep responsibilities clear during a difficult time."
        imageSrc="/images/site/estate-planning-4k.webp"
        imageAlt="Calm estate planning desk scene with binder and documents"
        whoFor={[
          "Executors who want an organized, step-by-step plan",
          "Families coordinating documents and timelines",
          "Clients who want careful, professional handling of sensitive details",
        ]}
      included={[
        "Estate planning intake checklist (documents and timelines)",
        "Coordination and planning for tax-related steps",
        "Clear records and documentation guidance",
        "Review-first workflow",
      ]}
      bring={[
        "Executor/estate documentation (if available)",
        "CRA correspondence (if applicable)",
        "Prior-year tax information (if available)",
        "A list of accounts and institutions involved (optional)",
      ]}
      faqs={[
        {
          q: "Is this legal advice?",
          a: "We provide tax-focused estate planning support and coordinate closely with your lawyer or advisor so legal and tax steps stay aligned.",
        },
        {
          q: "Can you tailor this to our situation?",
          a: "Yes. Each engagement is tailored to your estate documents, timeline, and family coordination needs.",
        },
      ]}
    />
  );
}
