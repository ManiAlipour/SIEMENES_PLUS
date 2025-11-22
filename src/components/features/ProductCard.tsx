"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import LikeProduct from "./LikeProduct";
import { FiStar, FiShoppingCart, FiEye, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price?: number;
  inStock?: boolean;
  brand?: string;
  isFeatured?: boolean;
  slug?: string;
  className?: string;
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  inStock = true,
  brand,
  isFeatured = false,
  slug,
  className = "",
}: ProductCardProps) {
  const router = useRouter();
  const productUrl = slug ? `/products/${slug}` : `/products/${id}`;

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  // --- Handlers ---
  const handleNavigate = () => router.push(productUrl);
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Connect to cart system
  };

  // --- SEO: Local JSON-LD for Product ---
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    image,
    brand: { "@type": "Brand", name: brand || "Siemens" },
    offers: {
      "@type": "Offer",
      url: `https://site-mohandesi.ir${productUrl}`,
      priceCurrency: "IRR",
      price: price || 0,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <motion.article
      itemProp="itemListElement"
      itemType="https://schema.org/Product"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.42, 0, 0.58, 1] }}
      viewport={{ once: true }}
      className={`group flex flex-col h-full relative bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${className}`}
      aria-label={`کارت محصول ${name}`}
    >
      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(productJsonLd)}
      </script>

      {/* Badge ویژه */}
      {isFeatured && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl backdrop-blur-sm"
        >
          <FiStar className="w-3.5 h-3.5 animate-pulse" />
          <span>ویژه</span>
        </motion.div>
      )}

      {/* Brand & Like */}
      {brand && (
        <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-gray-200">
          {brand}
        </div>
      )}
      <div
        className="absolute top-4 left-4 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <LikeProduct id={id} />
      </div>

      {/* تصویر اصلی */}
      <div
        onClick={handleNavigate}
        className="relative w-full aspect-square bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        <Image
          src={image}
          alt={`${name} ${brand ? "، محصول برند " + brand : ""}`}
          fill
          className="object-contain p-4 sm:p-6 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[1deg]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Shine */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-[0.42,0,0.58,1] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Desktop CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span>سبد خرید</span>
          </button>
          <button
            onClick={handleNavigate}
            className="flex-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold py-2.5 rounded-xl border-2 border-gray-200 hover:border-primary hover:text-primary flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <FiEye className="w-4 h-4" />
            <span>مشاهده</span>
          </button>
        </div>
      </div>

      {/* اطلاعات محصول */}
      <div className="flex flex-col grow justify-between p-5 gap-4 bg-white">
        <h3
          onClick={handleNavigate}
          className="cursor-pointer font-bold text-base md:text-lg text-gray-900 line-clamp-2 min-h-[3.5rem] leading-relaxed hover:text-primary transition-colors duration-300"
        >
          {name}
        </h3>

        {/* قیمت */}
        {price && (
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              {formatPrice(price)}
            </span>
            <span className="text-sm text-gray-500 font-medium">تومان</span>
          </div>
        )}

        {/* وضعیت */}
        {inStock !== undefined && (
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
        )}
      </div>

      {/* CTA موبایل */}
      <Link
        href={productUrl}
        className="sm:hidden w-full bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all"
      >
        <span>مشاهده</span>
        <FiArrowLeft className="w-4 h-4" />
      </Link>
    </motion.article>
  );
}
