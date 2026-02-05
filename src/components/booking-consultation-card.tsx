"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { easing } from "@/lib/animations";

type BookingConsultationCardProps = {
  className?: string;
};

export function BookingConsultationCard({
  className,
}: BookingConsultationCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"] as const;
  const days = Array.from({ length: 28 }, (_, index) => index + 1);
  const availableDays = new Set([3, 5, 8, 10, 12, 17, 19, 24, 26]);

  return (
    <motion.aside
      className={cn(
        "surface-solid relative w-full max-w-[320px] p-6 shadow-xl backdrop-blur-xl",
        className,
      )}
      aria-label="Booking consultation preview"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: easing.easeOutExpo }}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
    >
      {/* Decorative top accent */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand"
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: easing.easeOutExpo }}
        style={{ originX: 0 }}
      />

      {/* Content */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <motion.span
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            Booking preview
          </motion.span>
          <span className="text-[11px] font-semibold text-muted-foreground">
            Free • 15–30 min
          </span>
        </div>

        <motion.h3
          className="mt-4 text-sm font-semibold tracking-tight text-foreground"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          Book your free consultation.
        </motion.h3>
        <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
          Pick an available date. (Preview only)
        </p>

        <motion.div
          className="mt-4 overflow-hidden rounded-2xl bg-muted p-3"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex size-7 cursor-not-allowed items-center justify-center rounded-full bg-white/75 text-muted-foreground shadow-sm"
              aria-label="Previous month (preview)"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>

            <div className="text-[11px] font-semibold text-foreground">
              February 2026
            </div>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex size-7 cursor-not-allowed items-center justify-center rounded-full bg-white/75 text-muted-foreground shadow-sm"
              aria-label="Next month (preview)"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[9px] font-semibold text-muted-foreground">
            {weekDays.map((label, index) => (
              <div key={`${label}-${index}`} className="py-0.5">
                {label}
              </div>
            ))}
          </div>

          <motion.div
            className="mt-1.5 grid grid-cols-7 gap-1"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          >
            {days.map((day) => {
              const isAvailable = availableDays.has(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled
                  aria-disabled="true"
                  className={cn(
                    "flex h-6 cursor-not-allowed items-center justify-center rounded-md text-[10px] font-semibold tabular-nums",
                    isAvailable
                      ? "bg-brand/15 text-brand"
                      : "bg-white/75 text-muted-foreground",
                  )}
                  aria-label={
                    isAvailable
                      ? `Day ${day} available (preview)`
                      : `Day ${day} unavailable (preview)`
                  }
                >
                  {day}
                </button>
              );
            })}
          </motion.div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Available</span>
            <span>Local timezone</span>
          </div>
        </motion.div>

        <motion.button
          type="button"
          disabled
          aria-disabled="true"
          className="mt-4 inline-flex h-9 w-full cursor-not-allowed items-center justify-center rounded-full bg-brand px-5 text-[13px] font-semibold text-brand-foreground shadow-sm opacity-70"
          initial={shouldReduceMotion ? { opacity: 0.7 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          Book consultation
        </motion.button>

        <motion.p
          className="mt-2 text-[10px] text-muted-foreground"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          Preview only — booking not connected yet.
        </motion.p>
      </div>
    </motion.aside>
  );
}
