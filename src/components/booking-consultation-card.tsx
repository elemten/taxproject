"use client";

import { useMemo } from "react";
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
  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const firstWeekdayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", {
        month: "long",
        year: "numeric",
      }).format(new Date(currentYear, currentMonth, 1)),
    [currentMonth, currentYear],
  );

  const availableDays = useMemo(() => {
    const days = new Set<number>();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const weekday = new Date(currentYear, currentMonth, day).getDay();
      if (weekday === 2 || weekday === 4) {
        days.add(day);
      }
    }
    return days;
  }, [currentMonth, currentYear, daysInMonth]);

  const calendarCells = useMemo(
    () => [
      ...Array.from({ length: firstWeekdayOfMonth }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ],
    [daysInMonth, firstWeekdayOfMonth],
  );

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
          <div
            className="flex items-center justify-between"
            role="img"
            aria-label={`Preview calendar for ${monthLabel}. Highlighted days represent sample availability.`}
          >
            <span
              className="inline-flex size-7 items-center justify-center rounded-full bg-white/75 text-muted-foreground shadow-sm"
              aria-hidden="true"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </span>

            <div className="text-[11px] font-semibold text-foreground">
              {monthLabel}
            </div>

            <span
              className="inline-flex size-7 items-center justify-center rounded-full bg-white/75 text-muted-foreground shadow-sm"
              aria-hidden="true"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </span>
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
            {calendarCells.map((day, index) => {
              if (day === null) {
                return <span key={`empty-${index}`} className="h-6" aria-hidden="true" />;
              }
              const isAvailable = availableDays.has(day);
              return (
                <div
                  key={day}
                  className={cn(
                    "flex h-6 items-center justify-center rounded-md text-[10px] font-semibold tabular-nums",
                    isAvailable
                      ? "bg-brand/15 text-brand"
                      : "bg-white/75 text-muted-foreground",
                  )}
                  aria-hidden="true"
                >
                  {day}
                </div>
              );
            })}
          </motion.div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Available</span>
            <span>Local timezone</span>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-full bg-brand px-5 text-[13px] font-semibold text-brand-foreground shadow-sm opacity-70"
          aria-hidden="true"
          initial={shouldReduceMotion ? { opacity: 0.7 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          Book consultation
        </motion.div>

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
