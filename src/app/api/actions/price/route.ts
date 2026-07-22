import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import UserAction from "@/models/PriceAction";

const ALLOWED_CHANNELS = [
  "WHATSAPP",
  "TELEGRAM",
  "INSTAGRAM",
  "CALL",
] as const;

type Channel = (typeof ALLOWED_CHANNELS)[number];

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { productId, userId, sessionId, channel, meta } = body;

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "شناسه محصول (productId) نامعتبر است." },
        { status: 400 },
      );
    }

    if (userId && !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "شناسه کاربر نامعتبر است." },
        { status: 400 },
      );
    }

    const resolvedChannel: Channel =
      channel && ALLOWED_CHANNELS.includes(channel)
        ? channel
        : "WHATSAPP";

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    const newAction = await UserAction.create({
      type: "PRICE",
      productId,
      userId: userId || undefined,
      sessionId,
      channel: resolvedChannel,
      meta,
      ip,
      userAgent,
    });

    return NextResponse.json(
      { success: true, actionId: newAction._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error logging user action:", error);
    return NextResponse.json(
      { error: "خطایی در ثبت درخواست رخ داد." },
      { status: 500 },
    );
  }
}
