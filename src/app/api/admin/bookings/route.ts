import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";

export const runtime = "edge";

export async function GET() {
  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, status, booked_at, lead:leads!bookings_lead_id_fkey(name, email, phone, service_interest), slot:booking_slots!bookings_slot_id_fkey(starts_at, timezone)",
    )
    .eq("status", "booked")
    .order("booked_at", { ascending: false })
    .limit(200);

  if (error) {
    return jsonError(`Failed to fetch bookings: ${error.message}`, 500);
  }

  return NextResponse.json(
    {
      bookings: data ?? [],
    },
    {
      headers: noStoreHeaders(),
    },
  );
}
