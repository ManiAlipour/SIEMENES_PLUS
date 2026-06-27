import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { logSearchQuery, normalizeSearchQuery } from "@/lib/analytics/search";
import { queryProducts } from "@/lib/products/query";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = (searchParams.get("search") || "").trim();
    const limit = Number(searchParams.get("limit") || 10);
    const page = Number(searchParams.get("page") || 1);
    const modelNumber = searchParams.get("modelNumber") || undefined;
    const category = searchParams.get("category") || undefined;
    const isFeatured = searchParams.get("isFeatured") === "true";
    const sort = searchParams.get("sort") || "-createdAt";

    const { items, total, pages } = await queryProducts({
      search,
      category,
      sort,
      page,
      limit,
      modelNumber,
      isFeatured,
    });

    const safeSort = /^[\w\-\s]+$/.test(sort) ? sort : "-createdAt";

    if (search && page === 1) {
      try {
        const cookie = await cookies();
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
      pages,
      items,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت محصولات",
      },
      { status: 500 },
    );
  }
}
