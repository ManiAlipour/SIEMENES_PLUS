"use client";

import React from "react";
import ProductCard from "../features/ProductCard";
import { highlightedCategories } from "@/data/highlighted-categories";
import Link from "next/link";
import { FiArrowLeft, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

export default function CategoryHighlightsSection() {
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
              <FiTrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              دسته‌های منتخب ما
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            بهترین محصولات از هر دسته‌بندی را در یک نگاه ببینید
          </p>
        </motion.div>

        {highlightedCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            className="mb-16 md:mb-20 last:mb-0"
          >
            {/* Category header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.products.length} محصول در این دسته
                </p>
              </div>
              <Link
                href={`/shop?category=${category.id}`}
                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                <span>مشاهده همه</span>
                <FiArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Horizontal scrollable products list */}
            <div className="relative">
              <div className="flex gap-4 md:gap-6 items-stretch overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
                {category.products.map((product, productIndex) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: productIndex * 0.1,
                    }}
                    className="min-w-[260px] md:min-w-[300px] snap-start shrink-0"
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
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
