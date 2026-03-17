import { NextResponse } from "next/server";
import { jsonError, noStoreHeaders } from "@/lib/server/http";

export const runtime = "nodejs";

export async function GET() {
  return jsonError("WhatsApp webhook is disabled", 410);
}

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      disabled: true,
    },
    {
      status: 410,
      headers: noStoreHeaders(),
    },
  );
}
