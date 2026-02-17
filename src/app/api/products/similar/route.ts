import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/products/similar?productId=xxx | ?slug=yyy
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const slug = searchParams.get("slug");

    let product;

    if (productId) {
      // By Mongo ID
      product = await Product.findById(productId).lean();
    } else if (slug) {
      // By slug
      product = await Product.findOne({ slug }).lean();
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    // Find similar products according to brand and/or category, but NOT itself
    const filter: any = {
      _id: { $ne: product._id },
      $or: [],
    };
    if (product.brand) filter.$or.push({ brand: product.brand });
    if (product.category) filter.$or.push({ category: product.category });

    // If neither brand nor category present, fallback to last 8 products not itself
    let similar;
    if (filter.$or.length > 0) {
      similar = await Product.find(filter)
        .sort({ createdAt: -1 })
        .limit(8)
        .lean();
    } else {
      similar = await Product.find({ _id: { $ne: product._id } })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean();
    }

    return NextResponse.json({
      success: true,
      similar,
    });
  } catch (error: any) {
    console.error("GET /api/products/similar error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت محصولات مشابه" },
      { status: 500 }
    );
  }
}
