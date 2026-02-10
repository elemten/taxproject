import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";
import { slotUpdateSchema } from "@/lib/server/validation";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = slotUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid slot update payload", 400, parsed.error.flatten());
  }

  const updateData: Record<string, string | boolean> = {};
  if (parsed.data.startsAt) {
    updateData.starts_at = new Date(parsed.data.startsAt).toISOString();
  }
  if (parsed.data.endsAt) {
    updateData.ends_at = new Date(parsed.data.endsAt).toISOString();
  }
  if (parsed.data.timezone) {
    updateData.timezone = parsed.data.timezone;
  }
  if (typeof parsed.data.isActive === "boolean") {
    updateData.is_active = parsed.data.isActive;
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("booking_slots")
    .update(updateData)
    .eq("id", id)
    .select("id, starts_at, ends_at, timezone, is_active")
    .single();

  if (error || !data) {
    return jsonError(`Failed to update slot: ${error?.message ?? "Unknown error"}`, 500);
  }

  return NextResponse.json(
    {
      slot: data,
    },
    {
      headers: noStoreHeaders(),
    },
  );
}
