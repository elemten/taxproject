import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type ServiceFaq = { q: string; a: string };

export function ServicePage({
  title,
  intro,
  whoFor,
  included,
  bring,
  faqs,
  imageSrc,
  imageAlt,
}: {
  title: string;
  intro: string;
  whoFor: string[];
  included: string[];
  bring: string[];
  faqs: ServiceFaq[];
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="grid gap-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Services
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
            {intro}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/#book"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Book a consultation
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border bg-white px-6 text-sm font-semibold shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contact us
            </Link>
          </div>
        </div>

        {imageSrc ? (
          <div className="surface-solid overflow-hidden">
            <div className="relative aspect-[16/7] w-full bg-muted">
              <Image
                src={imageSrc}
                alt={imageAlt ?? `${title} image placeholder`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <h2 className="text-lg font-semibold tracking-tight">
              Who this is for
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {whoFor.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2
                    className="mt-0.5 size-5 text-brand"
                    aria-hidden="true"
                  />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="lg:col-span-7">
            <h2 className="text-lg font-semibold tracking-tight">
              What’s included
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <div
                  key={item}
                  className="rounded-[--radius-md] border bg-muted p-4 text-sm text-muted-foreground"
                >
                  <p className="font-medium text-foreground/90">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold tracking-tight">
              What to bring
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              A simple starting checklist. We’ll confirm anything specific
              during the consultation.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {bring.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2
                    className="mt-0.5 size-5 text-brand"
                    aria-hidden="true"
                  />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold tracking-tight">FAQs</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="rounded-[--radius-md] border bg-muted px-4 py-3"
                >
                  <summary className="cursor-pointer select-none text-sm font-semibold">
                    {item.q}
                  </summary>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Card>
        </div>

        <div className="surface-solid p-8 sm:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold tracking-tight">
                Ready to get started?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Book a consultation and we’ll confirm next steps.
              </p>
            </div>
            <Link
              href="/#book"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Book now <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("surface-solid p-6", className)}>{children}</div>;
}
