import mongoose from "mongoose";
import Product from "@/models/Product";
import Review from "@/models/Review";

export async function updateProductRating(productId: string | mongoose.Types.ObjectId) {
  const id =
    typeof productId === "string"
      ? new mongoose.Types.ObjectId(productId)
      : productId;

  const [stats] = await Review.aggregate([
    { $match: { product: id, approved: true } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats
    ? Math.round(stats.averageRating * 10) / 10
    : 0;
  const reviewCount = stats?.reviewCount ?? 0;

  await Product.findByIdAndUpdate(id, {
    averageRating,
    reviewCount,
  });

  return { averageRating, reviewCount };
}
