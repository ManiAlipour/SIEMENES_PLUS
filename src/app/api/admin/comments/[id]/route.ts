import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await adminOnly(req);
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "شناسه کامنت نامعتبر است" },
        { status: 400 },
      );
    }

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return NextResponse.json(
        { success: false, message: "کامنت مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "کامنت با موفقیت حذف شد",
      data: {
        id: deletedComment._id,
      },
    });
  } catch (error: any) {
    console.error("DELETE COMMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "خطای داخلی سرور",
      },
      { status: 500 },
    );
  }
}
