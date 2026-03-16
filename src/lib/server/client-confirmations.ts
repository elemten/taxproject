import { sendWhatsAppBookingTemplate, whatsappConfiguredForOutbound } from "@/lib/server/integrations/whatsapp";

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
  if (!whatsappConfiguredForOutbound()) {
    throw new Error("WhatsApp booking confirmation is not fully configured");
  }

  const slotLabel = formatSlotLabel(input.slotStart, input.timezone);

  await sendWhatsAppBookingTemplate({
    toPhone: input.phone,
    clientName: input.fullName,
    slotLabel,
    zoomJoinUrl: input.zoomJoinUrl,
  });
}

function formatSlotLabel(slotStart: string, timezone: string) {
  const date = new Date(slotStart);
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: timezone,
  }).format(date);
}
