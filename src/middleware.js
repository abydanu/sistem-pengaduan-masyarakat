import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });

  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/masuk", req.url));
  }

  const role = token.role;

  if (pathname.startsWith("/admin") && role !== "ADMINISTRATOR") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/petugas") && role !== "PETUGAS") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname === "/") {
    if (role === "ADMINISTRATOR") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else if (role === "PETUGAS") {
      return NextResponse.redirect(new URL("/petugas/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/masyarakat/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/petugas/:path*", "/masyarakat/:path*"],
};
