import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";

export const runtime = "edge";

export async function GET() {
  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from("clients")
    .select("id, lead_id, name, email, phone, client_status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return jsonError(`Failed to fetch clients: ${error.message}`, 500);
  }

  return NextResponse.json(
    {
      clients: data ?? [],
    },
    {
      headers: noStoreHeaders(),
    },
  );
}
