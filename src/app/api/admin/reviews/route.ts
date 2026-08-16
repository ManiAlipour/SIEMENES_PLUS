import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { updateProductRating } from "@/lib/reviews/updateProductRating";
import Review from "@/models/Review";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const authResult = await adminOnly(request);
    if (authResult) return authResult;

    await connectDB();

    const reviews = await Review.find()
      .populate("user", "email name")
      .populate("product", "name slug modelNumber")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      data: reviews.map((r: any) => ({
        _id: r._id,
        rating: r.rating,
        title: r.title || "",
        text: r.text,
        approved: r.approved,
        createdAt: r.createdAt,
        product:
          r.product && typeof r.product === "object"
            ? {
                _id: r.product._id,
                name: r.product.name,
                slug: r.product.slug,
                modelNumber: r.product.modelNumber,
              }
            : undefined,
        user:
          r.user && typeof r.user === "object"
            ? {
                _id: r.user._id,
                email: r.user.email,
                name: r.user.name,
              }
            : undefined,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await adminOnly(request);
    if (authResult) return authResult;

    await connectDB();

    const { reviewId, approved } = await request.json();
    if (!reviewId || typeof approved !== "boolean") {
      return NextResponse.json(
        { error: "reviewId و approved الزامی است" },
        { status: 400 },
      );
    }

    const updated = await Review.findByIdAndUpdate(
      reviewId,
      { approved },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json({ error: "نظر یافت نشد" }, { status: 404 });
    }

    await updateProductRating(updated.product);

    return NextResponse.json({ review: updated, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
