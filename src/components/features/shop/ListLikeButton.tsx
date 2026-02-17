"use client";

import { useState } from "react";

interface LikeButtonProps {
  productId: string;
  initialLiked?: boolean;
  onToggle?: (productId: string, liked: boolean) => void;
}

export default function ListLikeButton({
  productId,
  initialLiked = false,
  onToggle,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);

  const handleClick = () => {
    const newState = !liked;
    setLiked(newState);
    onToggle?.(productId, newState);
    // TODO: اتصال به API لایک در backend
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className="flex items-center justify-center w-10 h-10 rounded-full 
                 border border-slate-300/60 bg-gradient-to-br from-white/40 to-slate-100
                 hover:shadow-md hover:shadow-cyan-500/20 active:scale-90 transition-transform duration-150"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={liked ? "url(#cyanGradient)" : "none"}
        stroke={liked ? "none" : "currentColor"}
        strokeWidth={1.5}
        className={`w-5 h-5 ${liked ? "" : "text-gray-500"}`}
      >
        <defs>
          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#0e7490" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.025-4.5-4.5-4.5-1.74 0-3.255 1.005-4 2.475C12.255 4.755 10.74 3.75 9 3.75 6.525 3.75 4.5 5.765 4.5 8.25c0 7.198 7.5 11.25 7.5 11.25s7.5-4.052 7.5-11.25z"
        />
      </svg>
    </button>
  );
}
