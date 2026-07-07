// app/api/actions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserAction from "@/models/PriceAction";// مسیر مدل خودت

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { productId, userId, sessionId, channel, meta } = body;

   if (!productId) {
      return NextResponse.json(
        { error: "شناسه محصول (productId) الزامی است." },
        { status: 400 },
      );
    }

   const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    const newAction = await UserAction.create({
      type: "PRICE",
      productId,
      userId: userId || undefined,
      sessionId,
      channel: channel || "WHATSAPP",
      meta,
      ip,
      userAgent,
    });

    return NextResponse.json(
      { success: true, actionId: newAction._id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error logging user action:", error);
    return NextResponse.json(
      { error: "خطایی در ثبت درخواست رخ داد." },
      { status: 500 },
    );
  }
}
