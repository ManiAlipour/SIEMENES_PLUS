import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import { adminOnly } from "@/lib/middlewares/adminOnly";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await connectDB();

    adminOnly(request);

    const comments = await Comment.find()
      .populate("user", "email name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      data: comments.map((c: any) => ({
        _id: c._id,
        text: c.text,
        targetType: c.targetType,
        createdAt: c.createdAt,
        user:
          c.user && typeof c.user === "object"
            ? {
                _id: c.user._id,
                email: c.user.email,
                name: c.user.name,
              }
            : undefined,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    await adminOnly(request);

    const { commentId, approved } = await request.json();
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { approved },
      { new: true },
    );
    return NextResponse.json({ comment: updatedComment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
