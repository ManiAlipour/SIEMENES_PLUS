import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ProductView from "@/models/ProductView";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { url, userAgent } = await req.json();

    const tokenValue = req.cookies.get("token")?.value;
    let userId: string | null = null;

    if (tokenValue) {
      try {
        const decoded = verifyToken(tokenValue);
        userId = decoded?.id || null;
      } catch (err) {
        userId = null; // Invalid token
      }
    }

    if (!url || !userAgent) {
      return NextResponse.json(
        { ok: false, error: "پارامترهای الزامی ارسال نشده‌اند." },
        { status: 400 },
      );
    }

    let ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      (req as any).ip ||
      null;

    await ProductView.create({
      url,
      userAgent,
      ip,
      userId,
      timestamp: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "خطای سرور" },
      { status: 500 },
    );
  }
}
