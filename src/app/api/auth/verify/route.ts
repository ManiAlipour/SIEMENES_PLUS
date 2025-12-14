import { NextResponse } from "next/server";
import { verifyEmail } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    const { token, user, message } = await verifyEmail({ email, code });

    const res = NextResponse.json({ user, message }, { status: 200 });
    // ست کردن توکن در cookie
    res.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 روز
      path: "/",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Verification failed" },
      { status: 400 }
    );
  }
}
