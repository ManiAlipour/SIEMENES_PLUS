import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const authPaths = ["/login", "/register", "/verify"];

const publicPaths = [
  "/",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/verify",
];
const adminPaths = ["/dashboard/admin", "/api/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // check token in auth page and if token is valid, redirect to dashboard
  if (authPaths.some((path) => pathname.startsWith(path))) {
    const token = request.cookies.get("token")?.value;
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: "user" | "admin";
    };

    if (adminPaths.some((path) => pathname.startsWith(path))) {
      if (decoded.role !== "admin") {
        console.warn(`🚫 User ${decoded.email} tried accessing admin route`);
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }

    const response = NextResponse.next();

    response.headers.set("x-user-id", decoded.id);
    response.headers.set("x-user-role", decoded.role);

    return response;
  } catch (error: any) {
    console.error("🚨 Invalid or expired token:", error.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

/**
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/(admin|user|profile)/:path*",
    "/login",
    "/register",
    "/verify",
  ],
};
