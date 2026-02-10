import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";

export const runtime = "edge";

export async function GET() {
  const supabase = getSupabaseServiceClient();

  const [leadsResult, totalLeadsResult, newLeadsResult, bookingsResult, clientsResult] = await Promise.all([
    supabase
      .from("leads")
      .select("id, name, email, phone, source, status, service_interest, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "booked"),
    supabase.from("clients").select("id", { count: "exact", head: true }),
  ]);

  if (leadsResult.error) {
    return jsonError(`Failed to fetch leads: ${leadsResult.error.message}`, 500);
  }

  if (totalLeadsResult.error) {
    return jsonError(`Failed to fetch lead counts: ${totalLeadsResult.error.message}`, 500);
  }

  if (newLeadsResult.error) {
    return jsonError(`Failed to fetch new lead counts: ${newLeadsResult.error.message}`, 500);
  }

  if (bookingsResult.error) {
    return jsonError(`Failed to fetch bookings stats: ${bookingsResult.error.message}`, 500);
  }

  if (clientsResult.error) {
    return jsonError(`Failed to fetch clients stats: ${clientsResult.error.message}`, 500);
  }

  const leads = leadsResult.data ?? [];
  const stats = {
    totalLeads: totalLeadsResult.count ?? 0,
    newLeads: newLeadsResult.count ?? 0,
    qualifiedLeads: leads.filter((lead) => lead.status === "qualified").length,
    convertedLeads: leads.filter((lead) => lead.status === "converted").length,
    activeBookings: bookingsResult.count ?? 0,
    totalClients: clientsResult.count ?? 0,
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
