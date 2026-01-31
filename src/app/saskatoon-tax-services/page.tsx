import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Saskatoon Tax Services",
  description:
    "Saskatoon tax services for personal tax, corporate tax, and estate management services. A clear checklist-driven process for Saskatchewan clients.",
  alternates: { canonical: "/saskatoon-tax-services" },
};

export default function SaskatoonTaxServicesPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <SectionHeading
            eyebrow="Local Service"
            title="Saskatoon tax services with a premium, checklist-driven process"
            description="TrustEdge Tax Services is built for Saskatchewan clients who want clarity, calm communication, and an organized workflow."
          />

          <div className="surface-solid p-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="size-4 text-brand" aria-hidden="true" />
              <span>Saskatoon, SK</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Serving Saskatoon and clients across {site.province}. Canada-only.
            </p>
          </div>

          <div className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              If you’re looking for Saskatoon tax services, you likely want two
              things: clear requirements and an easy process. We structure every
              engagement around a simple checklist and a review step before
              filing.
            </p>
            <p>
              Our focus areas are personal tax, corporate tax, and estate
              management services. If you’re unsure what fits, a short consult
              can clarify the next step.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/#book"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Book a consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Explore services
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="surface-solid p-8">
            <p className="text-sm font-semibold">Quick links</p>
            <div className="mt-4 space-y-2 text-sm">
              {site.serviceLines.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="flex items-center justify-between rounded-[--radius-md] border bg-white px-4 py-3 shadow-sm transition-colors hover:bg-muted"
                >
                  <span className="font-medium">{s.title}</span>
                  <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
