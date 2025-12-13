"use client";
import { CiHeart } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { addProduct, removeProduct } from "@/store/slices/likedPosts";
import { useMemo, useState } from "react";

interface LikeButtonProps {
  productId: string;
  productName: string;
}

export default function LikeButton({
  productId,
  productName,
}: LikeButtonProps) {
  const likedPosts = useSelector((state: RootState) => state.likedPosts);

  // تعیین وضعیت لایک‌شدن بر اساس store
  const liked = useMemo(
    () => likedPosts.includes(productId),
    [likedPosts, productId]
  );

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    if (liked) {
      dispatch(removeProduct(productId));
    } else {
      dispatch(addProduct(productId));
    }

    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      className={`w-full flex items-center gap-2 justify-center md:w-auto px-6 py-3 rounded transition font-bold text-lg
        ${
          liked
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-primary hover:bg-primary/90 text-white"
        }`}
      aria-label={
        liked
          ? `حذف ${productName} از علاقه‌مندی‌ها`
          : `افزودن ${productName} به علاقه‌مندی‌ها`
      }
      disabled={loading}
    >
      <CiHeart className={liked ? "text-red-200 fill-red-200" : ""} />
      {liked ? "در علاقه‌مندی‌ها" : "افزودن به محصولات مورد علاقه"}
    </button>
  );
}
