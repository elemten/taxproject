import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type BookingConsultationCardProps = {
  className?: string;
};

export function BookingConsultationCard({
  className,
}: BookingConsultationCardProps) {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"] as const;
  const days = Array.from({ length: 28 }, (_, index) => index + 1);
  const availableDays = new Set([3, 5, 8, 10, 12, 17, 19, 24, 26]);

  return (
    <aside
      className={cn("relative w-full max-w-[320px]", className)}
      aria-label="Booking consultation preview"
    >
      {/* Main shell */}
      <div className="relative isolate overflow-hidden rounded-[22px] bg-zinc-950 p-4 text-white">

        {/* Top hairline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />

        {/* Content */}
        <div className="relative flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90">
              <Sparkles className="size-3.5 text-brand" aria-hidden="true" />
              Booking preview
            </span>
            <span className="text-[11px] font-semibold text-white/65">
              Free • 15–30 min
            </span>
          </div>

          <h3 className="mt-3 text-sm font-semibold tracking-tight">
            Book your free consultation.
          </h3>
          <p className="mt-1 text-[11px] leading-4 text-white/65">
            Pick an available date. (Preview only)
          </p>

          <div className="mt-3 overflow-hidden rounded-[16px] border border-white/12 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex size-7 cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70"
                aria-label="Previous month (preview)"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>

              <div className="text-[11px] font-semibold text-white/85">
                February 2026
              </div>

              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex size-7 cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70"
                aria-label="Next month (preview)"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[9px] font-semibold text-white/50">
              {weekDays.map((label, index) => (
                <div key={`${label}-${index}`} className="py-0.5">
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-1.5 grid grid-cols-7 gap-1">
              {days.map((day) => {
                const isAvailable = availableDays.has(day);
                return (
                  <button
                    key={day}
                    type="button"
                    disabled
                    aria-disabled="true"
                    className={cn(
                      "flex h-6 cursor-not-allowed items-center justify-center rounded-[9px] text-[10px] font-semibold tabular-nums",
                      isAvailable
                        ? "border border-brand/35 bg-brand/20 text-white"
                        : "border border-white/8 bg-white/5 text-white/40",
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
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-white/55">
              <span>Available</span>
              <span>Local timezone</span>
            </div>
          </div>

          <button
            type="button"
            disabled
            aria-disabled="true"
            className="mt-4 inline-flex h-9 w-full cursor-not-allowed items-center justify-center rounded-full bg-brand px-5 text-[13px] font-semibold text-brand-foreground shadow-sm opacity-85"
          >
            Book consultation
          </button>

          <p className="mt-2 text-[10px] text-white/50">
            Preview only — booking not connected yet.
          </p>
        </div>
      </div>
    </aside>
  );
}
