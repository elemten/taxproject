import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";
import { createClientRecordSchema } from "@/lib/server/validation";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = createClientRecordSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid client record payload", 400, parsed.error.flatten());
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("client_records")
    .insert({
      client_id: id,
      service_type: parsed.data.serviceType,
      tax_year: parsed.data.taxYear ?? null,
      status: parsed.data.status ?? "open",
      notes: parsed.data.notes ?? null,
      metadata_json: parsed.data.metadata ?? {},
    })
    .select("id, client_id, service_type, tax_year, status, notes, metadata_json, created_at")
    .single();

  if (error || !data) {
    return jsonError(`Failed to create client record: ${error?.message ?? "Unknown error"}`, 500);
  }

  return NextResponse.json(
    {
      record: data,
    },
    {
      status: 201,
      headers: noStoreHeaders(),
    },
  );
}
