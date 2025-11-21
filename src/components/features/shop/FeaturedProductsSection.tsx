"use client";

import { useState, useEffect } from "react";
import ProductCard from "../ProductCard";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaWandMagicSparkles } from "react-icons/fa6";

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products?isFeatured=true&limit=8");
        const data = await res.json();
        if (data.success) {
          setProducts(data.items || []);
        }
      } catch (err) {
        console.error("خطا در دریافت محصولات ویژه:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-white to-primary/5">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 animate-pulse"
              >
                <div className="aspect-square bg-gray-200 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-white to-primary/5">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8 md:mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FaWandMagicSparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                محصولات ویژه
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                بهترین و محبوب‌ترین محصولات ما
              </p>
            </div>
          </div>
          <Link
            href="/shop?sort=-createdAt"
            className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            مشاهده همه
            <FiArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ProductCard
                id={product._id}
                name={product.name}
                image={product.image}
                brand={product.brand}
                isFeatured={product.isFeatured}
                slug={product.slug}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop?sort=-createdAt"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md"
          >
            مشاهده همه محصولات
            <FiArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
