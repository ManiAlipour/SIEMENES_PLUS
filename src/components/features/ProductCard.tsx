"use client";

import Image from "next/image";
import LikeProduct from "./LikeProduct";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price?: number;
  inStock?: boolean;
  className?: string;
}

export default function ProductCard({
  id,
  name,
  image,
  // inStock = true,
  className = "",
}: ProductCardProps) {
  return (
    <div
      key={id}
      className={`
        flex flex-col h-full relative bg-white
        border border-gray-100 rounded-xl overflow-hidden
        shadow-sm transition-all duration-300
        hover:-translate-y-[3px] hover:shadow-md sm:hover:shadow-lg
        focus-within:shadow-lg focus-within:-translate-y-[3px]
        sm:hover:-translate-y-1
        ${className}
      `}
      role="group"
      aria-label={`کارت محصول ${name}`}
    >
      {/* 🔹 تصویر محصول */}
      <div
        className="
          relative w-full aspect-4/3 sm:aspect-square 
          bg-linear-to-b from-white to-[#f6f9fc]
          flex items-center justify-center
        "
      >
        <div className="absolute top-4 left-4 z-10">
          <LikeProduct id={id} />
        </div>

        {/* 🖼️ تصویر */}
        <Image
          src={image}
          alt={name}
          fill
          className="
            object-contain p-3 sm:p-4 
            transition-transform duration-300 
            group-hover:scale-[1.02]
          "
          sizes="(max-width:768px) 90vw, 33vw"
          priority
        />
      </div>

      {/* 🔹 اطلاعات و دکمه‌ها */}
      <div className="flex flex-col grow justify-between w-full p-3 sm:p-4 gap-2">
        <div>
          <h3
            className="
              font-vazir-semibold text-[13px] sm:text-sm md:text-base
              text-gray-800 text-start sm:text-center
              line-clamp-2 min-h-[40px]
            "
          >
            {name}
          </h3>
        </div>

        {/* 🔘 دکمه مشاهده */}
        <div className="relative flex flex-col sm:flex-row justify-center items-center gap-2 mt-2 flex-wrap">
          <button
            className="
              w-full sm:w-auto
              bg-teal-600 text-white text-[13px] sm:text-sm font-vazir-semibold
              rounded-md px-4 py-2 transition duration-300
              hover:brightness-:outline-none
              focus:ring-2 focus:ring-teal-500/60 focus:ring-offset-1
            "
          >
            مشاهده
          </button>
        </div>
      </div>
    </div>
  );
}
