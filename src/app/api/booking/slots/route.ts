import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";

export const runtime = "edge";

const MAX_RANGE_DAYS = 120;

export async function GET(request: NextRequest) {
  const now = new Date();
  const defaultFrom = now.toISOString();
  const defaultTo = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString();

  const from = request.nextUrl.searchParams.get("from") ?? defaultFrom;
  const to = request.nextUrl.searchParams.get("to") ?? defaultTo;

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return jsonError("Invalid date range", 400);
  }

  if (toDate <= fromDate) {
    return jsonError("'to' must be after 'from'", 400);
  }

  const rangeDays = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
  if (rangeDays > MAX_RANGE_DAYS) {
    return jsonError(`Date range cannot exceed ${MAX_RANGE_DAYS} days`, 400);
  }

  const supabase = getSupabaseServiceClient();

  const [slotsResult, bookedResult] = await Promise.all([
    supabase
      .from("booking_slots")
      .select("id, starts_at, ends_at, timezone")
      .eq("is_active", true)
      .gte("starts_at", fromDate.toISOString())
      .lte("starts_at", toDate.toISOString())
      .order("starts_at", { ascending: true }),
    supabase
      .from("bookings")
      .select("slot_id")
      .eq("status", "booked"),
  ]);

  if (slotsResult.error) {
    return jsonError(`Failed to fetch booking slots: ${slotsResult.error.message}`, 500);
  }

  if (bookedResult.error) {
    return jsonError(`Failed to fetch booking reservations: ${bookedResult.error.message}`, 500);
  }

  const bookedSlotIds = new Set((bookedResult.data ?? []).map((row) => row.slot_id));
  const slots = (slotsResult.data ?? []).filter((slot) => !bookedSlotIds.has(slot.id));

  return NextResponse.json(
    {
      slots,
    },
    {
      headers: noStoreHeaders(),
    },
  );
}
