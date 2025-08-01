import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const authConfig = {
  loginPath: '/masuk',
  unauthorizedPath: '/unauthorized',
  adminDashboard: '/admin/dashboard',
  petugasDashboard: '/petugas/dashboard',
  masyarakatDashboard: '/masyarakat/dashboard',

  publicPaths: ['/', '/masuk', '/daftar'],
  authPaths: ['/masuk', '/daftar'],
  adminPaths: ['/admin', '/admin/*'],
  petugasPaths: ['/petugas', '/petugas/*'],
  masyarakatPaths: ['/masyarakat', '/masyarakat/*'],
};

function matchesPath(pathname, patterns) {
  return patterns.some((pattern) =>
    pattern.endsWith('/*')
      ? pathname.startsWith(pattern.replace('/*', ''))
      : pathname === pattern
  );
}

export async function middleware(request) {
  try {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/_next/') || pathname === '/favicon.ico') {
      return NextResponse.next();
    }

    // Boleh akses API auth
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Redirect user yang sudah login dari /masuk /daftar ke dashboard masing-masing
    if (matchesPath(pathname, authConfig.authPaths) && token) {
      if (token.level === 'ADMIN') {
        return NextResponse.redirect(
          new URL(authConfig.adminDashboard, request.url)
        );
      }
      if (token.level === 'PETUGAS') {
        return NextResponse.redirect(
          new URL(authConfig.petugasDashboard, request.url)
        );
      }
      // Jika tidak punya level, berarti masyarakat
      return NextResponse.redirect(
        new URL(authConfig.masyarakatDashboard, request.url)
      );
    }

    // Halaman publik boleh diakses siapa saja
    if (
      matchesPath(pathname, [
        ...authConfig.publicPaths,
        ...authConfig.authPaths,
      ])
    ) {
      return NextResponse.next();
    }

    // Jika belum login → redirect ke login
    if (!token) {
      return NextResponse.redirect(new URL(authConfig.loginPath, request.url));
    }

    // Jika token ada tapi level belum tersedia (masih dalam proses login)
    // Tunggu sebentar dan redirect ke login untuk memastikan token sudah lengkap
    if (
      token &&
      token.username &&
      !token.level &&
      !matchesPath(pathname, authConfig.authPaths)
    ) {
      return NextResponse.redirect(new URL(authConfig.loginPath, request.url));
    }

    // Cek akses admin
    if (matchesPath(pathname, authConfig.adminPaths)) {
      if (token.level !== 'ADMIN') {
        return NextResponse.redirect(
          new URL(authConfig.unauthorizedPath, request.url)
        );
      }
    }

    // Cek akses petugas
    if (matchesPath(pathname, authConfig.petugasPaths)) {
      if (token.level !== 'PETUGAS') {
        return NextResponse.redirect(
          new URL(authConfig.unauthorizedPath, request.url)
        );
      }
    }

    // Cek akses masyarakat → hanya bisa jika tidak ada token.level
    if (matchesPath(pathname, authConfig.masyarakatPaths)) {
      if (token.level !== 'MASYARAKAT') {
        return NextResponse.redirect(
          new URL(authConfig.unauthorizedPath, request.url)
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL(authConfig.loginPath, request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
