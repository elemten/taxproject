import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { TeamCard } from "@/components/team-card";

export const metadata: Metadata = {
  title: "About",
  description:
    "TrustEdge Tax Services is a Saskatchewan-focused tax service built around a clear process and premium client experience.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-muted">
        <div className="container-page py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Our expertise in finance and taxation
              </p>
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Get to know about <span className="text-brand">our company</span>
              </h1>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                TrustEdge Tax Services focuses on personal tax, corporate tax,
                and estate management services for Saskatchewan clients —
                delivered with a calm, checklist-driven process.
              </p>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                This site is a mockup to approve layout, content flow, and a
                premium minimal look before connecting any backend systems.
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

            <div className="lg:col-span-6">
              <div className="surface-solid overflow-hidden">
                <div className="relative aspect-[3/2] w-full bg-white">
                  <Image
                    src="/illustrations/about.svg"
                    alt="Illustration representing TrustEdge Tax Services"
                    fill
                    className="object-cover"
                    priority
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
    </>
  );
}
