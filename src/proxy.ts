import { NextRequest, NextResponse } from "next/server";

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
      "Cache-Control": "no-store",
    },
  });
}

function credentialsAreValid(authHeader: string | null) {
  const expectedUser = process.env.ADMIN_BASIC_AUTH_USER;
  const expectedPass = process.env.ADMIN_BASIC_AUTH_PASS;

  if (!expectedUser || !expectedPass) {
    return false;
  }

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  const base64 = authHeader.slice(6).trim();
  const decoded = atob(base64);
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex <= 0) {
    return false;
  }

  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);

  return user === expectedUser && pass === expectedPass;
}

export function proxy(request: NextRequest) {
  if (credentialsAreValid(request.headers.get("authorization"))) {
    return NextResponse.next();
  }

  return unauthorizedResponse();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
