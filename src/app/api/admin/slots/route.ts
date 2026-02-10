import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";
import { slotCreateSchema } from "@/lib/server/validation";

export const runtime = "edge";

export async function GET() {
  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from("booking_slots")
    .select("id, starts_at, ends_at, timezone, is_active, created_at")
    .order("starts_at", { ascending: true })
    .limit(200);

  if (error) {
    return jsonError(`Failed to fetch slots: ${error.message}`, 500);
  }

  return NextResponse.json(
    {
      slots: data ?? [],
    },
    {
      headers: noStoreHeaders(),
    },
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = slotCreateSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid slot payload", 400, parsed.error.flatten());
  }

  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(parsed.data.endsAt);

  if (startsAt >= endsAt) {
    return jsonError("Slot end time must be after start time", 400);
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("booking_slots")
    .insert({
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      timezone: parsed.data.timezone ?? "America/Regina",
      is_active: parsed.data.isActive ?? true,
    })
    .select("id, starts_at, ends_at, timezone, is_active")
    .single();

  if (error || !data) {
    return jsonError(`Failed to create slot: ${error?.message ?? "Unknown error"}`, 500);
  }

  return NextResponse.json(
    {
      slot: data,
    },
    {
      status: 201,
      headers: noStoreHeaders(),
    },
  );
}
