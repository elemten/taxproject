"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock3, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { easing } from "@/lib/animations";
import { site } from "@/lib/site";

type BookingConsultationCardProps = {
  className?: string;
};

type Slot = {
  id: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";
type DayPeriod = "Morning" | "Afternoon" | "Late day";
type SlotWithMeta = Slot & {
  dateKey: string;
  fullDayLabel: string;
  weekdayLabel: string;
  dayNumberLabel: string;
  timeLabel: string;
  period: DayPeriod;
};

type DateOption = {
  dateKey: string;
  fullDayLabel: string;
  weekdayLabel: string;
  dayNumberLabel: string;
  count: number;
};

const DAY_PERIOD_ORDER: DayPeriod[] = ["Morning", "Afternoon", "Late day"];

const pickBestSlots = (slots: SlotWithMeta[], max = 6) => {
  if (slots.length <= max) return slots;

  const pickedIndexes = new Set<number>();
  for (let i = 0; i < max; i += 1) {
    const index = Math.round((i * (slots.length - 1)) / (max - 1));
    pickedIndexes.add(index);
  }

  return Array.from(pickedIndexes)
    .sort((a, b) => a - b)
    .map((index) => slots[index]);
};

const groupSlotsByPeriod = (slots: SlotWithMeta[]) => {
  const map = new Map<DayPeriod, SlotWithMeta[]>();
  for (const slot of slots) {
    const group = map.get(slot.period) ?? [];
    group.push(slot);
    map.set(slot.period, group);
  }
  return DAY_PERIOD_ORDER.map((period) => ({ period, slots: map.get(period) ?? [] })).filter(
    (entry) => entry.slots.length > 0,
  );
};

export function BookingConsultationCard({ className }: BookingConsultationCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotError, setSlotError] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDateKey, setSelectedDateKey] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [showAllDates, setShowAllDates] = useState(false);
  const [showAllTimes, setShowAllTimes] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [reloadSlotsKey, setReloadSlotsKey] = useState(0);
  const [showDetailsStep, setShowDetailsStep] = useState(false);

  const timezone = process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE ?? "America/Regina";
  const serviceOptions = useMemo(
    () => [...site.serviceLines.map((service) => service.title), "General Tax Consultation"],
    [],
  );

  const hasService = Boolean(selectedService);
  const hasSlot = Boolean(selectedSlotId);
  const currentStep = !hasService ? 1 : !showDetailsStep ? 2 : 3;

  const slotMeta = useMemo(() => {
    const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: timezone,
    });
    const fullDayFormatter = new Intl.DateTimeFormat("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: timezone,
    });
    const weekdayFormatter = new Intl.DateTimeFormat("en-CA", {
      weekday: "short",
      timeZone: timezone,
    });
    const dayNumberFormatter = new Intl.DateTimeFormat("en-CA", {
      month: "short",
      day: "numeric",
      timeZone: timezone,
    });
    const timeFormatter = new Intl.DateTimeFormat("en-CA", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    });

    return slots.map((slot) => {
      const start = new Date(slot.starts_at);
      const hour = Number(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: timezone,
        }).format(start),
      );

      let period: DayPeriod = "Late day";
      if (hour < 12) period = "Morning";
      else if (hour < 15) period = "Afternoon";

      return {
        ...slot,
        dateKey: dateKeyFormatter.format(start),
        fullDayLabel: fullDayFormatter.format(start),
        weekdayLabel: weekdayFormatter.format(start),
        dayNumberLabel: dayNumberFormatter.format(start),
        timeLabel: timeFormatter.format(start),
        period,
      };
    });
  }, [slots, timezone]);

  const slotsByDate = useMemo(() => {
    const map = new Map<string, SlotWithMeta[]>();
    for (const slot of slotMeta) {
      const list = map.get(slot.dateKey) ?? [];
      list.push(slot);
      map.set(slot.dateKey, list);
    }
    return map;
  }, [slotMeta]);

  const dateOptions = useMemo<DateOption[]>(
    () =>
      Array.from(slotsByDate.entries()).map(([dateKey, daySlots]) => ({
        dateKey,
        fullDayLabel: daySlots[0].fullDayLabel,
        weekdayLabel: daySlots[0].weekdayLabel,
        dayNumberLabel: daySlots[0].dayNumberLabel,
        count: daySlots.length,
      })),
    [slotsByDate],
  );

  const visibleDateOptions = useMemo(
    () => (showAllDates ? dateOptions : dateOptions.slice(0, 6)),
    [dateOptions, showAllDates],
  );

  const daySlots = useMemo(() => slotsByDate.get(selectedDateKey) ?? [], [selectedDateKey, slotsByDate]);
  const bestSlots = useMemo(() => pickBestSlots(daySlots, 6), [daySlots]);
  const displayedSlots = showAllTimes ? daySlots : bestSlots;
  const displayedSlotGroups = useMemo(() => groupSlotsByPeriod(displayedSlots), [displayedSlots]);

  const selectedSlot = slotMeta.find((slot) => slot.id === selectedSlotId);

  useEffect(() => {
    if (!hasService) {
      if (selectedDateKey) setSelectedDateKey("");
      if (selectedSlotId) setSelectedSlotId("");
      return;
    }
    if (dateOptions.length === 0) {
      if (selectedDateKey) setSelectedDateKey("");
      return;
    }
    if (!dateOptions.some((option) => option.dateKey === selectedDateKey)) {
      setSelectedDateKey(dateOptions[0].dateKey);
      setShowAllTimes(false);
    }
  }, [dateOptions, hasService, selectedDateKey, selectedSlotId]);

  useEffect(() => {
    if (!selectedSlotId) return;
    if (!daySlots.some((slot) => slot.id === selectedSlotId)) setSelectedSlotId("");
  }, [daySlots, selectedSlotId]);

  useEffect(() => {
    if (!hasSlot && showDetailsStep) {
      setShowDetailsStep(false);
    }
  }, [hasSlot, showDetailsStep]);

  useEffect(() => {
    let cancelled = false;

    async function loadSlots() {
      setLoadingSlots(true);
      setSlotError("");

      const from = new Date();
      const to = new Date(from.getTime() + 35 * 24 * 60 * 60 * 1000);

      try {
        const response = await fetch(
          `/api/booking/slots?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`,
          { cache: "no-store" },
        );

        const result = (await response.json().catch(() => null)) as { slots?: Slot[]; error?: string } | null;
        if (!response.ok) throw new Error(result?.error ?? "Failed to fetch slots");

        if (!cancelled) {
          const nextSlots = result?.slots ?? [];
          setSlots(nextSlots);
          setSelectedSlotId((current) => (current && !nextSlots.some((slot) => slot.id === current) ? "" : current));
        }
      } catch (error) {
        if (!cancelled) setSlotError(error instanceof Error ? error.message : "Unable to load slots");
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }

    void loadSlots();
    return () => {
      cancelled = true;
    };
  }, [reloadSlotsKey]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!selectedService) {
      setSubmitState("error");
      setSubmitMessage("Please choose a service first.");
      return;
    }
    if (!selectedSlotId) {
      setSubmitState("error");
      setSubmitMessage("Please select a time slot first.");
      return;
    }

    setSubmitState("submitting");
    setSubmitMessage("");

    const formData = new FormData(form);
    const payload = {
      slotId: selectedSlotId,
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      serviceInterest: selectedService,
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/booking/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error ?? "Failed to reserve slot");

      setSubmitState("success");
      setSubmitMessage("Your booking request is confirmed. We will contact you shortly.");
      setSelectedSlotId("");
      setShowAllTimes(false);
      setShowDetailsStep(false);
      setReloadSlotsKey((v) => v + 1);
      form.reset();
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(error instanceof Error ? error.message : "Failed to reserve slot");
    }
  };

  return (
    <motion.aside
      aria-label="Book a consultation"
      className={cn(
        // Apple-ish glass surface
        "relative w-full max-w-none sm:max-w-[440px] overflow-hidden",
        "rounded-3xl border border-white/15 bg-[#F6F2E8]/95 backdrop-blur-xl",
        "shadow-[0_30px_80px_-40px_rgba(0,0,0,0.55)]",
        // layout
        "p-4 sm:p-5",
        // keep it sane inside hero + on mobile
        "max-h-[min(78vh,560px)]",
        className,
      )}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: easing.easeOutExpo }}
      whileHover={shouldReduceMotion ? {} : { y: -3 }}
    >
      {/* top accent line */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-brand/80"
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.55, delay: 0.55, ease: easing.easeOutExpo }}
        style={{ originX: 0 }}
      />

      {/* subtle inner border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

      <div className="relative flex h-full min-h-0 flex-col gap-4">
        {/* Header */}
        <div className="shrink-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand/90">
            Booking window
          </p>
          <h2 className="text-balance text-[26px] sm:text-[30px] font-semibold tracking-tight text-foreground leading-[1.08]">
            Book your free consultation
          </h2>
          <p className="text-[12px] sm:text-[13px] text-muted-foreground">
            Select service, choose a slot, then add your details.
          </p>
        </div>

        {/* Step Segmented Control */}
        <div className="shrink-0">
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white/6 p-1 ring-1 ring-white/10">
            {[
              { step: 1, label: "Service" },
              { step: 2, label: "Date & time" },
              { step: 3, label: "Details" },
            ].map((item) => {
              const active = currentStep === item.step;
              const reached = currentStep >= item.step;

              return (
                <div
                  key={item.step}
                  className={cn(
                    "rounded-xl px-2 py-2 text-center transition",
                    active
                      ? "bg-background/85 text-brand shadow-sm"
                      : "bg-transparent text-muted-foreground",
                  )}
                >
                  <p className={cn("text-[10px] font-semibold", reached ? "text-brand" : "text-muted-foreground")}>
                    {item.step}
                  </p>
                  <p className={cn("mt-0.5 text-[11px] font-medium", active ? "text-foreground" : "text-muted-foreground")}>
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body - single scroll area */}
        <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-gutter:stable]">
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="rounded-2xl bg-white/7 ring-1 ring-white/10 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Step 1 · Service
              </p>
              <select
                value={selectedService}
                onChange={(event) => {
                  setSelectedService(event.target.value);
                  setSelectedDateKey("");
                  setSelectedSlotId("");
                  setShowAllTimes(false);
                  setShowDetailsStep(false);
                  setSubmitState("idle");
                  setSubmitMessage("");
                }}
                className={cn(
                  "mt-2 h-10 w-full rounded-full px-3 text-[12px] outline-none",
                  "bg-white/90 text-foreground",
                  "ring-1 ring-black/5 focus-visible:ring-2 focus-visible:ring-ring",
                )}
                aria-label="Select service"
              >
                <option value="">Choose a service</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2 */}
            {hasService && !showDetailsStep ? (
              <div className="rounded-2xl bg-white/7 ring-1 ring-white/10 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Step 2 · Date
                  </p>
                  {dateOptions.length > 6 ? (
                    <button
                      type="button"
                      className="text-[11px] font-semibold text-brand hover:underline"
                      onClick={() => setShowAllDates((c) => !c)}
                    >
                      {showAllDates ? "Show fewer" : "Show more"}
                    </button>
                  ) : null}
                </div>

                {loadingSlots ? (
                  <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading available slots...
                  </div>
                ) : slotError ? (
                  <p className="mt-3 text-[12px] font-medium text-red-700">{slotError}</p>
                ) : dateOptions.length === 0 ? (
                  <p className="mt-3 text-[12px] text-muted-foreground">
                    No open slots in the next few weeks. Please call us.
                  </p>
                ) : (
                  <>
                    {/* Date chips */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {visibleDateOptions.map((option) => {
                        const selected = option.dateKey === selectedDateKey;
                        return (
                          <button
                            key={option.dateKey}
                            type="button"
                            className={cn(
                              "shrink-0 rounded-2xl px-3 py-2 text-left transition",
                              "min-w-[5.5rem] border",
                              selected
                                ? "bg-[#F2C44C] border-[#DBAF38]"
                                : "bg-white/40 border-white/20 hover:bg-white/55",
                            )}
                            onClick={() => {
                              setSelectedDateKey(option.dateKey);
                              setShowAllTimes(false);
                              setShowDetailsStep(false);
                            }}
                          >
                            <p className="text-[11px] font-semibold text-foreground">{option.weekdayLabel}</p>
                            <p className="text-[11px] text-muted-foreground">{option.dayNumberLabel}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Slots */}
                    <div className="mt-3 rounded-2xl bg-white/80 ring-1 ring-black/5 p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                          <CalendarDays className="size-4" />
                          {dateOptions.find((o) => o.dateKey === selectedDateKey)?.fullDayLabel}
                        </p>
                        {daySlots.length > bestSlots.length ? (
                          <button
                            type="button"
                            onClick={() => setShowAllTimes((c) => !c)}
                            className="text-[11px] font-semibold text-brand hover:underline"
                          >
                            {showAllTimes ? "Best" : `All (${daySlots.length})`}
                          </button>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        {displayedSlotGroups.map((group) => (
                          <div key={group.period}>
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                              {group.period}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {group.slots.map((slot) => {
                                const selected = slot.id === selectedSlotId;
                                return (
                                  <button
                                    key={slot.id}
                                    type="button"
                                    className={cn(
                                      "inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-medium transition",
                                      "border",
                                      selected
                                        ? "bg-[#F2C44C] text-brand border-[#DBAF38]"
                                        : "bg-white text-muted-foreground border-black/10 hover:text-foreground",
                                    )}
                                    onClick={() => {
                                      setSelectedSlotId(slot.id);
                                      setShowDetailsStep(false);
                                    }}
                                  >
                                    {slot.timeLabel}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {hasSlot ? (
                      <button
                        type="button"
                        onClick={() => setShowDetailsStep(true)}
                        className={cn(
                          "mt-3 inline-flex h-10 w-full items-center justify-center rounded-full px-5 text-[13px] font-semibold",
                          "bg-[#F2C44C] text-brand shadow-sm transition hover:brightness-95",
                        )}
                      >
                        Book this slot
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}

            {/* Step 3 */}
            {hasService && showDetailsStep && hasSlot ? (
              <>
                <div className="rounded-2xl bg-white/7 ring-1 ring-white/10 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Step 2 · Selected Slot
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-[12px] text-foreground">
                    <Clock3 className="size-4" />
                    {new Date(selectedSlot!.starts_at).toLocaleString("en-CA", { timeZone: timezone })}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDetailsStep(false)}
                    className="mt-2 text-[11px] font-semibold text-brand hover:underline"
                  >
                    Change slot
                  </button>
                </div>

                <form className="space-y-2.5 rounded-2xl bg-white/7 ring-1 ring-white/10 p-3" onSubmit={handleSubmit}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Step 3 · Your details
                  </p>

                  {["fullName", "email", "phone"].map((name) => (
                    <input
                      key={name}
                      name={name}
                      type={name === "email" ? "email" : "text"}
                      required
                      placeholder={name === "fullName" ? "Full name" : name === "email" ? "Email" : "Phone"}
                      className={cn(
                        "h-10 w-full rounded-full px-3 text-[12px] outline-none",
                        "bg-white/90 text-foreground",
                        "ring-1 ring-black/5 focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                    />
                  ))}

                  <textarea
                    name="message"
                    rows={2}
                    placeholder="Notes (optional)"
                    className={cn(
                      "w-full rounded-2xl px-3 py-2 text-[12px] outline-none",
                      "bg-white/90 text-foreground",
                      "ring-1 ring-black/5 focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  />

                  <button
                    type="submit"
                    disabled={submitState === "submitting" || loadingSlots}
                    className={cn(
                      "inline-flex h-10 w-full items-center justify-center gap-2 rounded-full px-5 text-[13px] font-semibold",
                      "bg-brand text-brand-foreground shadow-sm",
                      "transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70",
                    )}
                  >
                    {submitState === "submitting" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Reserving...
                      </>
                    ) : (
                      "Reserve spot"
                    )}
                  </button>
                </form>
              </>
            ) : null}

            {submitState === "success" ? (
              <p className="flex items-center gap-2 text-[12px] font-medium text-emerald-700">
                <CheckCircle2 className="size-4" />
                {submitMessage}
              </p>
            ) : null}

            {submitState === "error" ? (
              <p className="text-[12px] font-medium text-red-700">{submitMessage}</p>
            ) : null}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
