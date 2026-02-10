import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";

export const runtime = "edge";

export async function GET() {
  const supabase = getSupabaseServiceClient();

  const [leadsResult, bookingsResult] = await Promise.all([
    supabase
      .from("leads")
      .select("id, name, email, phone, source, status, service_interest, created_at")
      .order("created_at", { ascending: false })
      .limit(150),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "booked"),
  ]);

  if (leadsResult.error) {
    return jsonError(`Failed to fetch leads: ${leadsResult.error.message}`, 500);
  }

  if (bookingsResult.error) {
    return jsonError(`Failed to fetch bookings stats: ${bookingsResult.error.message}`, 500);
  }

  const leads = leadsResult.data ?? [];
  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter((lead) => lead.status === "new").length,
    qualifiedLeads: leads.filter((lead) => lead.status === "qualified").length,
    convertedLeads: leads.filter((lead) => lead.status === "converted").length,
    activeBookings: bookingsResult.count ?? 0,
  };

  return NextResponse.json(
    {
      stats,
      leads,
    },
    {
      headers: noStoreHeaders(),
    },
  );
}
