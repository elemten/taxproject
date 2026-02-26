import { createSign, randomUUID } from "node:crypto";
import { getEnv } from "@/lib/server/env";
import { GOOGLE_DRIVE_FOLDER_MIME } from "@/lib/server/integrations/constants";

type CachedToken = {
  accessToken: string;
  expiresAtMs: number;
};

type EnsureFolderInput = {
  name: string;
  parentFolderId: string;
};

type UploadFileInput = {
  folderId: string;
  fileName: string;
  mimeType: string;
  data: Uint8Array;
};

export type DriveFileResult = {
  id: string;
  name: string;
  webViewLink?: string;
};

let cachedToken: CachedToken | null = null;

export function driveConfigured() {
  const env = getEnv();
  return Boolean(
    env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL &&
      env.GOOGLE_DRIVE_PRIVATE_KEY &&
      env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
  );
}

export async function ensureDriveFolder(input: EnsureFolderInput): Promise<DriveFileResult> {
  const token = await getDriveAccessToken();

  const query = [
    `mimeType='${GOOGLE_DRIVE_FOLDER_MIME}'`,
    `name='${escapeDriveQuery(input.name)}'`,
    `'${escapeDriveQuery(input.parentFolderId)}' in parents`,
    "trashed=false",
  ].join(" and ");

  const searchUrl = new URL("https://www.googleapis.com/drive/v3/files");
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("pageSize", "1");
  searchUrl.searchParams.set("fields", "files(id,name,webViewLink)");

  const searchResponse = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const searchBody = (await searchResponse.json().catch(() => null)) as
    | { files?: Array<{ id: string; name: string; webViewLink?: string }> }
    | null;

  if (!searchResponse.ok) {
    throw new Error(`Google Drive search failed (${searchResponse.status}): ${JSON.stringify(searchBody)}`);
  }

  if (searchBody?.files?.length) {
    return searchBody.files[0];
  }

  const createResponse = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      mimeType: GOOGLE_DRIVE_FOLDER_MIME,
      parents: [input.parentFolderId],
    }),
  });

  const createBody = (await createResponse.json().catch(() => null)) as
    | { id?: string; name?: string; webViewLink?: string }
    | null;

  if (!createResponse.ok || !createBody?.id || !createBody.name) {
    throw new Error(`Google Drive folder create failed (${createResponse.status}): ${JSON.stringify(createBody)}`);
  }

  return {
    id: createBody.id,
    name: createBody.name,
    webViewLink: createBody.webViewLink,
  };
}

export async function uploadDriveFile(input: UploadFileInput): Promise<DriveFileResult> {
  const token = await getDriveAccessToken();
  const boundary = `drive-boundary-${randomUUID()}`;

  const metadata = {
    name: input.fileName,
    parents: [input.folderId],
  };

  const preamble = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: ${input.mimeType}\r\n\r\n`;
  const closing = `\r\n--${boundary}--`;

  const encoder = new TextEncoder();
  const body = new Uint8Array(
    encoder.encode(preamble).length + input.data.length + encoder.encode(closing).length,
  );
  body.set(encoder.encode(preamble), 0);
  body.set(input.data, encoder.encode(preamble).length);
  body.set(encoder.encode(closing), encoder.encode(preamble).length + input.data.length);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    },
  );

  const responseBody = (await response.json().catch(() => null)) as
    | {
        id?: string;
        name?: string;
        webViewLink?: string;
      }
    | null;

  if (!response.ok || !responseBody?.id || !responseBody?.name) {
    throw new Error(`Google Drive upload failed (${response.status}): ${JSON.stringify(responseBody)}`);
  }

  return {
    id: responseBody.id,
    name: responseBody.name,
    webViewLink: responseBody.webViewLink,
  };
}

async function getDriveAccessToken() {
  const env = getEnv();

  if (!env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_DRIVE_PRIVATE_KEY) {
    throw new Error("Google Drive environment variables are not fully configured");
  }

  if (cachedToken && Date.now() < cachedToken.expiresAtMs - 30_000) {
    return cachedToken.accessToken;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/drive.file",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const token = signJwt(header, claimSet, env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, "\n"));

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: token,
    }),
  });

  const body = (await response.json().catch(() => null)) as
    | {
        access_token?: string;
        expires_in?: number;
      }
    | null;

  if (!response.ok || !body?.access_token || !body?.expires_in) {
    throw new Error(`Google OAuth token request failed (${response.status}): ${JSON.stringify(body)}`);
  }

  cachedToken = {
    accessToken: body.access_token,
    expiresAtMs: Date.now() + body.expires_in * 1000,
  };

  return cachedToken.accessToken;
}

function signJwt(header: object, payload: object, privateKey: string) {
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();

  const signature = signer.sign(privateKey);
  return `${signingInput}.${toBase64Url(signature)}`;
}

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function escapeDriveQuery(value: string) {
  return value.replace(/'/g, "\\'");
}
