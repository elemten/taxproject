import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { LeadForm } from "@/components/lead-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact TrustEdge Tax Services in Saskatoon, Saskatchewan to book a consultation for personal tax, corporate tax, or estate management services.",
};

export default function ContactPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-6">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s make this simple"
            description="Tell us what you need and we’ll reply with next steps and a checklist. (Mockup: submissions are not connected yet.)"
          />

          <div className="surface-solid p-6">
            <p className="text-sm font-semibold">Contact details</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="size-4" aria-hidden="true" />
                <span>{site.locationShort}</span>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-2 link-muted"
                  href={`tel:${site.phone}`}
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-2 link-muted"
                  href={`mailto:${site.email}`}
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
              <li className="text-xs">
                <span className="text-muted-foreground">Hours: </span>
                <span className="text-foreground/90">{site.hours}</span>
              </li>
            </ul>
          </div>

          <div className="surface-solid p-6">
            <p className="text-sm font-semibold">Service area</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Serving Saskatoon and clients across {site.province}. Canada-only.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div>
            <LeadForm
              title="Contact form"
              subtitle="We’ll follow up with next steps and a simple checklist."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
