import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export const runtime = "nodejs";

const authPaths = ["/login", "/register", "/verify"];
const publicPaths = ["/api/auth/login", "/api/auth/signup", "/api/auth/verify"];
const dashboardPath = "/dashboard";
const adminPaths = ["/admin", "/api/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // جلوگیری از ورود کاربران لاگین‌کرده به صفحات ثبت‌نام یا ورود
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next(); // اجازه بده صفحه لاگین کار کنه
  }

  // مسیرهای عمومی مثل API‌های ثبت‌نام و لاگین آزادند
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // صفحات محافظت‌شده نیاز به توکن دارند
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = verifyToken(token);

    // کنترل سطح دسترسی ادمین
    if (adminPaths.some((path) => pathname.startsWith(path))) {
      if (decoded.role !== "admin") {
        console.warn(`🚫 ${decoded.email} tried to access admin route`);
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }

    // مسیر داشبورد کاربر معمولی
    if (pathname.startsWith(dashboardPath)) {
      if (decoded.role === "admin")
        return NextResponse.redirect(new URL("/admin", request.url));
      if (decoded.role !== "user")
        return NextResponse.redirect(new URL("/", request.url));
    }

    // ادامه اجرای درخواست
    const res = NextResponse.next();
    res.headers.set("x-user-id", decoded.id);
    res.headers.set("x-user-role", decoded.role);
    return res;
  } catch (error: any) {
    console.error("🚨 Invalid or expired token:", error.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/(admin|user|profile)/:path*",
    "/login",
    "/register",
    "/verify",
    "/admin/:path*",
  ],
};
