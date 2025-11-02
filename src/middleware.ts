// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// مسیرهای آزاد:
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/verify",
];

// مسیرهای مخصوص Admin
const adminPaths = ["/dashboard/admin", "/api/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // مسیرهای آزاد: ادامه بده
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // استخراج token از کوکی
  const token = req.cookies.get("token")?.value;

  // اگر کوکی نداشت → not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    // بررسی سطح دسترسی
    if (adminPaths.some((path) => pathname.startsWith(path))) {
      if (decoded.role !== "admin") {
        console.warn(`User ${decoded.email} tried admin route`);
        return NextResponse.redirect(new URL("/403", req.url)); // صفحه forbidden
      }
    }

    // ساخت Response
    const res = NextResponse.next();

    // قرار دادن هدر اضافی برای backend
    res.headers.set("x-user-id", decoded.id);
    res.headers.set("x-user-role", decoded.role);

    return res;
  } catch (err: any) {
    console.error("Invalid or expired token:", err.message);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// مشخص می‌کنیم middleware روی چه مسیرهایی اعمال شود
export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*", "/api/user/:path*"],
};
