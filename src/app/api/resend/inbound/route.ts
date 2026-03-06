import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";
import { getEnv } from "@/lib/server/env";
import { jsonError, noStoreHeaders } from "@/lib/server/http";

export const runtime = "nodejs";

type ReceivedEmailEvent = {
  type?: string;
  data?: {
    email_id?: string;
    to?: Array<string | { email?: string | null }>;
  };
};

export async function POST(request: NextRequest) {
  const env = getEnv();

  if (
    !env.RESEND_API_KEY ||
    !env.RESEND_WEBHOOK_SECRET ||
    !env.NOTIFICATION_EMAIL_FROM ||
    !env.NOTIFICATION_EMAIL_TO
  ) {
    return jsonError("Resend inbound forwarding is not fully configured", 500);
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const payload = await request.text();

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return jsonError("Missing webhook signature headers", 400);
  }

  let event: ReceivedEmailEvent;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret: env.RESEND_WEBHOOK_SECRET,
    }) as ReceivedEmailEvent;
  } catch {
    return jsonError("Invalid webhook signature", 401);
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true, ignored: event.type ?? "unknown_event" }, { headers: noStoreHeaders() });
  }

  const emailId = event.data?.email_id;
  if (!emailId) {
    return jsonError("Missing email_id in webhook payload", 400);
  }

  const deliveredToPublicContact = normalizeRecipients(event.data?.to).includes(site.email.toLowerCase());
  if (!deliveredToPublicContact) {
    return NextResponse.json({ ok: true, ignored: "recipient_not_public_contact" }, { headers: noStoreHeaders() });
  }

  const { error } = await resend.emails.receiving.forward({
    emailId,
    from: env.NOTIFICATION_EMAIL_FROM,
    to: [env.NOTIFICATION_EMAIL_TO],
  });

  if (error) {
    console.error("Resend inbound forward failed", error);
    return jsonError(`Resend forward failed: ${error.message}`, 502);
  }

  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() });
}

function normalizeRecipients(to: Array<string | { email?: string | null }> | undefined) {
  if (!Array.isArray(to)) {
    return [];
  }

  return to
    .map((entry) => {
      if (typeof entry === "string") {
        return entry.toLowerCase();
      }
      return (entry.email ?? "").toLowerCase();
    })
    .filter(Boolean);
}
