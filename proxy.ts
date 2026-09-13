import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, PRIVATE_CACHE, SECURITY_HEADERS } from "@/lib/protect/constants";

function applySecurity(response: NextResponse) {
  for (const header of SECURITY_HEADERS) {
    response.headers.set(header.key, header.value);
  }
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/media/")) {
    const denied = new NextResponse("media is session-gated", {
      status: 403,
      headers: { "Cache-Control": PRIVATE_CACHE },
    });
    return applySecurity(denied);
  }

  if (
    pathname.endsWith(".jsonl") ||
    pathname.startsWith("/data/") ||
    pathname.startsWith("/content/")
  ) {
    return applySecurity(new NextResponse("not found", { status: 404 }));
  }

  const response = NextResponse.next();
  if (pathname.startsWith("/api/") && !request.cookies.get(SESSION_COOKIE)) {
    response.headers.set("Cache-Control", PRIVATE_CACHE);
  }
  return applySecurity(response);
}

export const config = {
  matcher: ["/media/:path*", "/data/:path*", "/content/:path*", "/api/:path*"],
};
