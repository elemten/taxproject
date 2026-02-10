import { NextRequest, NextResponse } from "next/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";
import { contactSubmitSchema } from "@/lib/server/validation";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { sendLeadNotification } from "@/lib/server/notifications";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = contactSubmitSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonError("Invalid contact payload", 400, parsed.error.flatten());
  }

  const body = parsed.data;

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.rpc("create_or_update_lead", {
    p_name: body.fullName,
    p_email: body.email,
    p_phone: body.phone,
    p_source: "contact_form",
    p_service_interest: body.serviceInterest ?? null,
    p_message: body.message,
    p_initial_event: "contact_submitted",
    p_actor: "public_form",
  });

  if (error || !data) {
    return jsonError(`Failed to save contact request: ${error?.message ?? "Unknown error"}`, 500);
  }

  await sendLeadNotification({
    type: "lead",
    leadId: String(data),
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    serviceInterest: body.serviceInterest,
    message: body.message,
  });

  return NextResponse.json(
    {
      leadId: data,
    },
    {
      status: 201,
      headers: noStoreHeaders(),
    },
  );
}
