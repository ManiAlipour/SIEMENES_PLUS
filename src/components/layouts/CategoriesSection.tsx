"use client";

import { useState, useEffect } from "react";
import CategoryCard from "../features/CategoryCard";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

const defaultCategories = [
  { title: "اتوماسیون صنعتی", image: "/images/categories/automation.png" },
  { title: "الکترونیک صنعتی", image: "/images/categories/electronics.png" },
  { title: "موتور و کنترل", image: "/images/categories/motor.png" },
  { title: "ابزار دقیق", image: "/images/categories/instrumentation.png" },
  { title: "تجهیزات ایمنی", image: "/images/categories/safety.png" },
  { title: "لوازم جانبی", image: "/images/categories/accessories.png" },
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setCategories(data.data.slice(0, 6));
        }
      } catch (err) {
        console.error("خطا در دریافت دسته‌بندی‌ها:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const displayCategories = categories.length > 0
    ? categories.map((cat) => ({
        title: cat.name,
        image: cat.image || `/images/categories/${cat.slug}.png`,
        slug: cat.slug,
      }))
    : defaultCategories;

  return (
    <section className="pt-16 md:pt-20 pb-12 md:pb-16 w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 relative inline-block after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-[3px] after:bg-gradient-to-r after:from-primary after:to-primary/50 after:rounded-full">
            دسته‌بندی‌های محصولات
          </h2>
          <p className="text-gray-600 mt-4">
            دسترسی سریع به انواع محصولات صنعتی
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CategoryCard {...category} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 md:mt-12 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 md:px-10 py-3 md:py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            مشاهده همه دسته‌ها
            <FiArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
