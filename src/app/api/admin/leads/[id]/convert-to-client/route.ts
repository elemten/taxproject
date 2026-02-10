import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { convertLeadSchema } from "@/lib/server/validation";
import { jsonError, noStoreHeaders } from "@/lib/server/http";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const parsed = convertLeadSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid convert payload", 400, parsed.error.flatten());
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.rpc("convert_lead_to_client", {
    p_lead_id: id,
    p_address: parsed.data.address ?? null,
    p_actor: "admin",
  });

  if (error || !data) {
    return jsonError(`Failed to convert lead: ${error?.message ?? "Unknown error"}`, 500);
  }

  return NextResponse.json(
    {
      clientId: data,
    },
    {
      status: 201,
      headers: noStoreHeaders(),
    },
  );
}
