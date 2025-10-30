"use client";

import Image from "next/image";

interface ProductCardProps {
  id: number | string;
  name: string;
  image: string;
  price: number;
  inStock?: boolean;
  className?: string;
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  inStock = true,
  className = "",
}: ProductCardProps) {
  return (
    <div
      key={id}
      className={`
         bg-white border border-gray-100 rounded-xl shadow-sm hover:brightness-105
        hover:shadow-md transition-all duration-300 hover:-translate-y-1
        flex flex-col justify-between items-center overflow-hidden
        ${className}
        `}
    >
      {/* تصویر محصول */}
      <div className="relative w-full aspect-square">
        <Image
          src={image}
          alt={name}
          fill
          className="w-full h-[140px] md:h-[180px] object-contain mx-auto"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>

      {/* توضیحات و دکمه‌ها */}
      <div className="flex flex-col justify-between w-full p-4 gap-2">
        <h3 className="font-vazir-semibold text-sm md:text-base text-gray-800 text-center">
          {name}
        </h3>

        <p className="text-primary font-vazir tracking-tight text-sm md:text-base text-center">
          {price.toLocaleString("fa-IR")} تومان
        </p>

        <div className="flex justify-center items-center gap-2 mt-2 flex-wrap">
          <button
            className="
              bg-primary text-white text-xs md:text-sm font-vazir-semibold rounded-md 
              px-4 py-2 transition-all duration-300 hover:brightness-110
            "
          >
            مشاهده
          </button>

          {inStock ? (
            <button
              className="
                border border-primary text-primary bg-primary/5
                text-xs md:text-sm font-vazir-semibold rounded-md 
                px-4 py-2 transition-all duration-300 hover:bg-primary/10
              "
            >
              افزودن به سبد
            </button>
          ) : (
            <span className="text-xs text-red-500 font-vazir-medium">
              ناموجود
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
