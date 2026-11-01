import { isDevelopmentPreviewEnabled } from "@shared/lib/development-preview";
import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const preview = request.nextUrl.pathname.startsWith("/dev/ui")
    ? "ui"
    : request.nextUrl.pathname.startsWith("/dev/architecture")
      ? "architecture"
      : "http";

  if (!isDevelopmentPreviewEnabled(preview)) {
    return new NextResponse("Not found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dev/ui/:path*", "/dev/architecture/:path*", "/dev/http/:path*"],
};
