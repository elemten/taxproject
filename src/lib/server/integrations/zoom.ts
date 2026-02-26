import { getEnv } from "@/lib/server/env";

type CachedToken = {
  accessToken: string;
  expiresAtMs: number;
};

type ZoomMeetingInput = {
  topic: string;
  startTimeIso: string;
  durationMinutes: number;
  timezone: string;
  agenda?: string;
};

export type ZoomMeetingResult = {
  meetingId: string;
  joinUrl: string;
  startUrl?: string;
  raw: unknown;
};

let cachedToken: CachedToken | null = null;

export function zoomConfigured() {
  const env = getEnv();
  return Boolean(env.ZOOM_ACCOUNT_ID && env.ZOOM_CLIENT_ID && env.ZOOM_CLIENT_SECRET);
}

export async function createZoomMeeting(input: ZoomMeetingInput): Promise<ZoomMeetingResult> {
  const env = getEnv();

  if (!env.ZOOM_ACCOUNT_ID || !env.ZOOM_CLIENT_ID || !env.ZOOM_CLIENT_SECRET) {
    throw new Error("Zoom environment variables are not fully configured");
  }

  const accessToken = await getZoomAccessToken();
  const userId = env.ZOOM_USER_ID ?? "me";

  const response = await fetch(`https://api.zoom.us/v2/users/${encodeURIComponent(userId)}/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: input.topic,
      type: 2,
      start_time: input.startTimeIso,
      duration: input.durationMinutes,
      timezone: input.timezone,
      agenda: input.agenda,
      settings: {
        join_before_host: false,
        waiting_room: true,
        meeting_authentication: false,
      },
    }),
  });

  const body = (await response.json().catch(() => null)) as
    | {
        id?: number | string;
        join_url?: string;
        start_url?: string;
      }
    | null;

  if (!response.ok) {
    throw new Error(`Zoom meeting create failed (${response.status}): ${JSON.stringify(body)}`);
  }

  if (!body?.id || !body.join_url) {
    throw new Error("Zoom meeting create returned incomplete response");
  }

  return {
    meetingId: String(body.id),
    joinUrl: body.join_url,
    startUrl: body.start_url,
    raw: body,
  };
}

async function getZoomAccessToken() {
  const env = getEnv();

  if (!env.ZOOM_ACCOUNT_ID || !env.ZOOM_CLIENT_ID || !env.ZOOM_CLIENT_SECRET) {
    throw new Error("Zoom environment variables are not fully configured");
  }

  if (cachedToken && Date.now() < cachedToken.expiresAtMs - 30_000) {
    return cachedToken.accessToken;
  }

  const basic = Buffer.from(`${env.ZOOM_CLIENT_ID}:${env.ZOOM_CLIENT_SECRET}`).toString("base64");
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(env.ZOOM_ACCOUNT_ID)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const body = (await response.json().catch(() => null)) as
    | {
        access_token?: string;
        expires_in?: number;
      }
    | null;

  if (!response.ok || !body?.access_token || !body.expires_in) {
    throw new Error(`Zoom token request failed (${response.status}): ${JSON.stringify(body)}`);
  }

  cachedToken = {
    accessToken: body.access_token,
    expiresAtMs: Date.now() + body.expires_in * 1000,
  };

  return cachedToken.accessToken;
}
