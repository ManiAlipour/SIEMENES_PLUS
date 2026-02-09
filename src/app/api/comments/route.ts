import { NextRequest, NextResponse } from "next/server";
import { authOnly } from "@/lib/middlewares/auth";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    await authOnly(req);
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
    const comment = await Comment.create({
      user: userData._id,
      targetType,
      targetId,
      text,
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

    if (!targetType || !targetId) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 },
      );
    }

    // also return allowed comments
    const comments = await Comment.find({ targetType, targetId })
      .populate("user", "email name")
      .sort({ createdAt: -1 });

    const allowdComments = comments.filter(c => c.approved)
    return NextResponse.json({ data: allowdComments });
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
