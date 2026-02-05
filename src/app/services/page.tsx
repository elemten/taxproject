import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Personal tax, corporate tax, and estate planning services for Saskatoon and Saskatchewan clients.",
};

export default function ServicesPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Our services
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              What we offer
            </h1>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              Focused support for Saskatoon and Saskatchewan clients.
            </p>
          </div>

          <div className="space-y-3">
            {site.serviceLines.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center justify-between rounded-full bg-brand px-6 py-5 text-base font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{s.title}</span>
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="surface-solid overflow-hidden">
            <div className="relative aspect-[16/9] w-full bg-muted">
              <Image
                src="/images/site/services-overview.webp"
                alt="Modern, minimal office interior representing tax service options"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Saskatoon • {site.province}
              </p>
              <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                A simple, premium process — built around clarity
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                We keep every engagement organized and predictable. Start with a
                checklist, then preparation, a review step, and clear next
                actions. If you’re unsure what service you need, we can guide
                you in a quick consultation.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  CONTACT US
                </Link>
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95"
                >
                  Call {site.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
