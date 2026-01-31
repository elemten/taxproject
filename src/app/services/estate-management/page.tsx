import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";

export const metadata: Metadata = {
  title: "Estate Management",
  description:
    "Estate-related tax services in Saskatchewan — structured coordination and careful handling during a sensitive time.",
};

export default function EstateManagementPage() {
  return (
    <ServicePage
      title="Estate Management Services"
      intro="A calm, structured approach to estate-related tax needs, designed to reduce stress and keep responsibilities clear during a difficult time."
      imageSrc="/illustrations/estate-management.svg"
      imageAlt="Vector illustration for estate management services"
      whoFor={[
        "Executors who want an organized, step-by-step plan",
        "Families coordinating documents and timelines",
        "Clients who want careful, professional handling of sensitive details",
      ]}
      included={[
        "Estate intake checklist (documents and timelines)",
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
          a: "No. This service is presented for tax-related support and coordination. Legal questions should be handled by a qualified lawyer.",
        },
        {
          q: "Can you tailor this to our situation?",
          a: "Yes — the consultation step is designed to clarify responsibilities and define a simple plan based on your documents.",
        },
      ]}
    />
  );
}
