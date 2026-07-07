import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import PriceAction from "@/models/PriceAction";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await adminOnly(req);

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") || 10), 1),
      100,
    );
    const skip = (page - 1) * limit;

    const productId = searchParams.get("productId");
    const channel = searchParams.get("channel");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const filter: Record<string, any> = {
      type: "PRICE",
    };

    if (productId) {
      if (!Types.ObjectId.isValid(productId)) {
        return NextResponse.json(
          { error: "productId نامعتبر است." },
          { status: 400 },
        );
      }
      filter.productId = new Types.ObjectId(productId);
    }

    if (channel) {
      filter.channel = channel;
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const [actions, total] = await Promise.all([
      PriceAction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("productId", "title slug")
        .lean(),
      PriceAction.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: actions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching price actions:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اکشن‌ها." },
      { status: 500 },
    );
  }
}
