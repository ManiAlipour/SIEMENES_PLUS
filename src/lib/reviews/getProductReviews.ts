import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";

export type ProductReviewItem = {
  _id: string;
  rating: number;
  title?: string;
  text: string;
  createdAt: string;
  user?: {
    name?: string;
  };
};

export type ProductReviewAggregate = {
  averageRating: number;
  reviewCount: number;
};

export async function getProductReviews(
  productId: string,
  limit = 10,
): Promise<{
  reviews: ProductReviewItem[];
  aggregate: ProductReviewAggregate;
}> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return { reviews: [], aggregate: { averageRating: 0, reviewCount: 0 } };
  }

  const objectId = new mongoose.Types.ObjectId(productId);

  const [reviews, [stats]] = await Promise.all([
    Review.find({ product: objectId, approved: true })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    Review.aggregate([
      { $match: { product: objectId, approved: true } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const averageRating = stats
    ? Math.round(stats.averageRating * 10) / 10
    : 0;
  const reviewCount = stats?.reviewCount ?? 0;

  return {
    aggregate: { averageRating, reviewCount },
    reviews: reviews.map((r: any) => ({
      _id: String(r._id),
      rating: r.rating,
      title: r.title || undefined,
      text: r.text,
      createdAt:
        r.createdAt instanceof Date
          ? r.createdAt.toISOString()
          : String(r.createdAt),
      user:
        r.user && typeof r.user === "object"
          ? { name: r.user.name }
          : undefined,
    })),
  };
}
