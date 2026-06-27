"use client";

import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addProduct } from "@/store/slices/likedPosts";

export default function ProductActions({
  id,
  inStock,
}: {
  id: string;
  inStock?: boolean;
}) {
  const dispatch = useDispatch();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addProduct(id));
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addProduct(id));
  };

  return (
    <div
      className="
      absolute inset-0 flex items-center justify-center gap-3
      opacity-0 group-hover:opacity-100
      transition bg-black/20
    "
    >
      <button
        onClick={handleLike}
        className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow"
      >
        <FiHeart />
      </button>

      <button
        onClick={handleAdd}
        disabled={!inStock}
        className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow disabled:opacity-50"
      >
        <FiShoppingCart />
      </button>
    </div>
  );
}
