import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Menjaga semua rute /dashboard/* — harus punya sesi valid.
// Pemeriksaan izin per-modul (role tertentu) dilakukan lagi di masing-masing
// halaman/server action, karena middleware hanya tahu role dari token JWT,
// bukan status terbaru di database (mis. akun baru dinonaktifkan).
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
