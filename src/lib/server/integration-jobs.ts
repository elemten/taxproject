import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { getEnv } from "@/lib/server/env";
import { getRetryDelaySeconds } from "@/lib/server/retry";
import { normalizePhoneKey } from "@/lib/server/phone";
import { createZoomMeeting, zoomConfigured } from "@/lib/server/integrations/zoom";
import { driveConfigured, ensureDriveFolder, uploadDriveFile } from "@/lib/server/integrations/google-drive";
import { downloadWhatsAppMedia, getWhatsAppMediaMetadata } from "@/lib/server/integrations/whatsapp";
import { sendClientBookingConfirmation } from "@/lib/server/client-confirmations";
import { enqueueIntegrationJob, type IntegrationJobType } from "@/lib/server/integration-job-queue";

type IntegrationJobRow = {
  id: string;
  job_type: IntegrationJobType;
  payload_json: Record<string, unknown>;
  attempts: number;
};

type BookingDetails = {
  id: string;
  status: "booked" | "cancelled" | "no_show";
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
    service_interest: string | null;
  } | null;
  slot: {
    starts_at: string;
    ends_at: string;
    timezone: string;
  } | null;
};

const MAX_ATTEMPTS = 6;

export async function processDueIntegrationJobs(limit = 20) {
  const supabase = getSupabaseServiceClient();
  const nowIso = new Date().toISOString();

  const { data: dueJobs, error } = await supabase
    .from("integration_jobs")
    .select("id, job_type, payload_json, attempts")
    .eq("status", "pending")
    .lte("next_attempt_at", nowIso)
    .order("created_at", { ascending: true })
    .limit(Math.max(1, Math.min(100, limit)));

  if (error) {
    throw new Error(`Failed to fetch integration jobs: ${error.message}`);
  }

  const summary = {
    scanned: dueJobs?.length ?? 0,
    claimed: 0,
    succeeded: 0,
    retried: 0,
    failed: 0,
  };

  for (const row of (dueJobs ?? []) as IntegrationJobRow[]) {
    const job = await claimJob(row.id);
    if (!job) {
      continue;
    }

    summary.claimed += 1;

    try {
      await processOneJob(job);
      await markJobSucceeded(job.id);
      summary.succeeded += 1;
    } catch (errorMessage) {
      const errorText = errorMessage instanceof Error ? errorMessage.message : "Unknown job error";
      const finalAttempt = job.attempts + 1 >= MAX_ATTEMPTS;
      await markJobFailure(job, errorText, finalAttempt);

      if (finalAttempt) {
        summary.failed += 1;
      } else {
        summary.retried += 1;
      }
    }
  }

  return summary;
}

