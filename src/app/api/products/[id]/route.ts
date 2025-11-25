import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: { id: string };
};

// Helper to find similar products by brand/category but not itself
async function getSimilarProducts(product: any, limit: number = 8) {
  if (!product) return [];
  const filter: any = { _id: { $ne: product._id }, $or: [] };
  if (product.brand) filter.$or.push({ brand: product.brand });
  if (product.category) filter.$or.push({ category: product.category });

  if (filter.$or.length > 0) {
    return await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  } else {
    // fallback: latest products (not itself)
    return await Product.find({ _id: { $ne: product._id } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: idOrSlug } = await context.params;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId ? { _id: idOrSlug } : { slug: idOrSlug };

    const product = await Product.findOne(query).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "محصول پیدا نشد 😕" },
        { status: 404 }
      );
    }

    const similarProducts = await getSimilarProducts(product, 10);

    return NextResponse.json({
      success: true,
      product: { ...product, similarProducts },
    });
  } catch (error: any) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت محصول" },
      { status: 500 }
    );
  }
}
