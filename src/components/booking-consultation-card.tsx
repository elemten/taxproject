"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Clock3, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { easing } from "@/lib/animations";

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

export function BookingConsultationCard({
  className,
}: BookingConsultationCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotError, setSlotError] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [reloadSlotsKey, setReloadSlotsKey] = useState(0);

  const timezone = process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE ?? "America/Regina";

  const slotGroups = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      weekday: "short",
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

    const groups = new Map<string, Array<Slot & { timeLabel: string }>>();
    for (const slot of slots) {
      const start = new Date(slot.starts_at);
      const dayLabel = formatter.format(start);
      const timeLabel = timeFormatter.format(start);
      const list = groups.get(dayLabel) ?? [];
      list.push({ ...slot, timeLabel });
      groups.set(dayLabel, list);
    }

    return Array.from(groups.entries()).map(([dayLabel, daySlots]) => ({
      dayLabel,
      daySlots,
    }));
  }, [slots, timezone]);

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

  useEffect(() => {
    let cancelled = false;

    async function loadSlots() {
      setLoadingSlots(true);
      setSlotError("");

      const from = new Date();
      const to = new Date(from.getTime() + 21 * 24 * 60 * 60 * 1000);

      try {
        const response = await fetch(
          `/api/booking/slots?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`,
          { cache: "no-store" },
        );

        const result = (await response.json().catch(() => null)) as
          | { slots?: Slot[]; error?: string }
          | null;

        if (!response.ok) {
          throw new Error(result?.error ?? "Failed to fetch slots");
        }

        if (!cancelled) {
          const nextSlots = result?.slots ?? [];
          setSlots(nextSlots);
          setSelectedSlotId((current) =>
            current && !nextSlots.some((slot) => slot.id === current) ? "" : current,
          );
        }
      } catch (error) {
        if (!cancelled) {
          setSlotError(error instanceof Error ? error.message : "Unable to load slots");
        }
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    }

    void loadSlots();

    return () => {
      cancelled = true;
    };
  }, [reloadSlotsKey]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedSlotId) {
      setSubmitState("error");
      setSubmitMessage("Please select a time slot first.");
      return;
    }

    setSubmitState("submitting");
    setSubmitMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      slotId: selectedSlotId,
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      serviceInterest: String(formData.get("serviceInterest") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/booking/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "Failed to reserve slot");
      }

      setSubmitState("success");
      setSubmitMessage("Your booking request is confirmed. We will contact you shortly.");
      setSelectedSlotId("");
      setReloadSlotsKey((value) => value + 1);
      e.currentTarget.reset();
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(error instanceof Error ? error.message : "Failed to reserve slot");
    }
  };

  return (
    <motion.aside
      className={cn(
        "surface-solid relative w-full max-w-[360px] p-6 shadow-xl",
        className,
      )}
      aria-label="Book a consultation"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: easing.easeOutExpo }}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand"
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: easing.easeOutExpo }}
        style={{ originX: 0 }}
      />

      <div className="relative space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
            Booking window
          </p>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Book your free consultation
          </h2>
          <p className="text-[11px] text-muted-foreground">Select a day and time to reserve your spot.</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/40 p-3">
          {loadingSlots ? (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Loading available slots...
            </div>
          ) : slotError ? (
            <p className="text-[11px] font-medium text-red-700">{slotError}</p>
          ) : slotGroups.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">No open slots in the next few weeks. Please call us.</p>
          ) : (
            <div className="max-h-44 space-y-3 overflow-auto pr-1">
              {slotGroups.map((group) => (
                <div key={group.dayLabel} className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {group.dayLabel}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.daySlots.map((slot) => {
                      const selected = slot.id === selectedSlotId;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                            selected
                              ? "border-brand bg-brand/15 text-brand"
                              : "border-border bg-white text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => setSelectedSlotId(slot.id)}
                        >
                          {slot.timeLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <input
            name="fullName"
            required
            placeholder="Full name"
            className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            name="phone"
            required
            placeholder="Phone"
            className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            name="serviceInterest"
            placeholder="Service (optional)"
            className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <textarea
            name="message"
            rows={2}
            placeholder="Notes (optional)"
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          <button
            type="submit"
            disabled={submitState === "submitting" || loadingSlots}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-brand px-5 text-[13px] font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitState === "submitting" ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Reserving...
              </>
            ) : (
              "Reserve spot"
            )}
          </button>

          {selectedSlot ? (
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock3 className="size-3" />
              Selected slot: {new Date(selectedSlot.starts_at).toLocaleString("en-CA", { timeZone: timezone })}
            </p>
          ) : null}

          {submitState === "success" ? (
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
              <CheckCircle2 className="size-3.5" />
              {submitMessage}
            </p>
          ) : null}

          {submitState === "error" ? (
            <p className="text-[11px] font-medium text-red-700">{submitMessage}</p>
          ) : null}
        </form>
      </div>
    </motion.aside>
  );
}
