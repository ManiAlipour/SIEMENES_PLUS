import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { escapeRegex, logSearchQuery, normalizeSearchQuery } from "@/lib/analytics/search";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = (searchParams.get("search") || "").trim();
    const limit = Number(searchParams.get("limit") || 10);
    const page = Number(searchParams.get("page") || 1);
    const modelNumber = searchParams.get("modelNumber");
    let category = searchParams.get("category");
    const isFeatured = searchParams.get("isFeatured");
    const sort = searchParams.get("sort") || "-createdAt";

    const filter: any = {};

    if (category && /^[a-f\d]{24}$/i.test(category.trim())) {
      const catDoc = await Category.findById(category.trim());
      if (catDoc && catDoc.slug) {
        category = catDoc.slug;
      }
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");

      let idOrSlugConditions: any[] = [];
      if (/^[a-f\d]{24}$/i.test(search.trim())) {
        idOrSlugConditions.push({ _id: search.trim() });
      }
      idOrSlugConditions.push({ slug: search.trim() });

      filter.$or = [
        { name: { $regex: searchRegex } },
        { slug: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { brand: { $regex: searchRegex } },
        { modelNumber: { $regex: searchRegex } },
        { "specifications.key": { $regex: searchRegex } },
        { "specifications.value": { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        ...idOrSlugConditions,
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

    if (search && page === 1) {
      try {
        const cookie = await cookies()
        const tokenValue = cookie.get("token")?.value;
        let userId: string | null = null;
        if (tokenValue) {
          try {
            userId = verifyToken(tokenValue).id;
          } catch {
            userId = null;
          }
        }

        await logSearchQuery({
          query: search,
          normalizedQuery: normalizeSearchQuery(search),
          totalResults: total,
          source: "products",
          userId,
          meta: {
            category,
            modelNumber,
            isFeatured,
            sort: safeSort,
          },
        });
      } catch (err) {
        console.error("SearchQuery log failed (products):", err);
      }
    }

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
