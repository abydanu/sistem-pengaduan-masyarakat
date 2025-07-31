import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// cek apakah request valid
function isValidRequest(request) {
  return true;
}

// cek apakah pathname cocok dengan salah satu pattern
function matchesPath(pathname, patterns) {
  return patterns.some((pattern) =>
    pattern.endsWith("/*")
      ? pathname.startsWith(pattern.replace("/*", ""))
      : pathname === pattern
  );
}

// Config path
const authConfig = {
  loginPath: "/masuk",
  unauthorizedPath: "/unauthorized",
  adminDashboard: "/admin/dashboard",
  userDashboard: "/masyarakat/dashboard",
  publicPaths: ["/masuk", "/daftar", "/"],
  authPaths: ["/masuk", "/daftar"],
  adminPaths: ["/admin", "/admin/*"],
  userPaths: ["/masyarakat", "/masyarakat/*"],
};

export async function middleware(request) {
  try {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/api/")) {
      if (!isValidRequest(request)) {
        return NextResponse.json(
          { status: "error", message: "Direct API access is not allowed" },
          { status: 403 }
        );
      }

      if (pathname.startsWith("/api/auth/")) {
        return NextResponse.next();
      }

      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (!token) {
        return NextResponse.json(
          { status: "error", message: "Authentication required" },
          { status: 401 }
        );
      }

      if (!["ADMINISTRATOR", "PETUGAS", "USER"].includes(token.role)) {
        return NextResponse.json(
          { status: "error", message: "Unauthorized access" },
          { status: 403 }
        );
      }

      return NextResponse.next();
    }

    // Cek token untuk halaman non-API
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Jika user sudah login dan akses halaman auth, redirect ke dashboard sesuai role
    if (matchesPath(pathname, authConfig.authPaths) && token) {
      if (token.role === "ADMINISTRATOR") {
        return NextResponse.redirect(new URL(authConfig.adminDashboard, request.url));
      }
      return NextResponse.redirect(new URL(authConfig.userDashboard, request.url));
    }

    // Public & auth path boleh diakses siapa saja
    if (matchesPath(pathname, [...authConfig.publicPaths, ...authConfig.authPaths])) {
      return NextResponse.next();
    }

    // Jika belum login, redirect ke login
    if (!token) {
      return NextResponse.redirect(new URL(authConfig.loginPath, request.url));
    }

    // Cek role untuk admin path
    if (matchesPath(pathname, authConfig.adminPaths)) {
      if (token.role !== "ADMINISTRATOR") {
        return NextResponse.redirect(new URL(authConfig.unauthorizedPath, request.url));
      }
    }

    // Cek role untuk user path
    if (matchesPath(pathname, authConfig.userPaths)) {
      if (!["USER", "ADMINISTRATOR"].includes(token.role)) {
        return NextResponse.redirect(new URL(authConfig.unauthorizedPath, request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL(authConfig.loginPath, request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};