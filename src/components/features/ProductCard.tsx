"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import LikeButton from "./LikeProduct";

// --- Intense UI/UX Redesign for Product Card (vivid, modern, interactive) ---

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
  const productUrl = slug ? `/shop/${slug}` : `/shop/${id}`;
  const handleNavigate = () => router.push(productUrl);

  const formatPrice = (price?: number) =>
    price ? new Intl.NumberFormat("fa-IR").format(price) : null;

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    image,
    brand: { "@type": "Brand", name: brand || "Siemens" },
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.43, ease: [0.33, 1, 0.68, 1], type: "spring" }}
      viewport={{ once: true }}
      aria-label={`کارت محصول ${name}`}
      className={`
        group relative flex flex-col justify-between bg-gradient-to-br from-white via-blue-50 to-cyan-50
        rounded-3xl border border-cyan-100 shadow-lg
        hover:border-cyan-300 hover:shadow-2xl hover:scale-[1.023]
        active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(.33,1,.68,1)]
        overflow-hidden
        ${className}
      `}
    >
      {/* JSON-LD for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(productJsonLd)}
      </script>

      {/* Featured Badge */}
      <AnimatePresence>
        {isFeatured && (
          <motion.div
            initial={{ scale: 0, y: -24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: -24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="
              absolute top-3 left-3 z-20 flex items-center gap-1.5
              bg-gradient-to-br from-yellow-400 via-pink-400 to-cyan-400
              text-white text-[12px] font-black px-3 py-1.5 rounded-2xl
              shadow-xl border-2 border-white/70
              ring-2 ring-yellow-200/60 ring-offset-2
              backdrop-blur-md animate-pulse duration-150
              select-none
            "
          >
            <FiStar className="w-4 h-4 drop-shadow-glow text-white/90" />
            <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.13)]">
              ویژه
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand + LikeButton (Top Bar) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2.5">
        {brand && (
          <span
            className="
              bg-gradient-to-r from-slate-100 via-blue-50 to-cyan-100
              text-[13px] font-bold px-3 py-1 rounded-lg 
              border border-blue-200/60 text-blue-700 shadow
              tracking-tight
              shadow-blue-50
              select-none
            "
          >
            {brand}
          </span>
        )}
        <LikeButton
          className="
            hidden md:flex items-center justify-center 
            rounded-full border-2 border-cyan-200/80
            bg-white/90 hover:bg-cyan-50 text-cyan-500
            w-9 h-9 transition-colors shadow
            hover:scale-[1.09] active:scale-[0.96]
          "
          id={id}
        />
      </div>

      {/* Product Image Section With Animated Overlay */}
      <div
        onClick={handleNavigate}
        className="
          relative aspect-[4/3] sm:aspect-square cursor-pointer
          bg-gradient-to-br from-cyan-50 via-white to-blue-100
          overflow-hidden flex flex-col justify-end items-center
          transition-all
        "
      >
        <Image
          src={image}
          alt={name}
          fill
          loading="lazy"
          sizes="(max-width:640px)100vw, (max-width:1024px)50vw, 25vw"
          className="
            object-contain p-4 sm:p-9
            group-hover:scale-[1.10] group-hover:rotate-[-2deg]
            transition-transform duration-700 will-change-transform
            "
        />
        {/* Glowing Gradient Glow Layer On Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          className="
            absolute inset-0 pointer-events-none
            bg-gradient-to-br from-cyan-300/10 via-blue-200/15 to-white/0
            group-hover:opacity-100 transition-all
            group-hover:blur-[2.5px]
          "
        />
        {/* Decorative: Bottom Arc Shadow */}
        <div className="absolute left-1/2 -bottom-5 -translate-x-1/2 w-24 h-6 bg-cyan-100/45 rounded-b-full blur-xl"></div>
      </div>

      {/* Info Section */}
      <div
        className="
          flex flex-col grow px-3.5 pt-3 pb-4 sm:px-6 sm:pt-6 sm:pb-7 gap-2 sm:gap-5
          bg-gradient-to-b from-white/70 via-white/90 to-cyan-50/55
          relative z-10
        "
      >
        <h3
          onClick={handleNavigate}
          title={name}
          className="
            cursor-pointer font-extrabold text-[16px] sm:text-[21px] leading-snug
            text-zinc-900 line-clamp-2 hover:text-cyan-700 hover:underline
            drop-shadow-[0_1px_0_rgba(6,182,212,0.13)]
            transition-colors duration-200
          "
        >
          {name}
        </h3>

        {/* Price Display */}
        <AnimatePresence>
          {typeof price === "number" && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.16, delay: 0.07 }}
              className="
                flex items-end gap-1.5 mb-1.5
              "
            >
              <span
                className="
                  text-[1.45rem] sm:text-[2.1rem] font-black
                  text-transparent bg-clip-text
                  bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600
                  bg-[length:180%_150%] bg-[left_top]
                  drop-shadow-sm tracking-tight
                  select-text
                  animate-gradient-move
                "
                style={{
                  backgroundSize: "180% 150%",
                  backgroundPosition: "left top",
                }}
              >
                {formatPrice(price)}
              </span>
              <span className="text-[13px] sm:text-base text-gray-500 font-bold mt-1">
                تومان
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stock Status */}
        <AnimatePresence>
          {inStock !== undefined && (
            <motion.span
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 7 }}
              transition={{
                duration: 0.22,
                type: "spring",
                stiffness: 210,
                damping: 17,
              }}
              className={`
                inline-flex items-center gap-2 text-[13px] font-bold
                px-3 py-[5px] rounded-xl border
                ${
                  inStock
                    ? "bg-gradient-to-r from-emerald-50 to-white border-emerald-300 text-emerald-700"
                    : "bg-gradient-to-r from-red-50 to-white border-red-200 text-red-600"
                }
                shadow-inner shadow-emerald-50/40
                select-none
              `}
            >
              <span
                className={`
                  w-2 h-2 rounded-full
                  ${inStock ? "bg-emerald-400" : "bg-red-400"}
                  animate-pulse
                `}
              />
              {inStock ? "موجود در انبار" : "ناموجود"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Mobile section */}
      <div
        className="
          sm:hidden flex items-center justify-between w-full bg-gradient-to-tr from-cyan-600 via-cyan-500 to-cyan-700
          py-2.5 px-2 rounded-b-3xl shadow-[0_6px_18px_rgba(6,182,212,0.22)]
          border-t border-blue-100
        "
      >
        {/* CTA — View */}
        <Link
          href={productUrl}
          className="
            flex-1 flex items-center justify-center gap-2 
            text-[15px] font-bold bg-gradient-to-br from-white/50 to-cyan-100/70
            text-cyan-600 rounded-xl py-2 px-2 shadow hover:bg-white/70
            hover:text-cyan-900 transition-all duration-150
            active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-600/30
            outline-none
          "
        >
          مشاهده
          <FiArrowLeft className="w-5 h-5" />
        </Link>

        {/* Divider */}
        <div className="h-7 w-[1.5px] bg-white/40 mx-1 rounded" />

        {/* CTA — Like */}
        <LikeButton
          id={id}
          className="
            h-[38px] w-[38px] flex items-center justify-center
            bg-white/20 hover:bg-cyan-100/30 hover:text-cyan-700 rounded-lg
            transition-colors duration-150 text-white
            hover:scale-[1.08] active:scale-[0.95]
            border border-cyan-200/60
            shadow
          "
        />
      </div>
    </motion.article>
  );
}
