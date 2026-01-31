import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { ServiceCard } from "@/components/service-card";
import { LeadForm } from "@/components/lead-form";
import { TeamCard } from "@/components/team-card";
import { BookingConsultationCard } from "@/components/booking-consultation-card";

export default function Home() {
  return (
    <>
      <section className="relative bg-muted">
        <div className="relative h-[560px] w-full overflow-hidden">
          {/* Light gradient overlay for subtle depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-muted to-white" />
          
          {/* Subtle pattern/texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,155,45,0.08),transparent_50%)]" />

          <div className="relative h-full">
            <div className="container-page grid h-full items-center gap-10 lg:grid-cols-12">
              <div className="max-w-2xl space-y-5 lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  Expert tax services
                </p>
                <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Accurate & reliable tax filing for {site.locationShort}
                </h1>
                <p className="max-w-xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base">
                  Personal tax, corporate tax, and estate management services —
                  with a clear checklist, careful review, and calm communication.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/contact"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    CONTACT US
                  </Link>
                  <a
                    href={`tel:${site.phone}`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
                  >
                    Call {site.phone}
                  </a>
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-5 lg:justify-self-end">
                <div className="relative">
                  <BookingConsultationCard className="shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-14 sm:py-20">
          <div className="space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Our services
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Focused solutions for individuals, businesses, and families
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <ServiceCard
                title="Personal Tax"
                description="Clean, checklist-driven filing with a calm, professional experience built for Saskatchewan clients."
                href="/services/personal-tax"
                imageSrc="/illustrations/personal-tax.svg"
                imageAlt="Vector illustration for personal tax services"
                ctaLabel="READ MORE"
              />
              <ServiceCard
                title="Corporate Tax"
                description="A structured workflow to keep business documents organized, review-ready, and CRA-ready."
                href="/services/corporate-tax"
                imageSrc="/illustrations/corporate-tax.svg"
                imageAlt="Vector illustration for corporate tax services"
                ctaLabel="READ MORE"
              />
              <ServiceCard
                title="Estate Management"
                description="Professional handling and coordination for estate-related tax needs with clear next steps."
                href="/services/estate-management"
                imageSrc="/illustrations/estate-management.svg"
                imageAlt="Vector illustration for estate management services"
                ctaLabel="READ MORE"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="container-page py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Our expertise in finance and taxation
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Get to know about <span className="text-brand">our company</span>
              </h2>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                At TrustEdge Tax Services, we focus on personal tax, corporate
                tax, and estate management services — delivered with a clear,
                premium process.
              </p>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                We keep the workflow simple: checklist, preparation, review, and
                a clear next step. Built for Saskatoon and Saskatchewan clients.
              </p>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                CONTACT US
              </Link>
            </div>
            <div className="lg:col-span-6">
              <div className="surface-solid overflow-hidden">
                <div className="relative aspect-[3/2] w-full bg-white">
                  <Image
                    src="/illustrations/about.svg"
                    alt="Illustration representing TrustEdge Tax Services"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-14 sm:py-20">
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Our <span className="text-brand">team</span>
              </h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Meet the experts behind TrustEdge
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <TeamCard
                name={site.personName}
                role="Tax Professional"
                points={[
                  "Client coordination and filing support",
                  "Saskatchewan-focused workflow",
                  "Clear checklist-driven process",
                ]}
              />
              <TeamCard
                name="Priya Sharma"
                role="Corporate Support"
                points={[
                  "Year-end readiness support",
                  "Document organization",
                  "CRA-ready preparation process",
                ]}
              />
              <TeamCard
                name="Michael Chen"
                role="Client Support"
                points={[
                  "Scheduling and follow-ups",
                  "Document intake assistance",
                  "Fast, friendly communication",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="book" className="bg-muted">
        <div className="container-page py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Book a consultation
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Request an appointment
              </h2>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                Placeholder booking section for the mockup. Once the design is
                approved, we can connect it to your preferred booking tool or a
                simple lead capture system.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Call {site.phone}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Contact form
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div>
                <LeadForm
                  title="Quick request"
                  subtitle="Leave your details and we’ll reply with next steps."
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Note: This is a mockup site — submissions are not connected to a
                backend yet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
