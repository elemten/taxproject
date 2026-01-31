"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type LeadFormProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function LeadForm({ title, subtitle, className }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const formId = useId();
  const statusText = useMemo(() => {
    if (status === "sent") return "Thanks — we’ll get back to you soon.";
    return "This is a design mockup. Submissions are not sent yet.";
  }, [status]);

  return (
    <form
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] sm:p-7",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("sent");
      }}
      aria-describedby={`${formId}-status`}
    >
      <div className="pointer-events-none absolute -right-24 -top-20 size-64 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-10 size-64 rounded-full bg-slate-100 blur-3xl" />

      <div className="relative space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand">
          Quick request
        </div>
        <div className="space-y-1">
          <p className="text-xl font-semibold tracking-tight text-slate-900">
            {title}
          </p>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5">
            Response in 1 business day
          </span>
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5">
            No obligation consultation
          </span>
        </div>
      </div>

      <div className="relative space-y-4 pt-1">
        {subtitle ? <p className="sr-only">{subtitle}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2">
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

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-[0_12px_24px_-16px_rgba(184,155,45,0.8)] transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Request a callback
        </button>
        <p
          id={`${formId}-status`}
          className={cn(
            "text-xs text-muted-foreground sm:max-w-[220px]",
            status === "sent" && "text-foreground/80",
          )}
        >
          {statusText}
        </p>
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
    "mt-2 w-full rounded-[18px] border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:border-brand/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <label
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.18em] text-slate-600",
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
