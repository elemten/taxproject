import { getSupabaseServiceClient } from "@/lib/supabase/server";

export type IntegrationJobType =
  | "create_zoom_meeting"
  | "send_client_confirmation"
  | "process_whatsapp_media"
  | "ensure_folder";

export async function enqueueIntegrationJob(input: {
  jobType: IntegrationJobType;
  payload: Record<string, unknown>;
  idempotencyKey?: string;
}) {
  const supabase = getSupabaseServiceClient();

  if (input.idempotencyKey) {
    const { data: existing } = await supabase
      .from("integration_jobs")
      .select("id")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();

    if (existing?.id) {
      return { id: existing.id, deduped: true };
    }
  }

  const { data, error } = await supabase
    .from("integration_jobs")
    .insert({
      job_type: input.jobType,
      payload_json: input.payload,
      idempotency_key: input.idempotencyKey ?? null,
    })
    .select("id")
    .single();

  if (error && input.idempotencyKey && error.code === "23505") {
    const { data: existing } = await supabase
      .from("integration_jobs")
      .select("id")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();

    if (existing?.id) {
      return { id: existing.id, deduped: true };
    }
  }

  if (error || !data) {
    throw new Error(`Failed to enqueue integration job: ${error?.message ?? "Unknown error"}`);
  }

  return { id: data.id, deduped: false };
}
