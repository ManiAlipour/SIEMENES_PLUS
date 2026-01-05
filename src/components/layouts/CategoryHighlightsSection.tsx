"use client";

import React from "react";
import ProductCard from "../features/ProductCard";
import { useCategoryHighlights } from "@/hooks/useCategoryHighlights";
import Link from "next/link";
import { FiArrowLeft, FiTrendingUp, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

// Helper: returns shop URL only if category has products, otherwise undefined
function getShopCategoryUrl(category: { id: string; products: Array<any> }) {
  if (category.products && category.products.length > 0) {
    return `/shop?category=${category.id}`;
  }
  return undefined;
}

export default function CategoryHighlightsSection() {
  const { categories, loading, error } = useCategoryHighlights();

  if (loading) {
    return (
      <section className="pt-16 md:pt-20 pb-12 md:pb-16 w-full bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <FiLoader className="w-6 h-6 text-primary animate-spin" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                دسته‌های منتخب ما
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              در حال بارگذاری دسته‌بندی‌ها...
            </p>
          </motion.div>

          {/* Loading skeleton */}
          {[1, 2, 3].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-16 md:mb-20 last:mb-0"
            >
              {/* Category header skeleton */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                <div>
                  <div className="h-6 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
              </div>

              {/* Products skeleton */}
              <div className="flex gap-3 md:gap-4 overflow-x-auto">
                {[1, 2, 3, 4].map((productIndex) => (
                  <div
                    key={productIndex}
                    className="min-w-[220px] md:min-w-[260px] h-80 bg-gray-200 rounded-2xl animate-pulse"
                  ></div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-16 md:pt-20 pb-12 md:pb-16 w-full bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <FiTrendingUp className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-700">
                خطا در بارگذاری
              </h3>
            </div>
            <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              تلاش مجدد
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-16 md:pt-20 pb-12 md:pb-16 w-full bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 xs:mb-12 md:mb-16 px-2"
        >
          <div className="inline-flex items-center gap-2 mb-3 xs:mb-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FiTrendingUp className="w-5 h-5 xs:w-6 xs:h-6 text-primary" />
            </div>
            <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              دسته‌های منتخب ما
            </h2>
          </div>
          <p className="text-sm xs:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            بهترین محصولات از هر دسته‌بندی را در یک نگاه ببینید
          </p>
        </motion.div>

        {categories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 bg-gray-100 rounded-xl">
                <FiTrendingUp className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-700">
                هیچ دسته‌ای یافت نشد
              </h3>
            </div>
            <p className="text-gray-500 max-w-md mx-auto">
              در حال حاضر هیچ دسته‌بندی منتخبی موجود نیست.
            </p>
          </motion.div>
        ) : (
          categories.map((category, categoryIndex) => {
            const shopUrl = getShopCategoryUrl(category);

            // maximum 4 product preview for compactness and true "همه"
            const previewCount = category.products.length > 4 ? 4 : category.products.length;
            const previewProducts = category.products.slice(0, previewCount);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="mb-16 md:mb-20 last:mb-0"
              >
                {/* Category header */}
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-6 md:mb-8 gap-3 xs:gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg xs:text-xl md:text-2xl font-bold text-gray-900 mb-1 xs:mb-2 truncate">
                      {category.title}
                    </h3>
                    <p className="text-xs xs:text-sm text-gray-600 whitespace-nowrap">
                      {category.products.length} محصول در این دسته
                    </p>
                  </div>
                  {/* Better UX for mobile: Button is more touch-friendly and fixed for overflow, disabled clearly */}
                  {shopUrl ? (
                    <Link
                      href={shopUrl}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary hover:to-primary text-primary hover:text-white px-4 xs:px-5 py-2 xs:py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-primary/20 hover:border-primary text-sm xs:text-base whitespace-nowrap
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      tabIndex={0}
                      aria-label={`مشاهده همه‌ی محصولات دسته ${category.title}`}
                    >
                      <span>مشاهده همه</span>
                      <FiArrowLeft className="w-3 h-3 xs:w-4 xs:h-4" />
                    </Link>
                  ) : (
                    <span
                      className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 px-4 xs:px-5 py-2 xs:py-2.5 rounded-xl font-semibold text-sm xs:text-base cursor-not-allowed select-none"
                      tabIndex={-1}
                      aria-disabled="true"
                      title="محصولی برای نمایش وجود ندارد"
                    >
                      <span>مشاهده همه</span>
                      <FiArrowLeft className="w-3 h-3 xs:w-4 xs:h-4" />
                    </span>
                  )}
                </div>

                {/* Horizontal scrollable products list */}
                <div className="relative">
                  <div
                    className="flex gap-3 md:gap-4 items-stretch overflow-x-auto overscroll-x-contain
                  snap-x snap-mandatory scroll-smooth pb-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100
                  px-1 -mx-1"
                  >
                    {category.products.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-center min-w-[220px] md:min-w-[260px] h-80 bg-gray-50 rounded-2xl border border-gray-200"
                      >
                        <div className="text-center">
                          <FiTrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">
                            هیچ محصولی یافت نشد
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        {previewProducts.map((product, productIndex) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              delay: productIndex * 0.1,
                            }}
                            className="max-w-[150px] xs:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] snap-start shrink-0 flex"
                          >
                            <ProductCard
                              id={product.id}
                              name={product.name}
                              image={product.image}
                              price={product.price}
                              className="h-full"
                            />
                          </motion.div>
                        ))}
                        {category.products.length > previewCount && shopUrl && (
                          // Show a large, visually distinct "مشاهده همه" block at the end of scrollable list for mobile UX
                          <Link
                            href={shopUrl}
                            className="flex flex-col items-center justify-center min-w-[120px] xs:min-w-[150px] md:min-w-[160px] h-80 bg-primary/10 text-primary rounded-2xl font-bold text-base xs:text-lg transition-all duration-300 hover:bg-primary hover:text-white hover:scale-105 shadow group mx-1 snap-start shrink-0"
                            tabIndex={0}
                            aria-label={`نمایش همه محصولات دسته ${category.title}`}
                          >
                            <span className="mb-2 text-sm xs:text-base">+{category.products.length - previewCount} محصول بیشتر</span>
                            <div className="flex items-center gap-2">
                              <span>مشاهده همه</span>
                              <FiArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}
