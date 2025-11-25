"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function TopCategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.data) {
          setCategories(data.data.slice(0, 6) || []);
        }
      } catch (err) {
        console.error("خطا در دریافت دسته‌بندی‌ها:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl border border-gray-200 animate-pulse aspect-square"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  const categoryImages: Record<string, string> = {
    automation: "/images/categories/automation.png",
    electronics: "/images/categories/electronics.png",
    motor: "/images/categories/motor.png",
    instrumentation: "/images/categories/instrumentation.png",
    safety: "/images/categories/safety.png",
    accessories: "/images/categories/accessories.png",
  };

  return (
    <section className="py-12 md:py-16 bg-white">
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
              <FiTrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                دسته‌بندی‌های برتر
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                محبوب‌ترین دسته‌بندی‌های محصولات
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            مشاهده همه
            <FiArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const imageUrl =
              categoryImages[category.slug] ||
              category.image ||
              "/images/categories/automation.png";

            return (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group block bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-4 md:p-6 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                >
                  <div className="relative w-full aspect-square mb-4">
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md"
          >
            مشاهده همه دسته‌بندی‌ها
            <FiArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

