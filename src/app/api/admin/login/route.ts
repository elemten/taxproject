import { NextRequest, NextResponse } from "next/server";
import { getAdminCredentials, createAdminSessionToken, getAdminSessionCookieName } from "@/lib/server/admin-session";
import { jsonError, noStoreHeaders } from "@/lib/server/http";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";
  const credentials = getAdminCredentials();

  if (!credentials) {
    return jsonError("Admin credentials are not configured.", 500);
  }

  if (username !== credentials.user || password !== credentials.pass) {
    return jsonError("Incorrect username or password.", 401);
  }

  const sessionToken = await createAdminSessionToken();
  if (!sessionToken) {
    return jsonError("Admin credentials are not configured.", 500);
  }

  const response = NextResponse.json(
    {
      ok: true,
    },
    {
      headers: noStoreHeaders(),
    },
  );

  response.cookies.set({
    name: getAdminSessionCookieName(),
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
