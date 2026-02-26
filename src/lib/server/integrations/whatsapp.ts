import { createHmac, timingSafeEqual } from "node:crypto";
import { getEnv } from "@/lib/server/env";
import { WHATSAPP_API_VERSION } from "@/lib/server/integrations/constants";
import { formatPhoneForWhatsApp } from "@/lib/server/phone";

export type InboundWhatsAppMediaEvent = {
  messageId: string;
  from: string;
  mediaId: string;
  mediaType: string;
  timestamp?: string;
  fileName?: string;
  mimeType?: string;
};

export type WhatsAppMediaMetadata = {
  id: string;
  url: string;
  mime_type?: string;
  file_size?: number;
};

export function whatsappConfiguredForOutbound() {
  const env = getEnv();
  return Boolean(
    env.WHATSAPP_ACCESS_TOKEN &&
      env.WHATSAPP_PHONE_NUMBER_ID &&
      env.WHATSAPP_TEMPLATE_NAME &&
      env.WHATSAPP_TEMPLATE_LANGUAGE,
  );
}

export function whatsappConfiguredForWebhook() {
  const env = getEnv();
  return Boolean(env.WHATSAPP_ACCESS_TOKEN && env.WHATSAPP_WEBHOOK_VERIFY_TOKEN && env.WHATSAPP_APP_SECRET);
}

export async function sendWhatsAppBookingTemplate(input: {
  toPhone: string;
  clientName: string;
  slotLabel: string;
  zoomJoinUrl: string;
}) {
  const env = getEnv();

  if (
    !env.WHATSAPP_ACCESS_TOKEN ||
    !env.WHATSAPP_PHONE_NUMBER_ID ||
    !env.WHATSAPP_TEMPLATE_NAME ||
    !env.WHATSAPP_TEMPLATE_LANGUAGE
  ) {
    throw new Error("WhatsApp template environment variables are not fully configured");
  }

  const response = await fetch(`https://graph.facebook.com/${WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: formatPhoneForWhatsApp(input.toPhone),
      type: "template",
      template: {
        name: env.WHATSAPP_TEMPLATE_NAME,
        language: {
          code: env.WHATSAPP_TEMPLATE_LANGUAGE,
        },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: input.clientName },
              { type: "text", text: input.slotLabel },
              { type: "text", text: input.zoomJoinUrl },
            ],
          },
        ],
      },
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`WhatsApp template send failed (${response.status}): ${body}`);
  }
}

export function verifyWhatsAppWebhookSignature(rawBody: string, signatureHeader: string | null) {
  const env = getEnv();

  if (!env.WHATSAPP_APP_SECRET) {
    throw new Error("WHATSAPP_APP_SECRET is not configured");
  }

  if (!signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const expected = createHmac("sha256", env.WHATSAPP_APP_SECRET).update(rawBody).digest("hex");
  const received = signatureHeader.slice("sha256=".length);

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function extractInboundMediaEvents(payload: unknown): InboundWhatsAppMediaEvent[] {
  const events: InboundWhatsAppMediaEvent[] = [];

  if (!payload || typeof payload !== "object") {
    return events;
  }

  const entries = (payload as { entry?: Array<{ changes?: Array<{ value?: { messages?: unknown[] } }> }> }).entry;
  if (!Array.isArray(entries)) {
    return events;
  }

  for (const entry of entries) {
    if (!entry?.changes || !Array.isArray(entry.changes)) continue;

    for (const change of entry.changes) {
      const messages = change?.value?.messages;
      if (!Array.isArray(messages)) continue;

      for (const rawMessage of messages) {
        if (!rawMessage || typeof rawMessage !== "object") continue;

        const message = rawMessage as {
          id?: string;
          from?: string;
          timestamp?: string;
          type?: string;
          image?: { id?: string; mime_type?: string };
          document?: { id?: string; filename?: string; mime_type?: string };
          video?: { id?: string; mime_type?: string };
          audio?: { id?: string; mime_type?: string };
          sticker?: { id?: string; mime_type?: string };
        };

        if (!message.id || !message.from || !message.type) continue;

        const mediaPayload =
          message.type === "image"
            ? message.image
            : message.type === "document"
              ? message.document
              : message.type === "video"
                ? message.video
                : message.type === "audio"
                  ? message.audio
                  : message.type === "sticker"
                    ? message.sticker
                    : null;

        if (!mediaPayload?.id) continue;

        const fileName = message.type === "document" ? message.document?.filename : undefined;

        events.push({
          messageId: message.id,
          from: message.from,
          mediaId: mediaPayload.id,
          mediaType: message.type,
          timestamp: message.timestamp,
          fileName,
          mimeType: mediaPayload.mime_type,
        });
      }
    }
  }

  return events;
}

export async function getWhatsAppMediaMetadata(mediaId: string): Promise<WhatsAppMediaMetadata> {
  const env = getEnv();

  if (!env.WHATSAPP_ACCESS_TOKEN) {
    throw new Error("WHATSAPP_ACCESS_TOKEN is not configured");
  }

  const response = await fetch(`https://graph.facebook.com/${WHATSAPP_API_VERSION}/${encodeURIComponent(mediaId)}`, {
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
    },
  });

  const body = (await response.json().catch(() => null)) as WhatsAppMediaMetadata | null;
  if (!response.ok || !body?.id || !body?.url) {
    throw new Error(`WhatsApp media metadata fetch failed (${response.status}): ${JSON.stringify(body)}`);
  }

  return body;
}

export async function downloadWhatsAppMedia(url: string): Promise<{
  data: Uint8Array;
  mimeType: string;
}> {
  const env = getEnv();

  if (!env.WHATSAPP_ACCESS_TOKEN) {
    throw new Error("WHATSAPP_ACCESS_TOKEN is not configured");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WhatsApp media download failed (${response.status}): ${body}`);
  }

  const arrayBuffer = await response.arrayBuffer();

  return {
    data: new Uint8Array(arrayBuffer),
    mimeType: response.headers.get("content-type") ?? "application/octet-stream",
  };
}
