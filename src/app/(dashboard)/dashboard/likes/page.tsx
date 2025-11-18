"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import Link from "next/link";

export default function FavoritePage() {
  const likedPosts = useSelector((state: RootState) => state.likedPosts || []);

  if (!likedPosts.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#f9fafc] text-meuted font-[Vazirmatn]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-4xl">💙</span>
        </div>
        <h1 className="text-lg font-semibold">هنوز چیزی لایک نکردید!</h1>
        <p className="mt-1 text-sm text-gray-500">
          محصولات لایک شده توسط شما اینجا نمایش داده خواهد شد ...
        </p>

        <Link
          className="px-4 py-2 rounded-xl text-highlight border border-highlight
          mt-4"
          href="/shop"
        >
          رفتن به فروشگاه
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f9fafc] px-4 sm:px-8 py-10 font-[Vazirmatn]">
      <h1 className="text-2xl font-bold text-meuted mb-8">
        موارد دلخواه من ❤️
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {likedPosts.map((post: any, idx: number) => (
          <div
            key={idx}
            className="group rounded-xl bg-white/70 backdrop-blur-lg shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
          >
            <div className="w-full h-48 bg-gray-100 relative">
              <Image
                src={post.image || "/placeholder.png"}
                alt={post.title || "محصول"}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="p-4 text-meuted">
              <h2 className="text-base font-semibold truncate">{post.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {post.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-primary">
                  {post.price ? `${post.price} تومان` : "—"}
                </span>
                <Link
                  href={`/products/${post.id}`}
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  مشاهده
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
