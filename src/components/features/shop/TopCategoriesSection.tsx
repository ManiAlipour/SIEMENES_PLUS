"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiTrendingUp } from "react-icons/fi";

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
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border-2 border-gray-200 animate-pulse aspect-square shadow-lg" />
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
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 md:mb-12">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-primary via-cyan-500 to-blue-600 rounded-3xl shadow-2xl shadow-primary/30">
              <FiTrendingUp className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                دسته‌بندی‌های برتر
              </h2>
              <p className="text-base md:text-lg text-gray-600 font-medium">
                محبوب‌ترین دسته‌بندی‌های محصولات
              </p>
            </div>
          </div>
          <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-primary hover:text-cyan-600 font-bold transition-colors px-6 py-3 rounded-2xl hover:bg-primary/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 text-base md:text-lg"
            >
              مشاهده همه
              <FiArrowLeft className="w-5 h-5" />
            </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
          {categories.map((category) => {
            const imageUrl =
              categoryImages[category.slug] ||
              category.image ||
              "/images/categories/automation.png";

            return (
              <div key={category._id}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group block bg-gradient-to-br from-white via-gray-50 to-white border-2 border-gray-200 rounded-3xl p-5 md:p-6 hover:border-primary hover:shadow-2xl transition-all duration-500 text-center relative overflow-hidden"
                >
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyan-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative w-full aspect-square mb-5 relative z-10">
                    <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-contain group-hover:drop-shadow-2xl transition-all duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-black text-base md:text-lg text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2 relative z-10">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs md:text-sm text-gray-500 mt-2 line-clamp-2 relative z-10">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 shadow-lg"
            >
              مشاهده همه دسته‌بندی‌ها
              <FiArrowLeft className="w-5 h-5" />
            </Link>
        </div>
      </div>
    </section>
  );
}
