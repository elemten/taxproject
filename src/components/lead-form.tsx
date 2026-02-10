"use client";

import { useId, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { easing } from "@/lib/animations";

type LeadFormProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

type FormState = "idle" | "submitting" | "success" | "error";

export function LeadForm({ title, subtitle, className }: LeadFormProps) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formId = useId();
  const shouldReduceMotion = useReducedMotion();

  const statusText = useMemo(() => {
    if (formState === "success") {
      return "Thanks. Your request has been received. Our team will follow up shortly.";
    }

    if (formState === "error") {
      return errorMessage || "Unable to send your request right now. Please try again.";
    }

    return "For the fastest response, call or email us directly and we will confirm next steps right away.";
  }, [formState, errorMessage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      serviceInterest: String(formData.get("serviceInterest") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Failed to submit form");
      }

      e.currentTarget.reset();
      setFormState("success");
    } catch (error) {
      setFormState("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit form");
    }
  };

  return (
    <motion.form
      className={cn(
        "surface-solid relative overflow-hidden p-8 shadow-xl",
        className,
      )}
      onSubmit={handleSubmit}
      aria-describedby={`${formId}-status`}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: easing.easeOutExpo }}
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand"
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: easing.easeOutExpo }}
        style={{ originX: 0 }}
      />

      <div className="relative space-y-6">
        <motion.div
          className="space-y-3"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
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
        </motion.div>

        <div className="space-y-5">
          {subtitle ? <p className="sr-only">{subtitle}</p> : null}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name"
              name="fullName"
              autoComplete="name"
              placeholder="Jane Smith"
              delay={0.1}
            />
            <Field
              label="Phone"
              name="phone"
              autoComplete="tel"
              placeholder="(306) 555-0123"
              delay={0.15}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className="sm:col-span-2"
              delay={0.2}
            />
            <Field
              label="Service"
              name="serviceInterest"
              placeholder="Personal Tax, Corporate Tax, Estate Planning"
              className="sm:col-span-2"
              delay={0.25}
            />
            <Field
              label="How can we help?"
              name="message"
              as="textarea"
              placeholder="Tell us what you need help with."
              className="sm:col-span-2"
              delay={0.3}
            />
          </div>
        </div>

        <motion.div
          className="pt-2"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <motion.button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground shadow-md transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            disabled={formState === "submitting"}
          >
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {formState === "submitting" ? "Submitting..." : "Submit request"}
            </motion.span>
          </motion.button>

          <div
            id={`${formId}-status`}
            className="mt-4 text-center"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={formState}
                className={cn(
                  "text-xs",
                  formState === "success"
                    ? "font-medium text-emerald-700"
                    : formState === "error"
                      ? "font-medium text-red-700"
                      : "text-muted-foreground",
                )}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: easing.easeOutExpo }}
              >
                {statusText}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.form>
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
  delay = 0,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  as?: "input" | "textarea";
  placeholder?: string;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const inputClass =
    "mt-2 w-full rounded-[--radius-md] border border-border bg-white/70 px-4 py-3.5 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:border-brand/35 focus-visible:bg-white/80 focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <motion.label
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: easing.easeOutExpo }}
    >
      <span>{label}</span>
      {as === "textarea" ? (
        <textarea
          name={name}
          rows={4}
          className={inputClass}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={name !== "serviceInterest"}
        />
      ) : (
        <input
          name={name}
          type={type ?? "text"}
          className={inputClass}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={name !== "serviceInterest"}
        />
      )}
    </motion.label>
  );
}
