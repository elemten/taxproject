import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";
import { leadStatusUpdateSchema } from "@/lib/server/validation";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = leadStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid status update payload", 400, parsed.error.flatten());
  }

  const supabase = getSupabaseServiceClient();

  const { error: updateError } = await supabase
    .from("leads")
    .update({
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    return jsonError(`Failed to update lead status: ${updateError.message}`, 500);
  }

  const { error: eventError } = await supabase.from("lead_events").insert({
    lead_id: id,
    event_type: "status_updated",
    note: parsed.data.note ?? `Lead status changed to ${parsed.data.status}`,
    actor: "admin",
  });

  if (eventError) {
    return jsonError(`Lead status changed but event insert failed: ${eventError.message}`, 500);
  }

  return NextResponse.json(
    {
      ok: true,
    },
    {
      headers: noStoreHeaders(),
    },
  );
}
