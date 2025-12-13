import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const limit = Number(searchParams.get("limit") || 10);
    const page = Number(searchParams.get("page") || 1);
    const modelNumber = searchParams.get("modelNumber");
    const category = searchParams.get("category");
    const isFeatured = searchParams.get("isFeatured");
    const sort = searchParams.get("sort") || "-createdAt";

    const filter: any = {};

    if (search) {
      const searchRegex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [
        { name: { $regex: searchRegex } },
        { slug: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { brand: { $regex: searchRegex } },
        { modelNumber: { $regex: searchRegex } },
        { "specifications.key": { $regex: searchRegex } },
        { "specifications.value": { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ];
    }

    if (modelNumber) {
      filter.modelNumber = { $regex: modelNumber, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (isFeatured === "true") {
      filter.isFeatured = true;
    }

    const safeSort = /^[\w\-\s]+$/.test(sort) ? sort : "-createdAt";

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(safeSort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      items,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت محصولات",
      },
      { status: 500 }
    );
  }
}
