import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { toCategoryDTO } from "@/types/category";

export async function GET() {
  try {
    await connectDB();

    const docs = await Category.find(
      {},
      "name slug parent image description isFeatured createdAt updatedAt"
    )
      .sort({ createdAt: -1 })
      .lean();

    const data = docs.map((doc) =>
      toCategoryDTO({
        ...doc,
        _id: doc._id,
        parent: doc.parent,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })
    );

    return NextResponse.json({
      success: true,
      message: "کتگوری ها با موفقیت دریافت شد!",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در ارتباط با سرور!" },
      { status: 500 }
    );
  }
}
