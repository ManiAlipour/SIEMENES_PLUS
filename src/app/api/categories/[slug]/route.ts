import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "شناسه دسته‌بندی ارسال نشده است.",
        },
        { status: 400 }
      );
    }

    const mongodbIdRegex = /^[0-9a-fA-F]{24}$/;

    const isMongoId = mongodbIdRegex.test(slug);

    let products = [];

    if (isMongoId) {
      const category = await Category.findById(slug);

      products = await Product.find({ category: category.slug });
    } else products = await Product.find({ category: slug });

    // اگر محصول برای کتگوری پیدا نشد
    if (!products || products.length === 0) {
      return NextResponse.json({
        data: [],
        success: true,
        message: "محصولی یافت نشد",
      });
    }

    return NextResponse.json({
      data: products,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ data: null, success: false }, { status: 500 });
  }
}
