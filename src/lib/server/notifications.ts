import { getEnv } from "@/lib/server/env";

type NotificationPayload = {
  type: "lead" | "booking";
  leadId: string;
  bookingId?: string;
  fullName: string;
  email: string;
  phone: string;
  serviceInterest?: string;
  message?: string;
  slotStart?: string;
  timezone?: string;
};

type NotificationTopic = "new_lead" | "new_booking";

const REQUEST_TIMEOUT_MS = 5000;

export async function sendLeadNotification(payload: NotificationPayload) {
  return sendNotifications("new_lead", payload);
}

export async function sendBookingNotification(payload: NotificationPayload) {
  return sendNotifications("new_booking", payload);
}

async function sendNotifications(topic: NotificationTopic, payload: NotificationPayload) {
  const env = getEnv();

  const tasks: Array<Promise<void>> = [];

  if (env.RESEND_API_KEY && env.NOTIFICATION_EMAIL_FROM && env.NOTIFICATION_EMAIL_TO) {
    tasks.push(sendEmail(topic, payload));
  }

  if (env.WHATSAPP_ACCESS_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_BUSINESS_NUMBER) {
    tasks.push(sendWhatsApp(topic, payload));
  }

  if (tasks.length === 0) {
    return { attempted: 0, delivered: 0, failed: 0 };
  }

  const results = await Promise.allSettled(tasks);
  const failed = results.filter((result) => result.status === "rejected").length;

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Notification send failed", result.reason);
    }
  }

  return {
    attempted: results.length,
    delivered: results.length - failed,
    failed,
  };
}

async function sendEmail(topic: NotificationTopic, payload: NotificationPayload) {
  const env = getEnv();

  if (!env.RESEND_API_KEY || !env.NOTIFICATION_EMAIL_FROM || !env.NOTIFICATION_EMAIL_TO) {
    throw new Error("Email environment variables are not fully configured");
  }

  const subject = topic === "new_booking"
    ? `New booking request: ${payload.fullName}`
    : `New lead: ${payload.fullName}`;

  const lines = [
    `Type: ${payload.type}`,
    `Lead ID: ${payload.leadId}`,
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    payload.serviceInterest ? `Service: ${payload.serviceInterest}` : undefined,
    payload.slotStart ? `Slot: ${payload.slotStart} (${payload.timezone ?? "local"})` : undefined,
    payload.message ? `Message: ${payload.message}` : undefined,
  ].filter(Boolean);

  const response = await fetchWithTimeout("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.NOTIFICATION_EMAIL_FROM,
      to: [env.NOTIFICATION_EMAIL_TO],
      subject,
      text: lines.join("\n"),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed (${response.status}): ${body}`);
  }
}

async function sendWhatsApp(topic: NotificationTopic, payload: NotificationPayload) {
  const env = getEnv();

  if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_BUSINESS_NUMBER) {
    throw new Error("WhatsApp environment variables are not fully configured");
  }

  const text = topic === "new_booking"
    ? `New booking from ${payload.fullName}. Slot: ${payload.slotStart ?? "n/a"}. Phone: ${payload.phone}. Email: ${payload.email}.`
    : `New lead from ${payload.fullName}. Phone: ${payload.phone}. Email: ${payload.email}.`;

  const response = await fetchWithTimeout(
    `https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: env.WHATSAPP_BUSINESS_NUMBER,
        type: "text",
        text: {
          body: text,
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WhatsApp send failed (${response.status}): ${body}`);
  }
}

async function fetchWithTimeout(input: string, init: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
