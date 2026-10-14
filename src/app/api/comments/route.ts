import { NextRequest, NextResponse } from "next/server";
import { authOnly } from "@/lib/middlewares/auth";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import User from "@/models/User";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authResult = await authOnly(req);
    if (authResult instanceof NextResponse) return authResult;
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "No token provided", success: false },
        { status: 401 },
      );
    }
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }
    const userData = await User.findById(user.id);
    if (!userData) {
      return NextResponse.json(
        { message: "User not found", success: false, user },
        { status: 404 },
      );
    }

    const data = await req.json();
    const { targetType, targetId, text } = data;
    if (!targetType || !targetId || !text) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 },
      );
    }
    if (!["post", "product", "blogPost"].includes(targetType) || typeof text !== "string" || text.trim().length < 2 || text.length > 2000) {
      return NextResponse.json({ message: "اطلاعات نظر معتبر نیست", success: false }, { status: 400 });
    }
    let modelNumber = "";
    if (targetType === "product") {
      const product = await Product.findById(targetId).select("modelNumber").lean();
      if (!product) return NextResponse.json({ message: "محصول پیدا نشد", success: false }, { status: 404 });
      modelNumber = String((product as any).modelNumber || "");
    }
    await Comment.create({
      user: userData._id,
      targetType,
      targetId,
      text,
      modelNumber,
      approved: true,
    });
    return NextResponse.json(
      { message: "Comment created successfully", success: true },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "خطا در برقراری ارتباط با سرور",
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");
    const modelNumber = searchParams.get("modelNumber")?.trim();

    if ((!targetType || !targetId) && !modelNumber) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 },
      );
    }

    // also return allowed comments
    let filter: Record<string, any>;
    if (modelNumber) {
      const escapedModel = modelNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const modelRegex = { $regex: `^${escapedModel}$`, $options: "i" };
      const productIds = await Product.find({ modelNumber: modelRegex }).distinct("_id");
      filter = { approved: true, $or: [{ modelNumber: modelRegex }, { targetType: "product", targetId: { $in: productIds } }] };
    } else {
      filter = { targetType, targetId, approved: true };
    }
    const comments = await Comment.find(filter)
      .populate("user", "email name")
      .sort({ createdAt: -1 }).limit(modelNumber ? 12 : 100);

    return NextResponse.json({
      data: comments.map((c) => ({
        _id: c._id,
        text: c.text,
        modelNumber: c.modelNumber || modelNumber || "",
        createdAt: c.createdAt,
        user:
          typeof c.user === "object" && c.user
            ? {
                name: (c.user as { name?: string }).name,
                email: (c.user as { email?: string }).email,
              }
            : undefined,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "خطا در برقراری ارتباط با سرور",
        data: null,
      },
      { status: 500 },
    );
  }
}
