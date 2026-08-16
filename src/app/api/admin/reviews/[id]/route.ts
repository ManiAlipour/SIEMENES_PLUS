import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { updateProductRating } from "@/lib/reviews/updateProductRating";
import Review from "@/models/Review";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await adminOnly(req);
    if (authResult) return authResult;

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "شناسه نظر نامعتبر است" },
        { status: 400 },
      );
    }

    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "نظر مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    await updateProductRating(deleted.product);

    return NextResponse.json({
      success: true,
      message: "نظر با موفقیت حذف شد",
      data: { id: deleted._id },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "خطای داخلی سرور",
      },
      { status: 500 },
    );
  }
}