async function claimJob(jobId: string): Promise<IntegrationJobRow | null> {
  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from("integration_jobs")
    .update({
      status: "running",
      locked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .eq("status", "pending")
    .select("id, job_type, payload_json, attempts")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to claim integration job: ${error.message}`);
  }

  return (data as IntegrationJobRow | null) ?? null;
}

async function markJobSucceeded(jobId: string) {
  const supabase = getSupabaseServiceClient();

  const { error } = await supabase
    .from("integration_jobs")
    .update({
      status: "succeeded",
      completed_at: new Date().toISOString(),
      last_error: null,
      locked_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .eq("status", "running");

  if (error) {
    throw new Error(`Failed to mark integration job as succeeded: ${error.message}`);
  }
}

async function markJobFailure(job: IntegrationJobRow, errorMessage: string, finalFailure: boolean) {
  const supabase = getSupabaseServiceClient();
  const nextAttempts = job.attempts + 1;

  if (finalFailure) {
    const { error } = await supabase
      .from("integration_jobs")
      .update({
        status: "failed",
        attempts: nextAttempts,
        last_error: errorMessage,
        locked_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id)
      .eq("status", "running");

    if (error) {
      throw new Error(`Failed to mark integration job as failed: ${error.message}`);
    }

    await appendLeadEventFromJob(job, `integration_failed:${job.job_type}`, errorMessage);
    return;
  }

  const retryAt = new Date(Date.now() + getRetryDelaySeconds(nextAttempts) * 1000).toISOString();
  const { error } = await supabase
    .from("integration_jobs")
    .update({
      status: "pending",
      attempts: nextAttempts,
      next_attempt_at: retryAt,
      last_error: errorMessage,
      locked_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", job.id)
    .eq("status", "running");

  if (error) {
    throw new Error(`Failed to reschedule integration job: ${error.message}`);
  }

  await appendLeadEventFromJob(job, `integration_retry:${job.job_type}`, errorMessage);
}

async function processOneJob(job: IntegrationJobRow) {
  switch (job.job_type) {
    case "create_zoom_meeting":
      await handleCreateZoomMeeting(job.payload_json);
      return;
    case "send_client_confirmation":
      await handleSendClientConfirmation(job.payload_json);
      return;
    case "ensure_folder":
      await handleEnsureFolder(job.payload_json);
      return;
    case "process_whatsapp_media":
      await handleProcessWhatsAppMedia(job.payload_json);
      return;
    default:
      throw new Error(`Unknown integration job type: ${job.job_type}`);
  }
}

async function handleCreateZoomMeeting(payload: Record<string, unknown>) {
  const bookingId = asString(payload.bookingId);
  if (!bookingId) throw new Error("create_zoom_meeting requires bookingId");

  const supabase = getSupabaseServiceClient();

  const { data: existingMeeting } = await supabase
    .from("booking_meetings")
    .select("meeting_id")
    .eq("booking_id", bookingId)
    .maybeSingle();

  const booking = await getBookingDetails(bookingId);

  if (booking.status !== "booked") {
    throw new Error(`Booking ${bookingId} is not active`);
  }

  if (!booking.lead || !booking.slot) {
    throw new Error(`Booking ${bookingId} is missing lead or slot data`);
  }

  let meetingId = existingMeeting?.meeting_id;

  if (!meetingId) {
    if (!zoomConfigured()) {
      throw new Error("Zoom integration is not configured");
    }

    const start = new Date(booking.slot.starts_at);
    const end = new Date(booking.slot.ends_at);
    const durationMinutes = Math.max(15, Math.round((end.getTime() - start.getTime()) / 60_000));

    const result = await createZoomMeeting({
      topic: `TrustEdge Consultation - ${booking.lead.name}`,
      startTimeIso: booking.slot.starts_at,
      durationMinutes,
      timezone: booking.slot.timezone,
      agenda: booking.lead.service_interest ?? "Tax consultation",
    });

    meetingId = result.meetingId;

    const { error: upsertError } = await supabase.from("booking_meetings").upsert(
      {
        booking_id: bookingId,
        provider: "zoom",
        meeting_id: result.meetingId,
        join_url: result.joinUrl,
        start_url: result.startUrl ?? null,
        status: "scheduled",
        scheduled_start: booking.slot.starts_at,
        timezone: booking.slot.timezone,
        raw_json: result.raw,
      },
      {
        onConflict: "booking_id",
      },
    );

    if (upsertError) {
      throw new Error(`Failed to save booking meeting: ${upsertError.message}`);
    }
  }

  await enqueueIntegrationJob({
    jobType: "send_client_confirmation",
    payload: {
      bookingId,
      leadId: booking.lead.id,
    },
    idempotencyKey: `send_client_confirmation:${bookingId}:${meetingId}`,
  });
}

async function handleSendClientConfirmation(payload: Record<string, unknown>) {
  const bookingId = asString(payload.bookingId);
  if (!bookingId) throw new Error("send_client_confirmation requires bookingId");

  const booking = await getBookingDetails(bookingId);
  if (!booking.lead || !booking.slot) {
    throw new Error(`Booking ${bookingId} is missing lead or slot data`);
  }

  const supabase = getSupabaseServiceClient();
  const { data: meeting } = await supabase
    .from("booking_meetings")
    .select("join_url")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (!meeting?.join_url) {
    throw new Error(`Booking ${bookingId} has no Zoom meeting`);
  }

  await sendClientBookingConfirmation({
    fullName: booking.lead.name,
    email: booking.lead.email,
    phone: booking.lead.phone,
    slotStart: booking.slot.starts_at,
    timezone: booking.slot.timezone,
    zoomJoinUrl: meeting.join_url,
    serviceInterest: booking.lead.service_interest,
  });
}

async function handleEnsureFolder(payload: Record<string, unknown>) {
  const clientId = asString(payload.clientId);
  const phoneKeyFromPayload = asString(payload.phoneKey);
  const senderPhone = asString(payload.senderPhone);

  if (!driveConfigured()) {
    throw new Error("Google Drive integration is not configured");
  }

  if (clientId) {
    await ensureClientFolder(clientId);
    return;
  }

  const phoneKey = phoneKeyFromPayload || normalizePhoneKey(senderPhone ?? "");
  if (!phoneKey) {
    throw new Error("ensure_folder requires either clientId or phoneKey/senderPhone");
  }

  await ensureProspectFolder(phoneKey);
}

async function handleProcessWhatsAppMedia(payload: Record<string, unknown>) {
  const messageId = asString(payload.messageId);
  const mediaId = asString(payload.mediaId);
  const mediaType = asString(payload.mediaType);
  const fromPhone = asString(payload.fromPhone);
  const fallbackFileName = asString(payload.fileName);
  const fallbackMimeType = asString(payload.mimeType);

  if (!messageId || !mediaId || !mediaType || !fromPhone) {
    throw new Error("process_whatsapp_media payload is incomplete");
  }

  if (!driveConfigured()) {
    throw new Error("Google Drive integration is not configured");
  }

  const senderPhoneKey = normalizePhoneKey(fromPhone);
  if (!senderPhoneKey) {
    throw new Error("Unable to normalize sender phone number");
  }

  const supabase = getSupabaseServiceClient();

  const { data: existing } = await supabase
    .from("ingested_documents")
    .select("id")
    .eq("message_id", messageId)
    .maybeSingle();

  if (existing?.id) {
    return;
  }

  const externalFolder = await resolveExternalFolderForPhone(senderPhoneKey, fromPhone);
  const mediaMetadata = await getWhatsAppMediaMetadata(mediaId);
  const mediaDownload = await downloadWhatsAppMedia(mediaMetadata.url);

  const mimeType = mediaMetadata.mime_type ?? fallbackMimeType ?? mediaDownload.mimeType;
  const fileName =
    fallbackFileName ||
    `${mediaType}-${messageId}${extensionFromMime(mimeType)}`;

  const uploaded = await uploadDriveFile({
    folderId: externalFolder.provider_folder_id,
    fileName,
    mimeType,
    data: mediaDownload.data,
  });

  const { error } = await supabase.from("ingested_documents").insert({
    message_id: messageId,
    media_id: mediaId,
    sender_phone: fromPhone,
    sender_phone_key: senderPhoneKey,
    media_type: mediaType,
    mime_type: mimeType,
    file_name: fileName,
    size_bytes: mediaMetadata.file_size ?? mediaDownload.data.byteLength,
    provider: "whatsapp",
    external_folder_id: externalFolder.id,
    provider_file_id: uploaded.id,
    status: "stored",
    raw_json: {
      whatsappMedia: mediaMetadata,
      upload: uploaded,
    },
  });

  if (error) {
    throw new Error(`Failed to save ingested document row: ${error.message}`);
  }
}

async function ensureClientFolder(clientId: string) {
  const supabase = getSupabaseServiceClient();

  const { data: existingFolder } = await supabase
    .from("external_folders")
    .select("id, provider_folder_id, path_label")
    .eq("entity_type", "client")
    .eq("entity_id", clientId)
    .eq("is_active", true)
    .maybeSingle();

  if (existingFolder) {
    return existingFolder;
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, name")
    .eq("id", clientId)
    .maybeSingle();

  if (clientError || !client) {
    throw new Error(`Client ${clientId} not found`);
  }

  const env = getEnv();
  if (!env.GOOGLE_DRIVE_ROOT_FOLDER_ID) {
    throw new Error("GOOGLE_DRIVE_ROOT_FOLDER_ID is not configured");
  }

  const folderName = `Client - ${safeFileName(client.name)} - ${client.id.slice(0, 8)}`;
  const rootFolder = await ensureDriveFolder({
    name: folderName,
    parentFolderId: env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
  });

  const { data: inserted, error: insertError } = await supabase
    .from("external_folders")
    .insert({
      entity_type: "client",
      entity_id: client.id,
      phone_key: null,
      provider: "google_drive",
      provider_folder_id: rootFolder.id,
      path_label: rootFolder.name,
      is_active: true,
    })
    .select("id, provider_folder_id, path_label")
    .single();

  if (insertError) {
    const { data: fallback } = await supabase
      .from("external_folders")
      .select("id, provider_folder_id, path_label")
      .eq("entity_type", "client")
      .eq("entity_id", client.id)
      .eq("is_active", true)
      .maybeSingle();

    if (fallback) {
      return fallback;
    }

    throw new Error(`Failed to save client folder mapping: ${insertError.message}`);
  }

  return inserted;
}

async function ensureProspectFolder(phoneKey: string) {
  const supabase = getSupabaseServiceClient();

  const { data: existingFolder } = await supabase
    .from("external_folders")
    .select("id, provider_folder_id, path_label")
    .eq("entity_type", "prospect_phone")
    .eq("phone_key", phoneKey)
    .eq("is_active", true)
    .maybeSingle();

  if (existingFolder) {
    return existingFolder;
  }

  const env = getEnv();
  if (!env.GOOGLE_DRIVE_ROOT_FOLDER_ID) {
    throw new Error("GOOGLE_DRIVE_ROOT_FOLDER_ID is not configured");
  }

  const folderName = `Prospect - ${phoneKey}`;
  const folder = await ensureDriveFolder({
    name: folderName,
    parentFolderId: env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
  });

  const { data: inserted, error } = await supabase
    .from("external_folders")
    .insert({
      entity_type: "prospect_phone",
      entity_id: null,
      phone_key: phoneKey,
      provider: "google_drive",
      provider_folder_id: folder.id,
      path_label: folder.name,
      is_active: true,
    })
    .select("id, provider_folder_id, path_label")
    .single();

  if (error) {
    const { data: fallback } = await supabase
      .from("external_folders")
      .select("id, provider_folder_id, path_label")
      .eq("entity_type", "prospect_phone")
      .eq("phone_key", phoneKey)
      .eq("is_active", true)
      .maybeSingle();

    if (fallback) {
      return fallback;
    }

    throw new Error(`Failed to save prospect folder mapping: ${error.message}`);
  }

  return inserted;
}

async function resolveExternalFolderForPhone(senderPhoneKey: string, senderPhone: string) {
  const supabase = getSupabaseServiceClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, phone")
    .eq("client_status", "active")
    .limit(1000);

  if (error) {
    throw new Error(`Failed to fetch clients for phone match: ${error.message}`);
  }

  const matchedClient = (clients ?? []).find((client) => normalizePhoneKey(client.phone ?? "") === senderPhoneKey);
  if (matchedClient?.id) {
    return ensureClientFolder(matchedClient.id);
  }

  await handleEnsureFolder({ phoneKey: senderPhoneKey, senderPhone });

  const { data: prospectFolder, error: folderError } = await supabase
    .from("external_folders")
    .select("id, provider_folder_id, path_label")
    .eq("entity_type", "prospect_phone")
    .eq("phone_key", senderPhoneKey)
    .eq("is_active", true)
    .single();

  if (folderError || !prospectFolder) {
    throw new Error(`Failed to resolve prospect folder for phone ${senderPhoneKey}`);
  }

  return prospectFolder;
}

async function getBookingDetails(bookingId: string): Promise<BookingDetails> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, status, lead:leads!bookings_lead_id_fkey(id, name, email, phone, service_interest), slot:booking_slots!bookings_slot_id_fkey(starts_at, ends_at, timezone)",
    )
    .eq("id", bookingId)
    .single();

  if (error || !data) {
    throw new Error(`Failed to fetch booking ${bookingId}: ${error?.message ?? "Not found"}`);
  }

  const lead = Array.isArray(data.lead) ? data.lead[0] ?? null : data.lead;
  const slot = Array.isArray(data.slot) ? data.slot[0] ?? null : data.slot;

  return {
    id: data.id,
    status: data.status,
    lead: lead
      ? {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          service_interest: lead.service_interest ?? null,
        }
      : null,
    slot: slot
      ? {
          starts_at: slot.starts_at,
          ends_at: slot.ends_at,
          timezone: slot.timezone,
        }
      : null,
  };
}

async function appendLeadEventFromJob(job: IntegrationJobRow, eventType: string, note: string) {
  const leadId = extractLeadIdFromPayload(job.payload_json);
  if (!leadId) {
    return;
  }

  const supabase = getSupabaseServiceClient();
  await supabase.from("lead_events").insert({
    lead_id: leadId,
    event_type: eventType,
    note: note.slice(0, 1000),
    actor: "integration_worker",
  });
}

function extractLeadIdFromPayload(payload: Record<string, unknown>) {
  const directLeadId = asString(payload.leadId);
  if (directLeadId) return directLeadId;
  return null;
}

function asString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function safeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9\s-]/g, "").trim().replace(/\s+/g, " ") || "Client";
}

function extensionFromMime(mimeType: string) {
  const normalized = mimeType.toLowerCase();

  if (normalized.includes("pdf")) return ".pdf";
  if (normalized.includes("jpeg")) return ".jpg";
  if (normalized.includes("png")) return ".png";
  if (normalized.includes("gif")) return ".gif";
  if (normalized.includes("webp")) return ".webp";
  if (normalized.includes("mp4")) return ".mp4";
  if (normalized.includes("mpeg")) return ".mp3";
  if (normalized.includes("ogg")) return ".ogg";
  return "";
}
