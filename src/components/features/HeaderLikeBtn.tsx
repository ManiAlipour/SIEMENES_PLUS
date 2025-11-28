"use client";

import { RootState } from "@/store";
import Link from "next/link";
import { BsBagHeart } from "react-icons/bs";
import { useSelector } from "react-redux";

export default function HeaderLikeBtn() {
  const likedProducts = useSelector((state: RootState) => state.likedPosts);

  const count = likedProducts?.length || 0;

  return (
    <Link
      href="/likes"
      className="relative p-2 text-slate-600 hover:text-cyan-600 transition bg-slate-50 hover:bg-cyan-50 rounded-full border border-slate-200 hover:border-cyan-200 group"
    >
      <BsBagHeart
        size={20}
        className="group-hover:scale-110 transition-transform"
      />

      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white 
                    text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm"
        >
          {count.toLocaleString()}
        </span>
      )}
    </Link>
  );
}
