import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.hostname === "lettes.my-menu.net") {
    if (url.pathname === "/") {
      return NextResponse.redirect(
        "https://lettes.my-menu.net/menu/34966345-2ec8-4227-b9c6-08a34d2d25a6"
      );
    } else {
      const newUrl = new URL(url.href);
      newUrl.hostname = "my-menu.net";
      return NextResponse.redirect(newUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
