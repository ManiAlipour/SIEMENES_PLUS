"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  FiStar,
  FiArrowLeft,
  FiShoppingCart,
  FiEye,
  FiHeart,
} from "react-icons/fi";
import Link from "next/link";
import LikeButton from "./LikeProduct";

// --- Modern Product Card with Mobile-First Design ---

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

  // Mouse tracking for 3D effect (desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      viewport={{ once: true, margin: "-50px" }}
      aria-label={`کارت محصول ${name}`}
      className={`
        group relative flex flex-col
        bg-white rounded-2xl sm:rounded-3xl
        border border-gray-100 sm:border-cyan-100/80
        shadow-lg sm:shadow-xl
        hover:shadow-xl sm:hover:shadow-[0_25px_50px_-12px_rgba(6,182,212,0.25)]
        hover:scale-[1.01] sm:hover:scale-[1.02] hover:-translate-y-1 sm:hover:-translate-y-2
        active:scale-[0.99] sm:active:scale-[0.98]
        transition-all duration-500 sm:duration-700 ease-out
        overflow-hidden backdrop-blur-sm
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-cyan-100/10
        before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        ${className}
      `}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* JSON-LD for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(productJsonLd)}
      </script>

      {/* Featured Badge */}
      <AnimatePresence>
        {isFeatured && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{
              scale: 1,
              rotate: 0,
              opacity: 1,
              y: [0, -3, 0],
            }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="
              absolute top-3 left-3 sm:top-4 sm:left-4 z-30
              bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400
              text-white text-xs font-black px-3 py-1.5 sm:px-4 sm:py-2
              rounded-xl sm:rounded-2xl shadow-xl
              border-2 border-white/80 backdrop-blur-md select-none
            "
          >
            <div className="flex items-center gap-1.5">
              <FiStar className="w-3 h-3 sm:w-4 sm:h-4 text-white drop-shadow-lg" />
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                ویژه
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Like Button - Top Right */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-3 right-3 sm:hidden z-20"
      >
        <LikeButton
          id={id}
          className="
            flex items-center justify-center
            w-10 h-10 bg-white/95 backdrop-blur-sm
            hover:bg-white text-gray-600 hover:text-red-500
            rounded-full transition-all duration-300
            active:scale-95 border border-gray-200
            shadow-lg hover:shadow-xl
          "
        />
      </motion.div>

      {/* Desktop Top Bar */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-3">
        {brand && (
          <motion.span
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="
              bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50
              text-xs font-bold px-3 py-1.5 rounded-xl
              border border-blue-200/70 text-blue-800 shadow-lg
              backdrop-blur-sm tracking-tight select-none
            "
          >
            {brand}
          </motion.span>
        )}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <LikeButton
            className="
              flex items-center justify-center rounded-full
              border-2 border-cyan-200/80 bg-white/95
              hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50
              text-cyan-500 hover:text-red-500 w-10 h-10
              transition-all duration-300 shadow-lg hover:shadow-xl
              hover:scale-110 active:scale-95 backdrop-blur-sm
            "
            id={id}
          />
        </motion.div>
      </div>

      {/* Product Image Section */}
      <div
        onClick={handleNavigate}
        className="
          relative aspect-[4/3] sm:aspect-square cursor-pointer
          bg-gradient-to-br from-gray-50 via-white to-gray-100
          overflow-hidden transition-all duration-500
          group-hover:shadow-inner
        "
      >
        {/* Desktop Floating Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 right-4 z-20 hidden sm:flex flex-col gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg
                       flex items-center justify-center text-cyan-600 hover:text-cyan-800
                       transition-all duration-200 border border-cyan-200/50"
            onClick={(e) => {
              e.stopPropagation();
              // Add quick view functionality here
            }}
          >
            <FiEye className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg
                       flex items-center justify-center text-pink-600 hover:text-pink-800
                       transition-all duration-200 border border-pink-200/50"
            onClick={(e) => {
              e.stopPropagation();
              // Add add to cart functionality here
            }}
          >
            <FiShoppingCart className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <Image
          src={image}
          alt={name}
          fill
          loading="lazy"
          sizes="(max-width:640px)100vw, (max-width:1024px)50vw, 25vw"
          className="
            object-contain p-4 sm:p-6 md:p-10
            transition-all duration-700 will-change-transform
            group-hover:drop-shadow-2xl
          "
        />

        {/* Multi-layered Glow Effects - Desktop Only */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none hidden sm:block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/15 via-blue-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-tl from-pink-300/10 via-transparent to-purple-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
          <div className="absolute inset-0 bg-radial-gradient from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
        </motion.div>

        {/* Decorative Elements - Desktop Only */}
        <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 w-32 h-8 bg-gradient-to-t from-cyan-100/60 to-transparent rounded-t-full blur-2xl hidden sm:block" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-4 -right-4 w-16 h-16 bg-cyan-200/20 rounded-full blur-xl hidden sm:block"
        />
      </div>

      {/* Product Info Section - Mobile Optimized */}
      <div className="flex flex-col grow p-4 sm:px-7 sm:pt-6 sm:pb-8 gap-3 sm:gap-6 bg-white sm:bg-gradient-to-b sm:from-white/90 sm:via-white/95 sm:to-cyan-50/70 relative z-10">
        {/* Mobile Layout - Compact and Clean */}
        <div className="sm:hidden space-y-3">
          {/* Product Name */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleNavigate}
            title={name}
            className="
              cursor-pointer font-bold text-lg leading-tight
              text-gray-900 line-clamp-2 hover:text-cyan-700
              transition-colors duration-300
            "
          >
            {name}
          </motion.h3>

          {/* Brand and Stock in one line */}
          <div className="flex items-center justify-between">
            {brand && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-cyan-600 font-semibold bg-cyan-50 px-2 py-1 rounded-md"
              >
                {brand}
              </motion.span>
            )}

            <AnimatePresence>
              {inStock !== undefined && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 250,
                    damping: 20,
                    delay: 0.3,
                  }}
                  className={`
                    inline-flex items-center gap-1.5 text-xs font-bold
                    px-2 py-1 rounded-lg border shadow-sm
                    ${
                      inStock
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }
                    select-none
                  `}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`
                      w-2 h-2 rounded-full shadow-inner
                      ${inStock ? "bg-emerald-500" : "bg-red-500"}
                    `}
                  />
                  {inStock ? "موجود" : "ناموجود"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile CTA Button - Full Width */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <Link
              href={productUrl}
              className="
                flex items-center justify-center gap-2 w-full
                text-sm font-bold py-3.5 px-4
                bg-gradient-to-r from-cyan-500 to-blue-600
                hover:from-cyan-600 hover:to-blue-700
                text-white rounded-xl shadow-lg
                transition-all duration-300
                active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-300
                outline-none
              "
            >
              مشاهده
              <FiArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          {/* Product Name */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleNavigate}
            title={name}
            className="
              cursor-pointer font-bold text-lg md:text-2xl
              leading-tight text-gray-900 line-clamp-2
              hover:text-cyan-700 transition-all duration-300
              group-hover:text-transparent group-hover:bg-clip-text
              group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600
            "
          >
            {name}
          </motion.h3>

          {/* Price Display */}
          <AnimatePresence>
            {typeof price === "number" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="flex items-end gap-2"
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="
                    text-2xl md:text-3xl font-black
                    text-transparent bg-clip-text
                    bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500
                    bg-[length:200%_200%] drop-shadow-lg tracking-tight select-text
                  "
                >
                  {formatPrice(price)}
                </motion.span>
                <span className="text-sm text-gray-600 font-bold mb-0.5">
                  تومان
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stock Status */}
          <AnimatePresence>
            {inStock !== undefined && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                  delay: 0.3,
                }}
                className={`
                  inline-flex items-center gap-2 text-sm font-bold
                  px-4 py-2 rounded-xl border-2 shadow-md
                  ${
                    inStock
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }
                  select-none w-fit
                `}
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`
                    w-3 h-3 rounded-full shadow-inner
                    ${inStock ? "bg-emerald-500" : "bg-red-500"}
                  `}
                />
                {inStock ? "موجود" : "ناموجود"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
