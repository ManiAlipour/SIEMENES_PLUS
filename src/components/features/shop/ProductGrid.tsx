"use client";

import ProductCard from "../ProductCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiHeart, FiAlertCircle } from "react-icons/fi";
import ListLikeButton from "./ListLikeButton";
import { motion } from "framer-motion";

interface ProductGridProps {
  products: Product[];
  viewMode: "grid" | "list";
  loading?: boolean;
}

export default function ProductGrid({
  products,
  viewMode,
  loading = false,
}: ProductGridProps) {
  const router = useRouter();

  if (loading) {
    // Fancy skeleton loader
    return (
      <div
        className={`grid gap-7 ${
          viewMode === "grid"
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09, duration: 0.35, type: "spring" }}
            className="bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl border border-gray-100/70 shadow-sm animate-pulse overflow-hidden"
          >
            <div className="aspect-square relative flex items-center justify-center bg-gradient-to-br from-gray-200/60 to-gray-100/80">
              <div className="absolute w-16 h-16 bg-gray-200/80 rounded-full blur-md"></div>
            </div>
            <div className="px-6 pb-6 pt-4 space-y-4">
              <div className="h-4 bg-gray-200/70 rounded w-4/5" />
              <div className="h-4 bg-gray-300/50 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    // Fancy "no result" empty state
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-28 px-4 rounded-3xl bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-md"
      >
        <div className="flex items-center justify-center mb-6">
          <span className="flex items-center justify-center bg-primary/10 rounded-full w-32 h-32 shadow-inner">
            <FiAlertCircle className="w-20 h-20 text-primary/80" />
          </span>
        </div>
        <h3 className="text-2xl font-extrabold text-gray-800 mb-2 tracking-tight">
          محصولی پیدا نشد!
        </h3>
        <p className="text-gray-500 text-lg mb-6">
          معیار جستجو یا فیلترها را تغییر دهید تا محصولات بیشتری مشاهده کنید.
        </p>
        <button
          className="bg-gradient-to-r from-primary to-cyan-500 text-white rounded-xl font-bold px-7 py-3 shadow hover:from-cyan-500 hover:to-primary focus:outline-none transition-all duration-200"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          بازگشت به بالا
        </button>
      </motion.div>
    );
  }

  // List mode: Highly designed product cards for list view
  if (viewMode === "list") {
    return (
      <div className="space-y-7">
        {products.map((product, idx) => {
          const productUrl = product.slug
            ? `/products/${product.slug}`
            : `/products/${product._id}`;
          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.36, delay: idx * 0.08 }}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 flex gap-6 overflow-hidden relative"
            >
              <div
                onClick={() => router.push(productUrl)}
                className="relative w-44 sm:w-56 aspect-square bg-gradient-to-br from-cyan-50 to-primary/10 hover:from-primary/10 transition-all duration-300 cursor-pointer overflow-hidden flex-shrink-0 flex items-center justify-center"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 180px, 220px"
                  className="object-contain p-5 scale-95 group-hover:scale-105 group-hover:rotate-2 drop-shadow-xl transition-transform duration-500"
                  draggable={false}
                  priority={idx < 2}
                />
                {product.isFeatured && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-primary/90 to-cyan-600/80 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    ویژه
                  </span>
                )}
              </div>
              <div className="flex flex-col justify-between flex-1 py-6 pr-3 min-w-0">
                <div>
                  <h3
                    onClick={() => router.push(productUrl)}
                    className="cursor-pointer font-bold text-xl text-gray-900 truncate max-w-full group-hover:text-primary transition-colors duration-250"
                  >
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-base text-gray-500 line-clamp-2 mt-2 mb-2 leading-snug">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    {product.brand && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-md">
                        <FiShoppingCart className="w-4 h-4 text-primary/60" />
                        {product.brand}
                      </span>
                    )}
                    {product.category && (
                      <span className="inline-block text-xs text-gray-400 border border-gray-100 bg-gray-50 px-2 py-0.5 rounded-md">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-end justify-between mt-6">
                  <div className="flex items-center gap-2">
                    {/* Placeholder: Insert price, rating etc here */}
                    <span className="text-lg font-bold text-cyan-600">
                      قیمت:
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ListLikeButton productId={product._id} />
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/80 to-cyan-600 text-white rounded-xl font-bold shadow hover:scale-105 active:scale-95 transition-all duration-200"
                      onClick={() => router.push(productUrl)}
                    >
                      <FiShoppingCart className="w-5 h-5" />
                      مشاهده
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Grid Mode - Enhanced UI
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, idx) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.38, delay: idx * 0.045 }}
          className="h-full"
        >
          <ProductCard
            id={product._id}
            name={product.name}
            image={product.image}
            brand={product.brand}
            isFeatured={product.isFeatured}
            slug={product.slug}
            className="h-full rounded-3xl shadow-sm hover:shadow-xl border border-gray-100/90 bg-gradient-to-br from-slate-50/70 to-white/90 transition-all duration-300"
            // Pass anything else or add new custom styling if needed
          />
        </motion.div>
      ))}
    </div>
  );
}
