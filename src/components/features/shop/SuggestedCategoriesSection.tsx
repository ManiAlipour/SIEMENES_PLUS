"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiArrowLeft } from "react-icons/fi";
import { highlightedCategories } from "@/data/highlighted-categories";

export default function SuggestedCategoriesSection() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scroll = (categoryId: string, direction: "left" | "right") => {
    const container = scrollRefs.current[categoryId];
    if (container) {
      const scrollAmount = 280; // Width of one product card + gap
      const newScrollLeft =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fa-IR").format(price);

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          دسته‌بندی‌های پیشنهادی
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          محصولات محبوب و پرفروش در دسته‌بندی‌های مختلف را مشاهده کنید
        </p>
      </motion.div>

      <div className="space-y-10">
        {highlightedCategories.slice(0, 3).map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {categoryIndex + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.products.length} محصول
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Navigation Buttons */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scroll(category.id, "right")}
                  className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all duration-200 shadow-sm"
                >
                  <FiChevronRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scroll(category.id, "left")}
                  className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all duration-200 shadow-sm"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </motion.button>

                {/* View All Button */}
                <Link
                  href={`/shop?category=${category.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
                >
                  مشاهده همه
                  <FiArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Products Scroll Container */}
            <div className="relative">
              <div
                ref={(el) => (scrollRefs.current[category.id] = el)}
                className="flex gap-4 p-6 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {category.products.map((product, productIndex) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: productIndex * 0.05,
                    }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs text-gray-600">تومان</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
