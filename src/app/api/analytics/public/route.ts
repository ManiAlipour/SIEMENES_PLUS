import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PageView from "@/models/PageView";
import ProductView from "@/models/ProductView";
import SearchQuery from "@/models/SearchQuery";
import Product from "@/models/Product";
import Post from "@/models/Post";
import User from "@/models/User";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "overview";

    switch (type) {
      case "overview": {
        const [
          totalProducts,
          totalPosts,
          totalUsers,
          totalPageViews,
          totalProductViews,
          totalSearches,
        ] = await Promise.all([
          Product.countDocuments(),
          Post.countDocuments(),
          User.countDocuments({ verified: true }),
          PageView.countDocuments(),
          ProductView.countDocuments(),
          SearchQuery.countDocuments(),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            totalProducts,
            totalPosts,
            totalUsers,
            totalPageViews,
            totalProductViews,
            totalSearches,
          },
        });
      }

      case "popular-products": {
        const popularProducts = await ProductView.aggregate([
          {
            $group: {
              _id: "$productId",
              views: { $sum: 1 },
            },
          },
          { $sort: { views: -1 } },
          { $limit: 10 },
        ]);

        const productIds = popularProducts.map((p) => p._id);
        const products = (await Product.find({
          _id: { $in: productIds },
        })
          .select("name slug image brand")
          .lean()) as Product[];

        const productsWithViews = products.map((product) => {
          const viewData = popularProducts.find(
            (pv) => pv._id.toString() === product._id.toString()
          );
          return {
            ...product,
            views: viewData?.views || 0,
          };
        });

        return NextResponse.json({
          success: true,
          data: productsWithViews.sort((a, b) => b.views - a.views),
        });
      }

      case "top-searches": {
        const topSearches = await SearchQuery.aggregate([
          {
            $group: {
              _id: { $ifNull: ["$normalizedQuery", "$query"] },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]);

        return NextResponse.json({
          success: true,
          data: topSearches.map((item) => ({
            query: item._id,
            count: item.count,
          })),
        });
      }

      case "monthly-views": {
        const monthlyViews = await PageView.aggregate([
          {
            $group: {
              _id: { month: { $month: "$timestamp" } },
              total: { $sum: 1 },
            },
          },
          { $sort: { "_id.month": 1 } },
        ]);

        const data = monthlyViews.map((item) => ({
          month: MONTH_NAMES[item._id.month - 1],
          views: item.total,
        }));

        return NextResponse.json({
          success: true,
          data,
        });
      }

      default:
        return NextResponse.json(
          { success: false, message: "نوع درخواست نامعتبر است" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Public Analytics API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات آماری",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
