"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/badge";

type LeadFormProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function LeadForm({ title, subtitle, className }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const formId = useId();
  const statusText = useMemo(() => {
    if (status === "sent") return "Thanks — we'll get back to you soon.";
    return "This is a design mockup. Submissions are not sent yet.";
  }, [status]);

  return (
    <form
      className={cn(
        "relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("sent");
      }}
      aria-describedby={`${formId}-status`}
    >
      {/* Decorative top accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <Badge variant="brand">Quick request</Badge>
          <div className="space-y-1">
            <p className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </p>
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Response in 1 business day</Badge>
            <Badge variant="default">No obligation</Badge>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {subtitle ? <p className="sr-only">{subtitle}</p> : null}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name"
              name="name"
              autoComplete="name"
              placeholder="Jane Smith"
            />
            <Field
              label="Phone"
              name="phone"
              autoComplete="tel"
              placeholder="(306) 555-0123"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className="sm:col-span-2"
            />
            <Field
              label="How can we help?"
              name="message"
              as="textarea"
              placeholder="Tell us what you need help with."
              className="sm:col-span-2"
            />
          </div>
        </div>

        {/* Submit Section */}
        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Request a callback
          </button>
          <p
            id={`${formId}-status`}
            className={cn(
              "mt-4 text-center text-xs text-muted-foreground",
              status === "sent" && "text-foreground/80",
            )}
          >
            {statusText}
          </p>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  as,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  as?: "input" | "textarea";
  placeholder?: string;
  className?: string;
}) {
  const inputClass =
    "mt-2 w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:border-brand/40 focus-visible:bg-white focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <label
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
    >
      <span>{label}</span>
      {as === "textarea" ? (
        <textarea
          name={name}
          rows={4}
          className={inputClass}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
      ) : (
        <input
          name={name}
          type={type ?? "text"}
          className={inputClass}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}
