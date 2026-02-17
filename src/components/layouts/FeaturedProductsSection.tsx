"use client";

import { useState, useEffect } from "react";
import ProductCard from "../features/ProductCard";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { FaWandMagicSparkles } from "react-icons/fa6";

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products?isFeatured=true&limit=8");
        const data = await res.json();
        if (data.success && data.items?.length > 0) {
          setProducts(data.items);
        } else {
          // Fallback to default products if no featured products
          const allRes = await fetch("/api/products?limit=6");
          const allData = await allRes.json();
          if (allData.success) {
            setProducts(allData.items || []);
          }
        }
      } catch (err) {
        console.error("خطا در دریافت محصولات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section
        dir="rtl"
        className="pt-16 md:pt-20 pb-12 md:pb-16 w-full bg-background"
        aria-labelledby="featured-products-heading"
      >
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
    <section
      dir="rtl"
      className="pt-16 md:pt-20 pb-12 md:pb-16 w-full bg-background"
      aria-labelledby="featured-products-heading"
    >
      <div className="max-w-7xl mx-auto px-2 md:px-6">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FaWandMagicSparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2
                id="featured-products-heading"
                className="text-2xl md:text-3xl font-bold text-gray-900"
              >
                محصولات پیشنهادی
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                بهترین و محبوب‌ترین محصولات ما
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
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {products.map((product) => (
            <div key={product._id}>
              <ProductCard
                id={product._id}
                name={product.name}
                image={product.image}
                brand={product.brand}
                isFeatured={product.isFeatured}
                slug={product.slug}
                className="h-full"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 md:px-10 py-3 md:py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            aria-label="مشاهده همه محصولات"
          >
            مشاهده همه محصولات
            <FiArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
