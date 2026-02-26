import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/server/env";
import { jsonError, noStoreHeaders } from "@/lib/server/http";
import {
  extractInboundMediaEvents,
  verifyWhatsAppWebhookSignature,
  whatsappConfiguredForWebhook,
} from "@/lib/server/integrations/whatsapp";
import { enqueueIntegrationJob } from "@/lib/server/integration-job-queue";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const env = getEnv();

  if (!env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return jsonError("WHATSAPP_WEBHOOK_VERIFY_TOKEN is not configured", 503);
  }

  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (mode !== "subscribe" || token !== env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || !challenge) {
    return jsonError("Webhook verification failed", 403);
  }

  return new NextResponse(challenge, {
    status: 200,
    headers: noStoreHeaders(),
  });
}

export async function POST(request: NextRequest) {
  if (!whatsappConfiguredForWebhook()) {
    return jsonError("WhatsApp webhook is not configured", 503);
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyWhatsAppWebhookSignature(rawBody, signature)) {
    return jsonError("Invalid webhook signature", 401);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return jsonError("Invalid webhook payload", 400);
  }
  const mediaEvents = extractInboundMediaEvents(payload);

  const enqueueResults = await Promise.allSettled(
    mediaEvents.map((event) =>
      enqueueIntegrationJob({
        jobType: "process_whatsapp_media",
        payload: {
          messageId: event.messageId,
          mediaId: event.mediaId,
          mediaType: event.mediaType,
          fromPhone: event.from,
          timestamp: event.timestamp,
          fileName: event.fileName,
          mimeType: event.mimeType,
        },
        idempotencyKey: `wa_media:${event.messageId}`,
      }),
    ),
  );

  const queued = enqueueResults.filter((result) => result.status === "fulfilled").length;

  return NextResponse.json(
    {
      ok: true,
      received: mediaEvents.length,
      queued,
    },
    {
      headers: noStoreHeaders(),
    },
  );
}
