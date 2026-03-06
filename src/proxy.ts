import { NextRequest, NextResponse } from "next/server";
import { adminSessionIsValid, getAdminSessionCookieName } from "@/lib/server/admin-session";

function isAdminApiPath(pathname: string) {
  return pathname.startsWith("/api/admin/");
}

function loginRedirect(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

function apiUnauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Authentication required",
    },
    {
      status: 401,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(getAdminSessionCookieName())?.value;

  if (pathname === "/admin/login") {
    if (await adminSessionIsValid(sessionToken)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  if (await adminSessionIsValid(sessionToken)) {
    return NextResponse.next();
  }

  return isAdminApiPath(pathname) ? apiUnauthorizedResponse() : loginRedirect(request);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
