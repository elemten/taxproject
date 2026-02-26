import { NextRequest, NextResponse } from "next/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";
import { bookingReserveSchema } from "@/lib/server/validation";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { sendBookingNotification } from "@/lib/server/notifications";
import { enqueueIntegrationJob } from "@/lib/server/integration-job-queue";

export const runtime = "edge";

type ReserveSlotResult = {
  booking_id: string;
  lead_id: string;
  slot_start: string;
  slot_timezone: string;
};

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = bookingReserveSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonError("Invalid booking payload", 400, parsed.error.flatten());
  }

  const body = parsed.data;

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.rpc("reserve_slot_atomic", {
    p_slot_id: body.slotId,
    p_full_name: body.fullName,
    p_email: body.email,
    p_phone: body.phone,
    p_service_interest: body.serviceInterest ?? null,
    p_message: body.message ?? null,
  });

  if (error) {
    const lowerMessage = error.message.toLowerCase();
    if (
      error.code === "23505" ||
      lowerMessage.includes("slot_already_booked") ||
      lowerMessage.includes("slot_not_available")
    ) {
      return jsonError("This slot is no longer available. Please choose another time.", 409);
    }

    return jsonError(`Failed to reserve booking slot: ${error.message}`, 500);
  }

  const first = Array.isArray(data) ? (data[0] as ReserveSlotResult | undefined) : undefined;
  if (!first) {
    return jsonError("Booking reservation returned no data", 500);
  }

  await sendBookingNotification({
    type: "booking",
    leadId: first.lead_id,
    bookingId: first.booking_id,
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    serviceInterest: body.serviceInterest,
    message: body.message,
    slotStart: first.slot_start,
    timezone: first.slot_timezone,
  });

  try {
    await enqueueIntegrationJob({
      jobType: "create_zoom_meeting",
      payload: {
        bookingId: first.booking_id,
        leadId: first.lead_id,
      },
      idempotencyKey: `create_zoom_meeting:${first.booking_id}`,
    });
  } catch (error) {
    console.error("Failed to enqueue create_zoom_meeting job", error);
  }

  return NextResponse.json(
    {
      bookingId: first.booking_id,
      leadId: first.lead_id,
      slotStart: first.slot_start,
      timezone: first.slot_timezone,
    },
    {
      status: 201,
      headers: noStoreHeaders(),
    },
  );
}
