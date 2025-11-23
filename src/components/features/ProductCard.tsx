"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import LikeButton from "./LikeProduct"
import { FiStar, FiEye, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
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

  const formatPrice = (price?: number) =>
    price ? new Intl.NumberFormat("fa-IR").format(price) : null;

  const handleNavigate = () => router.push(productUrl);

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
      aria-label={`کارت محصول ${name}`}
      className={`group flex flex-col h-full relative bg-white border border-gray-100 
                  rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_6px_16px_rgba(6,182,212,0.2)]
                  hover:-translate-y-[0.6rem] transition-all duration-500 ${className}`}
    >
      {/* SEO JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(productJsonLd)}
      </script>

      {/* Badge ویژه */}
      {isFeatured && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="absolute top-3 left-3 z-30 flex items-center gap-1.5 
                     bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 
                     text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm"
        >
          <FiStar className="w-3 h-3 animate-pulse" />
          <span>ویژه</span>
        </motion.div>
      )}

      {/* Brand + Like */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        {brand && (
          <span className="bg-slate-100 text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">
            {brand}
          </span>
        )}
        <LikeButton id={id} size={16} />
      </div>

      {/* تصویر محصول */}
      <div
        onClick={handleNavigate}
        className="relative w-full aspect-[4/3] sm:aspect-square 
                   bg-gradient-to-br from-slate-50 via-white to-blue-50/30 
                   flex items-center justify-center overflow-hidden cursor-pointer"
      >
        <Image
          src={image}
          alt={`${name} ${brand ? "، محصول برند " + brand : ""}`}
          fill
          className="object-contain p-3 sm:p-6 transition-transform duration-700 
                     group-hover:scale-[1.06] group-hover:rotate-[1deg]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Shine */}
        <div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-[1200ms] ease-[0.42,0,0.58,1] 
                        bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        {/* Overlay hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent 
                        to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* CTA دسکتاپ بدون سبد خرید */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white/95 to-transparent
                     backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500"
        >
          <button
            onClick={handleNavigate}
            className="w-full bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold py-2 rounded-lg
                       border border-gray-200 hover:border-cyan-500 hover:text-cyan-600 shadow-sm
                       flex items-center justify-center gap-1 transition-all"
          >
            <FiEye className="w-4 h-4" />
            مشاهده جزئیات
          </button>
        </div>
      </div>

      {/* اطلاعات */}
      <div className="flex flex-col grow justify-between p-3 sm:p-5 gap-2 sm:gap-4 bg-white">
        <h3
          onClick={handleNavigate}
          className="cursor-pointer font-bold text-[15px] sm:text-lg text-gray-900 line-clamp-2 
                     leading-snug hover:text-cyan-600 transition-colors duration-300"
        >
          {name}
        </h3>

        {/* قیمت */}
        {price && (
          <div className="flex items-baseline gap-1 sm:gap-2 mb-2">
            <span
              className="text-xl sm:text-3xl font-extrabold 
                             text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-700"
            >
              {formatPrice(price)}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              تومان
            </span>
          </div>
        )}

        {/* وضعیت موجودی */}
        {inStock !== undefined && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold 
                        px-2.5 py-1 rounded-full ${
                          inStock
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                inStock ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {inStock ? "موجود" : "ناموجود"}
          </span>
        )}
      </div>

      {/* CTA موبایل */}
      <Link
        href={productUrl}
        className="sm:hidden w-full bg-gradient-to-r from-cyan-500 to-cyan-600 
                   text-white text-sm font-bold py-2 rounded-b-2xl 
                   flex items-center justify-center gap-1.5 shadow-md 
                   hover:scale-[1.03] transition-all"
      >
        مشاهده <FiArrowLeft className="w-4 h-4" />
      </Link>
    </motion.article>
  );
}
