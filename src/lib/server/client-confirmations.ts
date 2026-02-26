import { getEnv } from "@/lib/server/env";
import { sendWhatsAppBookingTemplate } from "@/lib/server/integrations/whatsapp";

type BookingConfirmationInput = {
  fullName: string;
  email: string;
  phone: string;
  slotStart: string;
  timezone: string;
  zoomJoinUrl: string;
  serviceInterest?: string | null;
};

export async function sendClientBookingConfirmation(input: BookingConfirmationInput) {
  await Promise.all([
    sendBookingConfirmationEmail(input),
    sendWhatsAppBookingTemplate({
      toPhone: input.phone,
      clientName: input.fullName,
      slotLabel: formatSlotLabel(input.slotStart, input.timezone),
      zoomJoinUrl: input.zoomJoinUrl,
    }),
  ]);
}

async function sendBookingConfirmationEmail(input: BookingConfirmationInput) {
  const env = getEnv();

  if (!env.RESEND_API_KEY || !env.NOTIFICATION_EMAIL_FROM) {
    throw new Error("Booking confirmation email environment variables are not fully configured");
  }

  const slotLabel = formatSlotLabel(input.slotStart, input.timezone);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.NOTIFICATION_EMAIL_FROM,
      to: [input.email],
      subject: "Your TrustEdge consultation Zoom link",
      text: [
        `Hi ${input.fullName},`,
        "",
        "Your booking is confirmed.",
        `Time: ${slotLabel}`,
        input.serviceInterest ? `Service: ${input.serviceInterest}` : undefined,
        `Zoom link: ${input.zoomJoinUrl}`,
        "",
        "Please keep this link private. If you need to reschedule, reply to this email.",
        "",
        "TrustEdge Tax Services",
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed (${response.status}): ${body}`);
  }
}

function formatSlotLabel(slotStart: string, timezone: string) {
  const date = new Date(slotStart);
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: timezone,
  }).format(date);
}
