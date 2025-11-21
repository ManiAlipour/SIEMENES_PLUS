"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LikeProduct from "./LikeProduct";
import { FiStar, FiShoppingCart, FiEye, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price?: number;
  inStock?: boolean;
  className?: string;
  brand?: string;
  isFeatured?: boolean;
  slug?: string;
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  inStock = true,
  className = "",
  brand,
  isFeatured = false,
  slug,
}: ProductCardProps) {
  const router = useRouter();
  const productUrl = slug ? `/products/${slug}` : `/products/${id}`;

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const handleImageClick = () => {
    router.push(productUrl);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Add to cart logic
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex flex-col h-full relative bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:border-primary/30 ${className}`}
      role="group"
      aria-label={`کارت محصول ${name}`}
    >
      {/* Badge محصول ویژه */}
      {isFeatured && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="absolute top-4 right-4 z-30 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 backdrop-blur-sm"
        >
          <FiStar className="w-3.5 h-3.5 fill-current animate-pulse" />
          <span>ویژه</span>
        </motion.div>
      )}

      {/* تصویر محصول */}
      <div
        onClick={handleImageClick}
        className="relative w-full aspect-square bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        {/* Badge برند */}
        {brand && (
          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-gray-200">
            {brand}
          </div>
        )}

        {/* دکمه لایک */}
        <div
          className="absolute top-4 left-4 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <LikeProduct id={id} />
        </div>

        {/* تصویر */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4 sm:p-6 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={isFeatured}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* دکمه‌های سریع - Desktop */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span>سبد خرید</span>
          </button>
          <button
            onClick={handleImageClick}
            className="flex-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-primary hover:text-primary shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FiEye className="w-4 h-4" />
            <span>مشاهده</span>
          </button>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* اطلاعات محصول */}
      <div className="flex flex-col grow justify-between p-5 gap-4 bg-white">
        <div className="flex-1">
          <Link
            href={productUrl}
            className="block mb-3 group/link"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base md:text-lg text-gray-900 line-clamp-2 min-h-[3.5rem] group-hover/link:text-primary transition-colors duration-300 leading-relaxed">
              {name}
            </h3>
          </Link>

          {/* قیمت */}
          {price && (
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                {formatPrice(price)}
              </span>
              <span className="text-sm text-gray-500 font-medium">تومان</span>
            </div>
          )}

          {/* وضعیت موجودی */}
          {inStock !== undefined && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                  inStock
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    inStock ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {inStock ? "موجود در انبار" : "ناموجود"}
              </span>
            </div>
          )}
        </div>

        {/* دکمه مشاهده (موبایل) */}
        <Link
          href={productUrl}
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-bold py-3 px-4 rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 sm:hidden"
        >
          <span>مشاهده جزئیات</span>
          <FiArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
