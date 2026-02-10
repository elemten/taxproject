import { NextRequest, NextResponse } from "next/server";

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(details ? { details } : {}),
    },
    { status },
  );
}

export function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const [first] = xff.split(",");
    if (first) {
      return first.trim();
    }
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, max-age=0",
  };
}
