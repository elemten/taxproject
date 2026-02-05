"use client";

import { useId, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { easing } from "@/lib/animations";

type LeadFormProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function LeadForm({ title, subtitle, className }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const formId = useId();
  const shouldReduceMotion = useReducedMotion();
  
  const statusText = useMemo(() => {
    if (status === "sending") return "Sending...";
    if (status === "sent") return "Thanks — we'll get back to you soon.";
    return "This is a design mockup. Submissions are not sent yet.";
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate API call
    setTimeout(() => {
      setStatus("sent");
    }, 1500);
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
      {/* Decorative top accent */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand"
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: easing.easeOutExpo }}
        style={{ originX: 0 }}
      />

      <div className="relative space-y-6">
        {/* Header */}
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

        {/* Form Fields */}
        <div className="space-y-5">
          {subtitle ? <p className="sr-only">{subtitle}</p> : null}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name"
              name="name"
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
              label="How can we help?"
              name="message"
              as="textarea"
              placeholder="Tell us what you need help with."
              className="sm:col-span-2"
              delay={0.25}
            />
          </div>
        </div>

        {/* Submit Section */}
        <motion.div
          className="pt-2"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground shadow-md transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={shouldReduceMotion || status !== "idle" ? {} : { scale: 1.02, y: -2 }}
            whileTap={shouldReduceMotion || status !== "idle" ? {} : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <AnimatePresence mode="wait">
              {status === "sending" ? (
                <motion.span
                  key="sending"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="size-4 animate-spin" />
                  Sending...
                </motion.span>
              ) : status === "sent" ? (
                <motion.span
                  key="sent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Check className="size-4" />
                  Sent!
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Request a callback
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          
          <div
            id={`${formId}-status`}
            className="mt-4 text-center"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={status}
                className={cn(
                  "text-xs",
                  status === "sent"
                    ? "text-green-600 font-medium"
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
    </motion.label>
  );
}
